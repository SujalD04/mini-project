import React, { useState, useMemo, useCallback, createContext, useContext, useEffect } from 'react';
// 1. Remove mock data, import new API
import { fetchInventory } from './api.js'; 
import { toast } from 'react-hot-toast';

// 2. Create the context
const InventoryContext = createContext();

// 3. Create the Provider
export const InventoryProvider = ({ children }) => {
    // 4. Initialize state as empty
    const [inventory, setInventory] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [restockCart, setRestockCart] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [apiError, setApiError] = useState(null);

    // 5. --- NEW: Load real data from API on app start ---
    useEffect(() => {
        const loadData = async () => {
            try {
                const inventoryData = await fetchInventory();
                
                // We must add the 'historicalData' and 'price' etc.
                // that the frontend components expect.
                const formattedInventory = inventoryData.map(item => ({
                    ...item,
                    // --- IMPORTANT ---
                    // The new backend doesn't provide this mock data.
                    // We must add default/mock values for the UI to work.
                    itemId: item.sku, // Use 'sku' as the 'itemId'
                    name: item.sku, // Use 'sku' as the 'name'
                    category: item.sku.startsWith('SKU00') ? 'Electronics' : 'Groceries',
                    price: Math.floor(Math.random() * 10000) + 500,
                    reorderPoint: 50,
                    historicalData: Array(45).fill(0).map(() => ({ "Lag_Sales_D-1": Math.floor(Math.random() * 100) + 10 }))
                }));
                
                setInventory(formattedInventory);
            } catch (err) {
                console.error(err);
                setApiError("Failed to load inventory data from backend.");
                toast.error("Failed to load inventory from backend.");
            }
        };
        loadData();
    }, []); // Empty array means this runs once on mount

    // 6. Create a fast lookup map for inventory items
    const inventoryMap = useMemo(() => 
        new Map(inventory.map(item => [item.itemId, item])), 
    [inventory]);

    // 7. Grouped inventory logic (unchanged)
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

    // 8. generateRestockOrder (now unused, but we'll leave it)
    const generateRestockOrder = useCallback(async (navigateToCart) => {
        console.warn("generateRestockOrder is deprecated.");
        // This function is no longer used in the on-demand flow
        // but we keep it here to prevent the CartPage from crashing.
    }, []);

    // 9. Define what the context provides (unchanged)
    const value = {
        inventory,
        restockCart,
        groupedInventory,
        searchTerm,
        setSearchTerm,
        isGenerating,
        apiError,
        generateRestockOrder,
        inventoryMap
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};

// 10. Create a custom hook for easy access (unchanged)
export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};