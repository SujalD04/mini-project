import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar (Persistent Navigation) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Simple Header (Optional) */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">AI Inventory Dashboard</h1>
            <div className="flex-shrink-0">
              {/* You can add a user avatar or settings icon here */}
              <img
                className="h-8 w-8 rounded-full"
                src="https://via.placeholder.com/150/indigo/white?text=A"
                alt="User Avatar"
              />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-4 sm:p-6 lg:p-8">
          <Outlet /> {/* This is where your routed pages will render */}
        </main>
      </div>
    </div>
  );
};

export default Layout;