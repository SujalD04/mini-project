import React from 'react';

/**
 * A visual progress bar for stock levels.
 * It compares the current stock to the reorder point to determine
 * a percentage and color.
 */
const StockLevelBar = ({ currentStock, reorderPoint }) => {
  // We'll define "100% full" as 2.5x the reorder point.
  // This gives a good visual range.
  const max = reorderPoint * 2.5;
  
  // Calculate the percentage, clamping it between 0 and 100
  const percentage = Math.max(0, Math.min(100, (currentStock / max) * 100));

  // Determine the color based on the stock level
  let colorClass = 'bg-green-500'; // Default: Healthy
  if (currentStock < reorderPoint) {
    colorClass = 'bg-red-500'; // Critical
  } else if (currentStock < reorderPoint * 1.5) {
    colorClass = 'bg-yellow-400'; // Warning
  }

  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1.5" title={`${currentStock} units`}>
      <div 
        className={`${colorClass} h-2.5 rounded-full transition-all duration-300`} 
        style={{ width: `${percentage}%` }}
      ></div>
    </div>
  );
};

export default StockLevelBar;