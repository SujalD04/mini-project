import React from 'react';
import { useInventory } from '../utils/InventoryContext.jsx';
import { formatINR } from '../utils/dataLogic.js';
import { useNavigate } from 'react-router-dom';

// New Summary Component
const CartSummary = ({ cart }) => {
  const totalItems = cart.reduce((sum, item) => sum + item.orderQuantity, 0);
  const totalCost = cart.reduce((sum, item) => sum + (item.orderQuantity * item.price), 0);
  const uniqueItems = cart.length;

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 space-y-4">
      <h3 className="text-xl font-bold text-gray-900 border-b pb-2">Order Summary</h3>
      <div className="flex justify-between">
        <span className="text-gray-600">Unique Items:</span>
        <span className="font-semibold text-gray-900">{uniqueItems}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Total Units:</span>
        <span className="font-semibold text-gray-900">{totalItems.toLocaleString('en-IN')}</span>
      </div>
      <div className="flex justify-between items-center mt-4 pt-4 border-t">
        <span className="text-lg font-bold text-gray-900">Total Cost:</span>
        <span className="text-2xl font-extrabold text-indigo-600">{formatINR(totalCost)}</span>
      </div>
    </div>
  );
};


const CartPage = () => {
  // Get state and the generate function from the context
  const { restockCart, generateRestockOrder, isGenerating, apiError } = useInventory();
  const navigate = useNavigate();

  const handleGenerateOrder = () => {
    // Pass a "callback" function to navigate to the cart *after* the API call
    generateRestockOrder(() => {
      // This part runs on success
      console.log("Order generated, staying on cart page.");
    });
  };

  return (
    <div className="space-y-6">
      {/* Generate Button */}
      <button
        onClick={handleGenerateOrder}
        disabled={isGenerating}
        className={`w-full flex items-center justify-center space-x-3 px-6 py-4 text-xl font-bold rounded-xl transition-all duration-300 shadow-lg 
          ${isGenerating 
            ? 'bg-indigo-300 cursor-not-allowed' 
            : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5'}`
        }
      >
        {isGenerating ? (
          <>
            <svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span>Generating AI Order...</span>
          </>
        ) : (
          <>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <span>Generate AI Restock Order</span>
          </>
        )}
      </button>

      {/* API Error Display */}
      {apiError && (
        <div className="p-4 my-2 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <strong>Error:</strong> {apiError}
        </div>
      )}

      {/* Cart Content */}
      {restockCart.length === 0 && !isGenerating ? (
        <div className="text-center text-gray-500 py-16 bg-white rounded-xl shadow-lg border border-gray-100">
          <p className="text-lg">Your restock cart is empty.</p>
          <p>Press the button above to run the AI forecast and populate the cart.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Cart Table (Main) */}
          <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow-lg border border-gray-100 overflow-x-auto">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Order Details ({restockCart.length} Items)</h3>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Pred. Demand</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Order Qty</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Est. Cost</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {restockCart.map(item => (
                  <tr key={item.itemId} className={item.isCritical ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-gray-50'}>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500">{item.category}</p>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${item.badgeColor}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-600">{item.currentStock}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-600">{item.predictedDemand.toFixed(1)}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right font-bold text-lg text-indigo-600">{item.orderQuantity}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-gray-600">{formatINR(item.orderQuantity * item.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cart Summary (Side) */}
          <div className="lg:col-span-1">
            <CartSummary cart={restockCart} />
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;