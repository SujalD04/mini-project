import React from 'react';
// FIX: Appending the .jsx extension for the component
import StatCard from '../components/StatCard.jsx';
// FIX: Appending the .js extension for the utility file
import { SAFETY_STOCK, MIN_ORDER_QTY } from '../utils/dataLogic.js';

const StatsPage = () => (
    <div className="p-4 space-y-6">
        <h3 className="text-xl font-bold text-gray-800 border-b pb-2">AI Forecasting & Metrics</h3>
        
        <div className="grid md:grid-cols-3 gap-6">
            <StatCard title="Total Products" value="80" description="Across 8 distinct categories" />
            <StatCard title="Safety Stock (S)" value={`${SAFETY_STOCK} units`} description="Buffer against demand uncertainty" />
            <StatCard title="Case Size" value={`${MIN_ORDER_QTY} units`} description="Minimum order quantity" />
        </div>

        <h3 className="text-lg font-semibold text-gray-700 pt-4">Model Performance (Mock Data)</h3>
        <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 transition-shadow hover:shadow-lg">
                <p className="text-sm font-semibold text-indigo-600 mb-2">Key Metric: RMSE</p>
                <p className="text-3xl font-bold text-gray-900">7.29 units</p>
                <p className="text-xs text-gray-500">Root Mean Squared Error (Average prediction error over 7 days)</p>
            </div>
            <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 transition-shadow hover:shadow-lg">
                <p className="text-sm font-semibold text-indigo-600 mb-2">Forecasted Demand vs. Actual Sales (Last Period)</p>
                <p className="text-3xl font-bold text-gray-900">97.8%</p>
                <p className="text-xs text-gray-500">Model's average alignment with major seasonal trends (Simulated from final plot).</p>
            </div>
        </div>
        
        <p className="text-xs text-gray-500 pt-4">
            Note: Actual performance depends on loading the trained TensorFlow model (`final_inventory_forecast_model.h5`) and the correct scalers.
        </p>
    </div>
);

export default StatsPage;