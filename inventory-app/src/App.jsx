import React, { useState, useMemo, useCallback } from 'react';

// === IMPORTING PAGES AND COMPONENTS ===
// Note the correct relative paths for the modules:

// Pages
import InventoryPage from './pages/InventoryPage';
import CartPage from './pages/CartPage';
import StatsPage from './pages/StatsPage';

// Components (We need the TabButton component here)
import TabButton from './components/TabButton'; 

// Utilities
import { generateMockInventory, mockPredictDemand, calculateRestockOrder } from './utils/dataLogic';

// --- State and Logic Hook ---

const useInventoryState = () => {
    const [inventory, setInventory] = useState(() => generateMockInventory());
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('inventory');
    const [restockCart, setRestockCart] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    
    // Memoized filtered list for the Inventory view
    const filteredInventory = useMemo(() => {
        let results = inventory.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Group by category
        const grouped = results.reduce((acc, item) => {
            acc[item.category] = acc[item.category] || [];
            acc[item.category].push(item);
            return acc;
        }, {});

        // Sort categories alphabetically
        const sortedKeys = Object.keys(grouped).sort();
        const sortedGrouped = {};
        sortedKeys.forEach(key => {
            sortedGrouped[key] = grouped[key];
        });

        return sortedGrouped;
    }, [inventory, searchTerm]);

    // Function to handle the Restock generation button
    const generateRestockOrder = useCallback(() => {
        setIsGenerating(true);
        // In a real app, this would be an API call to your FastAPI service
        setTimeout(() => {
            const newCart = [];
            inventory.forEach(item => {
                // This is where your TensorFlow model prediction would go
                const predictedDemand = mockPredictDemand(item);
                const orderResult = calculateRestockOrder(item, predictedDemand);
                
                if (orderResult.orderQuantity > 0) {
                    newCart.push({ ...item, ...orderResult });
                }
            });
            // Sort critical items first
            newCart.sort((a, b) => b.isCritical - a.isCritical);
            setRestockCart(newCart);
            setIsGenerating(false);
            setActiveTab('cart'); // Automatically switch to the cart
        }, 1500); 
    }, [inventory]);

    return {
        activeTab, 
        setActiveTab,
        searchTerm, 
        setSearchTerm, // Retained only once
        filteredInventory,
        restockCart,
        generateRestockOrder,
        isGenerating,
        // Removed duplicate setSearchTerm entry
    };
};

// --- MAIN APP COMPONENT ---

const App = () => {
    const { 
        activeTab, setActiveTab, 
        searchTerm, setSearchTerm, 
        filteredInventory, 
        restockCart, 
        generateRestockOrder,
        isGenerating
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

                    {/* Tab Content */}
                    {renderPage()}
                </div>
            </div>
        </div>
    );
};

export default App;