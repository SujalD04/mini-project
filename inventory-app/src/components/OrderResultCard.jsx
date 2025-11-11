import React from 'react';
import { formatINR } from '../utils/dataLogic.js';
import { CheckCircleIcon, TruckIcon, BuildingOfficeIcon, TagIcon, CloudIcon } from '@heroicons/react/24/solid';
import StatCard from './StatCard.jsx'; // We'll reuse your StatCard!

/**
 * A card to display the full AI decision from the FastAPI backend.
 */
const OrderResultCard = ({ decision }) => {
  if (!decision) return null;

  // --- IMPORTANT ---
  // Adjust these keys (e.g., 'recommended_warehouse', 'total_cost')
  // to match the EXACT JSON keys your friend's API returns.
  const {
    sku,
    forecast = 0,
    recommended_warehouse = 'N/A',
    transport = 'N/A',
    total_cost = 0,
    order_quantity = 0, // Ask your friend to add this if he hasn't
  } = decision;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-indigo-200">
      <div className="flex items-center">
        <CheckCircleIcon className="h-10 w-10 text-green-500" />
        <h2 className="ml-3 text-2xl font-bold text-gray-900">
          AI-Generated Order
        </h2>
      </div>
      <p className="mt-2 text-gray-600">
        The decision model has analyzed the forecast, inventory levels, and logistics costs to find the optimal solution for SKU: <strong>{sku}</strong>.
      </p>

      <div className="mt-6 space-y-4">
        {/* Main Recommendation */}
        <div className="bg-indigo-50 p-4 rounded-lg">
          <p className="text-sm font-medium text-indigo-700">Recommended Action</p>
          <p className="text-2xl font-bold text-indigo-900">
            Order {order_quantity} units
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
      </div>
    </div>
  );
};

export default OrderResultCard;