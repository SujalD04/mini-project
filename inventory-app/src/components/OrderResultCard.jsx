import React from 'react';
import { formatINR } from '../utils/dataLogic.js';
import { CheckCircleIcon, TruckIcon, BuildingOfficeIcon, TagIcon, CloudIcon, ShoppingCartIcon, MapIcon } from '@heroicons/react/24/solid';
import StatCard from './StatCard.jsx';
import { useInventory } from '../utils/InventoryContext.jsx';
// 1. Import useNavigate and warehouse/store data
import { useNavigate } from 'react-router-dom';
import { warehouses, storeLocations } from '../utils/warehouseData.js';
import { toast } from 'react-hot-toast';

/**
 * A card to display the full AI decision from the FastAPI backend.
 */
const OrderResultCard = ({ decision }) => {
  const { addItemToCart } = useInventory(); 
  // 2. Initialize the navigate function
  const navigate = useNavigate();

  if (!decision) return null;

  const {
    sku,
    forecast = 0,
    recommended_warehouse = 'N/A', // This should be an ID like 'wh-in-002'
    transport = 'N/A',
    total_cost = 0,
    order_quantity = 0,
    // --- IMPORTANT ---
    // We need the store_id that this decision was for.
    // Ask your friend to add 'store_id' to his API response.
    // For now, we'll assume 'S001' from the item page.
    store_id = 'S001', 
  } = decision;

  const handleAddToCart = () => {
    addItemToCart(decision);
  };

  // 3. Handle the "View on Map" click
  const handleViewOnMap = () => {
    // Find the warehouse object from our data file
    // We must match the ID from the API (e.g., "W001")
    // with the ID in our warehouseData.js (e.g., "wh-in-001")
    //
    // --- THIS IS A CRITICAL MATCHING STEP ---
    // You may need to update the IDs in warehouseData.js
    // Normalize backend warehouse ID, e.g. "W5" → "W005"
  const normalizedWarehouseId = recommended_warehouse.startsWith("W")
    ? recommended_warehouse.replace(/^W(\d+)$/, (_, n) => `W${n.padStart(3, "0")}`)
    : recommended_warehouse;

  const startWarehouse = warehouses.find(wh => wh.id === normalizedWarehouseId);

    
    // Get the destination store
    const endStore = storeLocations[store_id]; 

    if (!startWarehouse) {
      toast.error(`Error: Could not find map data for warehouse ID "${recommended_warehouse}".`);
      return;
    }
    if (!endStore) {
      toast.error(`Error: Could not find map data for store ID "${store_id}".`);
      return;
    }

    // 4. Pass the coordinates to the /logistics page via URL params
    navigate(
      `/logistics?startLat=${startWarehouse.pos[0]}&startLng=${startWarehouse.pos[1]}&endLat=${endStore.pos[0]}&endLng=${endStore.pos[1]}`
    );
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
      <div className="flex items-center">
        <CheckCircleIcon className="h-10 w-10 text-green-500" />
        <h2 className="ml-3 text-2xl font-bold text-gray-900">
          AI-Generated Order
        </h2>
      </div>
      <p className="mt-2 text-gray-600">
        The decision model has analyzed the forecast, inventory levels, and logistics costs for SKU: <strong>{sku}</strong>.
      </p>

      <div className="mt-6 space-y-4">
        {/* Main Recommendation */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-indigo-700">Recommended Action</p>
          <p className="text-2xl font-bold text-indigo-900">
            Order {order_quantity.toFixed(0)} units
          </p>
          <div className="flex items-center space-x-4 mt-2">
            <span className="flex items-center text-sm text-gray-700">
              <BuildingOfficeIcon className="h-5 w-5 mr-1.5 text-gray-500" />
              From: <strong>{recommended_warehouse}</strong>
            </span>
            <span className="flex items-center text-sm text-gray-700">
              <TruckIcon className="h-5 w-5 mr-1.5 text-gray-500" />
              Via: <strong>{transport}</strong>
            </span>
          </div>
        </div>

        {/* Supporting Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <StatCard
            title="7-Day Demand Forecast"
            value={`${forecast.toFixed(0)} units`}
            icon={CloudIcon}
            color="blue"
          />
          <StatCard
            title="Estimated Total Cost"
            value={formatINR(total_cost)}
            icon={TagIcon}
            color="green"
          />
        </div>
        
        {/* --- 5. UPDATED BUTTONS --- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleViewOnMap}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-base font-bold rounded-lg transition-all duration-300 shadow-md 
                       bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg"
          >
            <MapIcon className="h-6 w-6" />
            <span>View on Map</span>
          </button>
          <button
            onClick={handleAddToCart}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-base font-bold rounded-lg transition-all duration-300 shadow-md 
                       bg-green-600 text-white hover:bg-green-700 hover:shadow-lg"
          >
            <ShoppingCartIcon className="h-6 w-6" />
            <span>Add to Cart</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderResultCard;