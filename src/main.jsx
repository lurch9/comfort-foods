// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import UserProvider from './context/UserContext';
import AuthProvider from './context/AuthContext';

import { CartProvider } from './context/CartContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
          <CartProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
          </CartProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
);
