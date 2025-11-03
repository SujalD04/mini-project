import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useInventory } from '../utils/InventoryContext.jsx';
import StatCard from '../components/StatCard.jsx';
import ItemHistoryChart from '../components/ItemHistoryChart.jsx';
import { 
  ArchiveBoxIcon, 
  CurrencyRupeeIcon,
  ExclamationTriangleIcon,
  TagIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const ItemDetailPage = () => {
  // 1. Get the itemId from the URL
  const { itemId } = useParams();
  
  // 2. Get the inventoryMap from our global context
  const { inventoryMap } = useInventory();
  
  // 3. Find the specific item
  const item = inventoryMap.get(itemId);

  // 4. Handle item not found
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
  
  // 5. Render the detail page
  return (
    <div className="space-y-6">
      {/* Back Button & Header */}
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

      {/* Stats Grid */}
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

      {/* History Chart */}
      <ItemHistoryChart historyData={item.historicalData} />
    </div>
  );
};

export default ItemDetailPage;