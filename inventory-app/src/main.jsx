import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css'; // Your main tailwind styles
import { InventoryProvider } from './utils/InventoryContext.jsx';
import { BrowserRouter } from 'react-router-dom';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <InventoryProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </InventoryProvider>
  </React.StrictMode>
);