import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar.jsx';
// 1. Import Toaster
import { Toaster } from 'react-hot-toast';

const Layout = () => {
  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* 2. Add Toaster component here. It's invisible until a toast is fired. */}
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
      
      {/* Sidebar (Persistent Navigation) */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
        {/* Header */}
        <header className="bg-white shadow-sm z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">AI Inventory Dashboard</h1>
            <div className="flex-shrink-0">
              <img
                className="h-8 w-8 rounded-full"
                src="https://media.istockphoto.com/id/517188688/photo/mountain-landscape.jpg?s=612x612&w=0&k=20&c=A63koPKaCyIwQWOTFBRWXj_PwCrR4cEoOw2S9Q7yVl8="
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