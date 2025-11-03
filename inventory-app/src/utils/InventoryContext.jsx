import React, { useState, useMemo, useCallback, createContext, useContext } from 'react';
import { generateMockInventory } from './dataLogic.js';
import { fetchBatchRecommendations } from './api.js';

// 1. Create the context
const InventoryContext = createContext();

// 2. Create the Provider (this will wrap your whole app)
export const InventoryProvider = ({ children }) => {
    // All your existing state from App.jsx is moved here
    const [inventory, setInventory] = useState(() => generateMockInventory());
    const [searchTerm, setSearchTerm] = useState('');
    const [restockCart, setRestockCart] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Create a fast lookup map for inventory items
    const inventoryMap = useMemo(() => 
        new Map(inventory.map(item => [item.itemId, item])), 
    [inventory]);

    // Grouped inventory logic
    const groupedInventory = useMemo(() => {
        let results = inventory.filter(item => 
            item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const grouped = results.reduce((acc, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, {});
        const sortedKeys = Object.keys(grouped).sort();
        const sortedGrouped = {};
        sortedKeys.forEach(key => {
            sortedGrouped[key] = grouped[key];
        });
        return sortedGrouped;
    }, [inventory, searchTerm]);

    // API call logic (unchanged, but now lives in the provider)
    const generateRestockOrder = useCallback(async (navigateToCart) => {
        setIsGenerating(true);
        setApiError(null); 
        setRestockCart([]); 

        try {
            const recommendations = await fetchBatchRecommendations(inventory);
            const newCart = [];
            
            for (const rec of recommendations) {
                if (rec.recommendation === 'Restock') {
                    const item = inventoryMap.get(rec.itemId);
                    if (item) {
                        newCart.push({ 
                            ...item,
                            predictedDemand: rec.predicted_demand_next_7_days,
                            orderQuantity: rec.suggested_quantity,
                            reorderPoint: rec.reorder_point,
                            status: item.currentStock < rec.reorder_point ? 'Critical Low' : 'Restock',
                            badgeColor: item.currentStock < rec.reorder_point ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800',
                            isCritical: item.currentStock < rec.reorder_point,
                        });
                    }
                }
            } 
            newCart.sort((a, b) => b.isCritical - a.isCritical);
            setRestockCart(newCart);
            navigateToCart(); // This will navigate to the cart page on success
        } catch (err) {
            console.error("A critical error occurred:", err);
            setApiError(err.message || "Failed to connect to the AI model.");
        } finally {
            setIsGenerating(false);
        }
    }, [inventory, inventoryMap]);

    // 3. Define what the context provides
    const value = {
        inventory,
        restockCart,
        groupedInventory,
        searchTerm,
        setSearchTerm,
        isGenerating,
        apiError,
        generateRestockOrder,
        inventoryMap // Provide map for other components
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};

// 4. Create a custom hook for easy access
export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};