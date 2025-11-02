import React from 'react';
// FIX: Appending the .js extension for explicit module resolution
import { SAFETY_STOCK, MIN_ORDER_QTY, formatINR } from '../utils/dataLogic.js';

const CartPage = ({ restockCart, generateRestockOrder, isGenerating }) => (
    <div className="p-4 space-y-6">
        <button
            onClick={generateRestockOrder}
            disabled={isGenerating}
            className={`w-full flex items-center justify-center space-x-2 px-6 py-3 text-lg font-bold rounded-xl transition-all duration-300 shadow-lg 
                ${isGenerating 
                    ? 'bg-indigo-300 cursor-not-allowed' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl'}`
            }
        >
            {isGenerating ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Generating Order...</span>
                </>
            ) : (
                <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    <span>Generate AI Restock Order</span>
                </>
            )}
        </button>

        <div className="text-sm text-gray-600 space-y-1 p-3 bg-indigo-50 rounded-lg">
            <p><strong>Policy Summary:</strong></p>
            <p>- Order is generated when required quantity is greater than {MIN_ORDER_QTY} units.</p>
            <p>- Target Stock = Predicted Demand (7-Day) + {SAFETY_STOCK} (Safety Stock).</p>
            <p>- Quantity is rounded up to the nearest case size of {MIN_ORDER_QTY} units.</p>
        </div>

        {restockCart.length === 0 && !isGenerating ? (
            <p className="text-center text-gray-500 py-10">Press 'Generate AI Restock Order' to run the forecast and populate the cart.</p>
        ) : (
            <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-700">Order Summary ({restockCart.length} Items)</h3>
                <div className="bg-white p-4 rounded-xl shadow-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                                <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Predicted Demand (7-Day)</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">ORDER QTY</th>
                                <th className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Cost</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {restockCart.map(item => (
                                <tr key={item.itemId} className={item.isCritical ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                        <p className="text-xs text-gray-500">{item.category}</p>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${item.badgeColor}`}>
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-gray-500">{item.currentStock}</td>
                                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-gray-500">{item.predictedDemand.toFixed(1)}</td>
                                    <td className="px-3 py-3 whitespace-nowrap text-right font-bold text-lg text-indigo-600">{item.orderQuantity}</td>
                                    {/* Use the helper function here */}
                                    <td className="px-3 py-3 whitespace-nowrap text-right text-sm text-gray-500">{formatINR(item.orderQuantity * item.price)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}
    </div>
);

export default CartPage;
