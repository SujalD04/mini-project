import React from 'react';
// 1. Import Link
import { Link } from 'react-router-dom'; 
import { useInventory } from '../utils/InventoryContext.jsx';
import { formatINR } from '../utils/dataLogic.js';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

const InventoryPage = () => {
  // Get state and setters from the context
  const { groupedInventory, searchTerm, setSearchTerm } = useInventory();

  return (
    <div className="space-y-6">
      {/* Page Header with Search */}
      <div className="bg-white p-4 rounded-xl shadow-lg border border-gray-100 flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Inventory Overview</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Search item or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 w-full sm:w-72"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>
      
      {/* Inventory List */}
      <div className="space-y-6">
        {Object.keys(groupedInventory).length === 0 && (
          <p className="text-center text-gray-500 py-10">No items found matching "{searchTerm}".</p>
        )}
        
        {Object.keys(groupedInventory).map(category => (
          <div key={category} className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-xl font-bold text-indigo-700 mb-4 border-b border-gray-200 pb-2">{category} ({groupedInventory[category].length} items)</h2>
            <div className="space-y-3">
              {groupedInventory[category].map(item => (
                // 2. Wrap the entire item div in a Link component
                <Link 
                  key={item.itemId} // 3. Move key to the Link
                  to={`/inventory/${item.itemId}`}
                  className="block rounded-lg" // Make the link a block element
                >
                  <div className="p-3 bg-gray-50 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm hover:bg-indigo-50 hover:shadow-md transition-all">
                    
                    {/* Item Info */}
                    <div className="flex-1 min-w-0 mb-2 sm:mb-0 pr-4">
                      <p className="font-semibold text-gray-900 truncate">{item.name}</p>
                      <p className="text-gray-500 text-xs">ID: {item.itemId}</p>
                    </div>
                    
                    {/* Item Stats */}
                    <div className="flex w-full sm:w-auto space-x-4 text-right justify-end">
                      <div className="w-24">
                        <p className="text-xs text-gray-500 uppercase font-medium">Stock</p>
                        <p className="font-bold text-lg text-gray-800">{item.currentStock}</p>
                      </div>
                      <div className="w-24">
                        <p className="text-xs text-gray-500 uppercase font-medium">Unit Price</p>
                        <p className="font-bold text-lg text-green-600">{formatINR(item.price)}</p>
                      </div>
                      <div className="w-24">
                        <p className="text-xs text-gray-500 uppercase font-medium">ROP</p>
                        <span className={`px-2.5 py-1 text-sm font-semibold rounded-full ${item.currentStock < item.reorderPoint ? 'bg-red-100 text-red-800' : 'bg-gray-200 text-gray-700'}`}>
                          {item.reorderPoint}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
                // 4. End of Link component
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default InventoryPage;