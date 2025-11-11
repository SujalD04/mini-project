import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInventory } from '../utils/InventoryContext.jsx';
import StatCard from '../components/StatCard.jsx';
import ItemHistoryChart from '../components/ItemHistoryChart.jsx';
import { 
  ArchiveBoxIcon, 
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ArrowLeftIcon,
  BoltIcon // For the new button
} from '@heroicons/react/24/outline';

// --- 1. Import new components ---
import { fetchDecisionForItem } from '../utils/api.js';
import OrderResultCard from '../components/OrderResultCard.jsx';
import { toast } from 'react-hot-toast'; // We'll use our existing toast

const ItemDetailPage = () => {
  const { itemId } = useParams();
  const { inventoryMap } = useInventory();
  const item = inventoryMap.get(itemId);

  // --- 2. Add state for the decision and loading ---
  const [decision, setDecision] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- 3. Add the API call handler ---
  const handleRunAnalysis = async () => {
    setIsLoading(true);
    setDecision(null);
    const toastId = toast.loading('Running AI Decision Model...');

    try {
      // Call the new API function
      const result = await fetchDecisionForItem(item.itemId); // Use item.itemId
      setDecision(result);
      toast.success('AI Decision Complete!', { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error(err.message, { id: toastId });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle item not found (unchanged)
  if (!item) {
    return (
      <div className="text-center">
        <h1 className="text-2xl font-bold text-red-600">Item Not Found</h1>
        <p className="text-gray-500">Could not find an item with ID: {itemId}</p>
        <Link to="/inventory" className="text-indigo-600 hover:underline mt-4 inline-block">
          &larr; Back to Inventory
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Back Button & Header (unchanged) */}
      <div className="flex items-center justify-between">
        <Link 
          to="/inventory" 
          className="flex items-center text-sm text-gray-500 hover:text-indigo-600 transition-colors"
        >
          <ArrowLeftIcon className="h-4 w-4 mr-1" />
          Back to Inventory
        </Link>
        <span className="px-3 py-1 text-xs font-medium bg-gray-200 text-gray-700 rounded-full">
          ID: {item.itemId}
        </span>
      </div>
      <h1 className="text-4xl font-extrabold text-gray-900">{item.name}</h1>
      
      {/* Stats Grid (Unchanged) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Current Stock"
          value={item.currentStock}
          description="Units currently in warehouse"
          icon={ArchiveBoxIcon}
          color={item.currentStock < item.reorderPoint ? "red" : "blue"}
        />
        <StatCard 
          title="Reorder Point"
          value={item.reorderPoint}
          description="Stock level to trigger reorder"
          icon={ExclamationTriangleIcon}
          color="red"
        />
        <StatCard 
          title="Unit Price"
          value={item.price}
          description="Current price per unit"
          icon={CurrencyRupeeIcon}
          color="green"
        />
        <StatCard 
          title="Category"
          value={item.category}
          description="Product category group"
          icon={TagIcon}
          color="indigo"
        />
      </div>

      {/* --- 4. Add the Analysis Section --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* This is the new card that will show the result */}
          {decision ? (
            <OrderResultCard decision={decision} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center bg-gray-50 p-8 rounded-xl border-2 border-dashed border-gray-300">
              <BoltIcon className="h-16 w-16 text-gray-400" />
              <h3 className="mt-2 text-xl font-semibold text-gray-900">Run AI Analysis</h3>
              <p className="mt-1 text-sm text-gray-500 text-center">
                Click the button to run the decision-focused model for this SKU.
              </p>
            </div>
          )}
        </div>
        
        {/* This is the button to trigger it */}
        <div className="lg:col-span-1">
          <button
            onClick={handleRunAnalysis}
            disabled={isLoading}
            className={`w-full h-full flex flex-col items-center justify-center p-6 text-xl font-bold rounded-xl transition-all duration-300 shadow-lg 
              ${isLoading 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5'}`
            }
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-6 w-6 text-white mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Running...</span>
              </>
            ) : (
              <>
                <BoltIcon className="h-8 w-8 mb-2" />
                Run AI Decision
              </>
            )}
          </button>
        </div>
      </div>

      {/* History Chart (Unchanged) */}
      <ItemHistoryChart historyData={item.historicalData} />
    </div>
  );
};

export default ItemDetailPage;