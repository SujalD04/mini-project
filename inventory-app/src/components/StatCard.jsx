import React from 'react';
import { formatINR } from '../utils/dataLogic.js';

const StatCard = ({ title, value, description, icon: Icon, color = 'indigo' }) => {
  const displayValue = (typeof value === 'number' && title.includes('Value')) ? formatINR(value) : value;

  const iconColorClasses = {
    indigo: 'bg-indigo-100 text-indigo-600',
    green: 'bg-green-100 text-green-600',
    red: 'bg-red-100 text-red-600',
    blue: 'bg-blue-100 text-blue-600',
  };
  
  return (
    <div className="bg-white p-5 rounded-xl shadow-lg border border-gray-100 transition-shadow hover:shadow-2xl">
      <div className="flex items-center">
        {Icon && (
          <div className={`flex-shrink-0 ${iconColorClasses[color]} rounded-full p-3 mr-4`}>
            <Icon className="h-6 w-6" />
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-gray-500 truncate">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-1">{displayValue}</p>
        </div>
      </div>
      {description && <p className="text-xs text-gray-400 mt-3 ml-1">{description}</p>}
    </div>
  );
};

export default StatCard;