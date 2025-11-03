import React, { useState, useMemo, useCallback } from 'react';

// === IMPORTING PAGES AND COMPONENTS ===
import InventoryPage from './pages/InventoryPage';
import CartPage from './pages/CartPage';
import StatsPage from './pages/StatsPage';
import TabButton from './components/TabButton'; 

// === IMPORTING UTILITIES ===
import { generateMockInventory } from './utils/dataLogic';
// --- MODIFIED ---
// Import our new batch function
import { fetchBatchRecommendations } from './utils/api';
// --- END MODIFICATION ---

// --- State and Logic Hook ---

const useInventoryState = () => {
    const [inventory, setInventory] = useState(() => generateMockInventory());
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('inventory');
    const [restockCart, setRestockCart] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [apiError, setApiError] = useState(null);
    
    // --- ADDED ---
    // Create a fast lookup map for inventory items. (More professional)
    const inventoryMap = useMemo(() => 
        new Map(inventory.map(item => [item.itemId, item])), 
    [inventory]);
    // --- END ADDED ---
    
    // Memoized filtered list for the Inventory view
    const filteredInventory = useMemo(() => {
        let results = inventory.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const grouped = results.reduce((acc, item) => {
            acc[item.category] = acc[item.category] || [];
            acc[item.category].push(item);
            return acc;
        }, {});

        const sortedKeys = Object.keys(grouped).sort();
        const sortedGrouped = {};
        sortedKeys.forEach(key => {
            sortedGrouped[key] = grouped[key];
        });

        return sortedGrouped;
    }, [inventory, searchTerm]);


    // --- THIS IS THE CORE CHANGE ---
    // Function to handle the Restock generation button
    const generateRestockOrder = useCallback(async () => { // Make function async
        setIsGenerating(true);
        setApiError(null); 
        setRestockCart([]); 

        try {
            // 1. Call the new batch API function ONCE
            // This sends all items and gets back a list of recommendations
            const recommendations = await fetchBatchRecommendations(inventory);

            const newCart = [];
            
            // 2. Process the results list
            for (const rec of recommendations) {
                
                // 3. Check the AI Agent's decision
                if (rec.recommendation === 'Restock') {
                    
                    // 4. Get the original item data from our fast lookup map
                    const item = inventoryMap.get(rec.itemId);

                    if (item) {
                        // 5. Add item to cart using data from the AI
                        // We combine the original item data (name, price) 
                        // with the new recommendation data (predictedDemand, etc.)
                        newCart.push({ 
                            ...item, // (name, price, category, etc.)
                            predictedDemand: rec.predicted_demand_next_7_days,
                            orderQuantity: rec.suggested_quantity,
                            reorderPoint: rec.reorder_point,
                            status: item.currentStock < rec.reorder_point ? 'Critical Low' : 'Restock',
                            badgeColor: item.currentStock < rec.reorder_point ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800',
                            isCritical: item.currentStock < rec.reorder_point,
                        });
                    }
                }
            } // End of loop

            // 6. Sort critical items first and update the cart state
            newCart.sort((a, b) => b.isCritical - a.isCritical);
            setRestockCart(newCart);
            setActiveTab('cart'); // Automatically switch to the cart

        } catch (err) {
            console.error("A critical error occurred:", err);
            // Use the actual error message from the API
            setApiError(err.message || "Failed to connect to the AI model. Is the Flask server running?");
        } finally {
            setIsGenerating(false); // Stop the loading spinner
        }
        
    }, [inventory, inventoryMap]); // Dependencies updated

    return {
        activeTab, 
        setActiveTab,
        searchTerm, 
        setSearchTerm,
        filteredInventory,
        restockCart,
        generateRestockOrder,
        isGenerating,
        apiError 
    };
};

// --- MAIN APP COMPONENT ---
// This component is UNCHANGED, as all logic is in the hook.
const App = () => {
    const { 
        activeTab, setActiveTab, 
        searchTerm, setSearchTerm, 
        filteredInventory, 
        restockCart, 
        generateRestockOrder,
        isGenerating,
        apiError 
    } = useInventoryState();

    const renderPage = () => {
        switch (activeTab) {
            case 'inventory':
                return (
                    <InventoryPage 
                        groupedInventory={filteredInventory} 
                        searchTerm={searchTerm} 
                        onSearchChange={setSearchTerm} 
                    />
                );
            case 'cart':
                return (
                    <CartPage 
                        restockCart={restockCart} 
                        generateRestockOrder={generateRestockOrder}
                        isGenerating={isGenerating}
                    />
                );
            case 'statistics':
                return <StatsPage />;
            default:
                return <InventoryPage groupedInventory={filteredInventory} searchTerm={searchTerm} onSearchChange={setSearchTerm} />;
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans p-4 sm:p-8">
            <div className="max-w-6xl mx-auto">
                <header className="mb-8 text-center">
                    <h1 className="text-4xl font-extrabold text-gray-900 mb-2">
                        AI Inventory Management System
                    </h1>
                    <p className="text-xl text-indigo-600">Automated Restocking and Forecasting</p>
                </header>

                <div className="bg-white rounded-2xl shadow-2xl p-6">
                    {/* Tab Navigation */}
                    <nav className="flex space-x-4 border-b border-gray-200">
                        <TabButton tabName="inventory" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton tabName="cart" activeTab={activeTab} setActiveTab={setActiveTab} />
                        <TabButton tabName="statistics" activeTab={activeTab} setActiveTab={setActiveTab} />
                    </nav>

                    {/* --- ADDED ERROR DISPLAY --- */}
                    {apiError && (
                        <div className="p-4 my-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                            <strong>Error:</strong> {apiError}
                        </div>
                    )}
                    {/* --- END ADDED --- */}

                    {/* Tab Content */}
                    {renderPage()}
                </div>
            </div>
        </div>
    );
};

export default App;