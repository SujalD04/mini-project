import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import InventoryPage from './pages/InventoryPage.jsx';
import CartPage from './pages/CartPage.jsx';
import LogisticsPage from './pages/LogisticsPage.jsx';
// --- 1. Import the new page ---
import ItemDetailPage from './pages/ItemDetailPage.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<DashboardPage />} />
        <Route path="inventory" element={<InventoryPage />} />
        
        {/* --- 2. Add the new dynamic route --- */}
        <Route path="inventory/:itemId" element={<ItemDetailPage />} />

        <Route path="logistics" element={<LogisticsPage />} />
        
        <Route path="cart" element={<CartPage />} />
      </Route>
    </Routes>
  );
}

export default App;