import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from './StatCard'; // We can reuse the card style

// Mock data for the chart
const mockChartData = [
  { name: 'Week 1', forecast: 4000, actual: 4200 },
  { name: 'Week 2', forecast: 3800, actual: 3900 },
  { name: 'Week 3', forecast: 4100, actual: 4150 },
  { name: 'Week 4', forecast: 4500, actual: 4400 },
  { name: 'Week 5', forecast: 4200, actual: 4300 },
  { name: 'Week 6', forecast: 4600, actual: 4700 },
];

const ChartComponent = () => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 transition-shadow hover:shadow-2xl">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Forecast vs. Actual Sales (Mock Data)</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <LineChart
            data={mockChartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" stroke="#6b7280" />
            <YAxis stroke="#6b7280" />
            <Tooltip
              formatter={(value, name) => [value, name.charAt(0).toUpperCase() + name.slice(1)]}
            />
            <Legend />
            <Line type="monotone" dataKey="forecast" stroke="#4f46e5" strokeWidth={2} activeDot={{ r: 8 }} />
            <Line type="monotone" dataKey="actual" stroke="#10b981" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartComponent;