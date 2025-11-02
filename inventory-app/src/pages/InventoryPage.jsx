import React from 'react';
// FIX: Appending the .js extension for explicit module resolution
import { formatINR } from '../utils/dataLogic.js';

const InventoryPage = ({ groupedInventory, searchTerm, onSearchChange }) => {
    return (
        <div>
            <div className="p-4 flex flex-col sm:flex-row justify-between items-center bg-gray-50 rounded-lg mt-4 shadow-sm border border-gray-100 space-y-3 sm:space-y-0">
                <h2 className="text-xl font-semibold text-gray-800">Current Inventory Overview</h2>
                <input
                    type="text"
                    placeholder="Search item or category..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-64 transition-shadow"
                />
            </div>
            
            <div className="space-y-6 mt-4">
                {Object.keys(groupedInventory).length === 0 && (
                    <p className="text-center text-gray-500 py-10">No items found matching "{searchTerm}".</p>
                )}
                
                {Object.keys(groupedInventory).map(category => (
                    <div key={category} className="bg-white p-4 rounded-xl shadow-lg border border-gray-100">
                        <h2 className="text-xl font-bold text-indigo-700 mb-3 border-b pb-2">{category} ({groupedInventory[category].length} items)</h2>
                        <div className="space-y-2">
                            {groupedInventory[category].map(item => (
                                <div key={item.itemId} className="p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm hover:bg-gray-100 transition-colors">
                                    <div className="flex-1 min-w-0 mb-2 sm:mb-0">
                                        <p className="font-semibold text-gray-800 truncate">{item.name}</p>
                                        <p className="text-gray-500 text-xs">ID: {item.itemId} | Last Sold: {item.lastSold}</p>
                                    </div>
                                    <div className="flex w-full sm:w-auto space-x-6 text-right justify-end">
                                        <div className="w-24">
                                            <p className="font-bold">{item.currentStock}</p>
                                            <p className="text-xs text-gray-500">Stock</p>
                                        </div>
                                        <div className="w-24">
                                            {/* Use the helper function here */}
                                            <p className="font-bold text-green-600">{formatINR(item.price)}</p>
                                            <p className="text-xs text-gray-500">Unit Price</p>
                                        </div>
                                        <div className="w-24">
                                            <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${item.currentStock < item.reorderPoint ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                                                ROP: {item.reorderPoint}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default InventoryPage;
