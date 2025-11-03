import React from 'react';
import { useInventory } from '../utils/InventoryContext.jsx';
import StatCard from '../components/StatCard.jsx';
import ChartComponent from '../components/ChartComponent.jsx';
import { 
  ArchiveBoxIcon, 
  ShoppingCartIcon, 
  CurrencyRupeeIcon,
  ExclamationCircleIcon 
} from '@heroicons/react/24/outline';

const DashboardPage = () => {
  // Get data from the global context
  const { inventory, restockCart } = useInventory();

  // Calculate stats
  const totalItems = inventory.length;
  const itemsToRestock = restockCart.length;
  const criticalItems = restockCart.filter(item => item.isCritical).length;
  const totalOrderValue = restockCart.reduce((sum, item) => sum + (item.orderQuantity * item.price), 0);

  return (
    <div className="space-y-6">
      {/* 1. Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Products"
          value={totalItems}
          description="Total SKUs in inventory"
          icon={ArchiveBoxIcon}
          color="blue"
        />
        <StatCard 
          title="Items to Restock"
          value={itemsToRestock}
          description="Items in the new AI order"
          icon={ShoppingCartIcon}
          color="indigo"
        />
        <StatCard 
          title="Critical Stock"
          value={criticalItems}
          description="Items below reorder point"
          icon={ExclamationCircleIcon}
          color="red"
        />
        <StatCard 
          title="Total Order Value"
          value={totalOrderValue}
          description="Estimated cost of new order"
          icon={CurrencyRupeeIcon}
          color="green"
        />
      </div>

      {/* 2. Chart Component */}
      <ChartComponent />

      {/* 3. Placeholder for other components */}
    </div>
  );
};

export default DashboardPage;