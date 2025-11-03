import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  ChartBarIcon, 
  ArchiveBoxIcon, 
  ShoppingCartIcon,
  BoltIcon 
} from '@heroicons/react/24/outline';

// Helper component for navigation links
const SidebarLink = ({ to, icon: Icon, label }) => {
  const baseClasses = "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors";
  const inactiveClasses = "text-gray-600 hover:bg-indigo-50 hover:text-indigo-600";
  const activeClasses = "bg-indigo-100 text-indigo-700";

  return (
    <NavLink
      to={to}
      end // Use 'end' for the index route to prevent it from always being active
      className={({ isActive }) => `${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
    >
      <Icon className="h-6 w-6 mr-3" />
      {label}
    </NavLink>
  );
};

const Sidebar = () => {
  return (
    <nav className="w-64 bg-white shadow-xl flex-shrink-0 flex flex-col">
      {/* Logo/Header */}
      <div className="h-16 flex items-center justify-center px-4 border-b border-gray-200">
        <BoltIcon className="h-8 w-8 text-indigo-600" />
        <span className="ml-2 text-xl font-bold text-gray-900">AI Forecast</span>
      </div>
      
      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        <SidebarLink to="/" label="Dashboard" icon={ChartBarIcon} />
        <SidebarLink to="/inventory" label="Inventory" icon={ArchiveBoxIcon} />
        <SidebarLink to="/cart" label="Restock Cart" icon={ShoppingCartIcon} />
      </div>
    </nav>
  );
};

export default Sidebar;