// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import UserProvider from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import { LocationProvider } from './context/LocationContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <UserProvider>
        <LocationProvider>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </LocationProvider>
      </UserProvider>
    </AuthProvider>
  </React.StrictMode>,
);
