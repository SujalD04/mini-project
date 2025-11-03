import React, { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const ItemHistoryChart = ({ historyData }) => {
  // Convert the raw history data into a format recharts understands
  // We'll use 'Lag_Sales_D-1' as the "Sales" for that day
  const chartData = useMemo(() => {
    return historyData.map((day, index) => ({
      name: `Day ${index + 1}`,
      sales: day['Lag_Sales_D-1'], // Using this as our proxy for sales
    }));
  }, [historyData]);

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-shadow hover:shadow-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">45-Day Sales History</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              formatter={(value, name) => [value, "Sales"]}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="sales" 
              stroke="#4f46e5" 
              strokeWidth={2} 
              activeDot={{ r: 8 }} 
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ItemHistoryChart;