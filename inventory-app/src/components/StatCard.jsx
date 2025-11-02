import React from 'react';
import { formatINR } from '../utils/dataLogic'; // Assumed existence of formatINR in utils

const StatCard = ({ title, value, description, isCurrency = false }) => {
    // Check if the utility exists before using it
    const displayValue = isCurrency && typeof formatINR === 'function' ? formatINR(value) : value;

    return (
        <div className="bg-white p-4 rounded-xl shadow-md border border-gray-100 transition-shadow hover:shadow-lg">
            <p className="text-sm font-medium text-gray-500">{title}</p>
            <p className="text-3xl font-bold text-indigo-600 mt-1">{displayValue}</p>
            <p className="text-xs text-gray-400 mt-2">{description}</p>
        </div>
    );
};

export default StatCard;
