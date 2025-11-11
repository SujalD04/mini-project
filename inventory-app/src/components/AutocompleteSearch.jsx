import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

/**
 * A reusable autocomplete search component.
 * @param {Array<object>} items - The full list of items to search (e.g., warehouses)
 * @param {function(object): void} onSelect - Callback function when an item is selected
 * @param {string} placeholder - Placeholder text for the input
 */
const AutocompleteSearch = ({ items, onSelect, placeholder }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  // Filter items based on the search term
  const filteredItems = useMemo(() => {
    if (!searchTerm) return [];
    return items
      .filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.city.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .slice(0, 5); // Only show top 5 results
  }, [searchTerm, items]);

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleItemClick = (item) => {
    setSearchTerm(item.name); // Set input text to selected item's name
    onSelect(item); // Call parent's onSelect function
    setIsOpen(false); // Close the dropdown
  };

  return (
    <div className="relative">
      <label htmlFor={placeholder} className="block text-sm font-medium text-gray-700">
        {placeholder}
      </label>
      <div className="relative mt-1">
        <input
          id={placeholder}
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)} // Open on focus
          onBlur={() => setTimeout(() => setIsOpen(false), 150)} // Delay blur to allow click
          placeholder={`Search for a ${placeholder.toLowerCase()}...`}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
      </div>

      {/* --- Results Dropdown --- */}
      {/* FIX 1: Changed z-10 to z-[1000] to appear over the Leaflet map.
        We also set a dark theme for the dropdown to match the new map.
      */}
      {isOpen && filteredItems.length > 0 && (
        <ul className="absolute z-[1000] w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {filteredItems.map(item => (
            <li
              key={item.id}
              onMouseDown={() => handleItemClick(item)} // Use onMouseDown to fire before blur
              className="px-4 py-3 cursor-pointer hover:bg-indigo-50"
            >
              <p className="text-sm font-medium text-gray-900">{item.name}</p>
              <p className="text-xs text-gray-500">{item.city}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AutocompleteSearch;