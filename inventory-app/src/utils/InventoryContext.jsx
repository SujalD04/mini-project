import React, { useState, useMemo, useCallback, createContext, useContext, useEffect } from 'react';
import { fetchInventory } from './api.js'; 
import { toast } from 'react-hot-toast';

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
    const [inventory, setInventory] = useState([]); 
    const [searchTerm, setSearchTerm] = useState('');
    const [restockCart, setRestockCart] = useState([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [apiError, setApiError] = useState(null);

    // Load real data from API on app start
    useEffect(() => {
        const loadData = async () => {
            try {
                const inventoryData = await fetchInventory();
                
                // Add frontend-specific mock data
                const formattedInventory = inventoryData.map(item => ({
                    ...item,
                    itemId: item.sku, 
                    name: item.sku, 
                    currentStock: item.quantity_units, 
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

    // Obsolete function, kept to prevent crashes on CartPage
    const generateRestockOrder = useCallback(async (navigateToCart) => {
        console.warn("generateRestockOrder is deprecated.");
        toast.error("This function is disabled. Please run analysis on the Item Detail page.");
    }, []);

    // --- NEW FUNCTION TO ADD ITEMS TO CART ---
    const addItemToCart = useCallback((decision) => {
        // Get the full original item details
        const item = inventoryMap.get(decision.sku);
        if (!item) {
            toast.error("Error: Could not find original item data.");
            return;
        }

        // Check if item is already in cart
        if (restockCart.find(cartItem => cartItem.itemId === decision.sku)) {
            toast.error("Item is already in the restock cart.");
            return;
        }

        // Create the new cart item
        const newCartItem = {
            ...item, // (price, category, name, etc.)
            predictedDemand: decision.forecast,
            orderQuantity: decision.order_quantity,
            // Using total_cost as reorderPoint is likely not what you want
            // Let's use the item's original reorderPoint
            reorderPoint: item.reorderPoint,
            status: item.currentStock < item.reorderPoint ? 'Critical Low' : 'Restock',
            badgeColor: item.currentStock < item.reorderPoint ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800',
            isCritical: item.currentStock < item.reorderPoint,
        };

        // Add the new item to the cart state
        setRestockCart(prevCart => [...prevCart, newCartItem]);
        toast.success(`${item.name} added to restock cart!`);
    }, [inventoryMap, restockCart]); // Add dependencies

    // --- UPDATE THE CONTEXT VALUE ---
    const value = {
        inventory,
        restockCart,
        groupedInventory,
        searchTerm,
        setSearchTerm,
        isGenerating,
        apiError,
        generateRestockOrder,
        inventoryMap,
        addItemToCart, // <-- Provide the new function
    };

    return (
        <InventoryContext.Provider value={value}>
            {children}
        </InventoryContext.Provider>
    );
};

// Custom hook for easy access (unchanged)
export const useInventory = () => {
    const context = useContext(InventoryContext);
    if (context === undefined) {
        throw new Error('useInventory must be used within an InventoryProvider');
    }
    return context;
};