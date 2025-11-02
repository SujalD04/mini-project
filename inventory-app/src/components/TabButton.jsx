import React from 'react';

const TabButton = ({ tabName, activeTab, setActiveTab }) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 font-medium text-sm transition-colors duration-200 border-b-2 
            ${activeTab === tabName 
                ? 'border-indigo-600 text-indigo-700 bg-indigo-50' 
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}
            rounded-t-lg`}
    >
        {tabName.charAt(0).toUpperCase() + tabName.slice(1)}
    </button>
);

export default TabButton;

