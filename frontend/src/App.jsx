// src/App.jsx
import React from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import RestaurantList from './pages/RestaurantList';
import RestaurantMenu from './pages/RestaurantMenu';
import Dashboard from './pages/Dashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ManagerMenus from './pages/ManagerMenus';
import EditMenu from './components/EditMenu';
import AddMenu from './components/AddMenu';
import EditRestaurant from './components/EditRestaurant';
import OrderHistory from './pages/OrderHistory';
import PrivateRoute from './components/PrivateRoute';
import PublicRoute from './components/PublicRoute';
import Unauthorized from './pages/Unauthorized';
import Return from './pages/Return'; 
import { SocketProvider } from './context/SocketContext';
import './App.css';

function App() {
  return (
    <SocketProvider>
    <Header />
    <Routes>
      <Route path="/" element={<RestaurantList />} />
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
      <Route path="/profile" element={<PrivateRoute allowedRoles={['manager', 'user']}><Profile /></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute allowedRoles={['manager', 'user']}><Dashboard /></PrivateRoute>} />
      <Route path="/manager-dashboard" element={<PrivateRoute allowedRoles={['manager']}><ManagerDashboard /></PrivateRoute>} />
      <Route path="/edit-restaurant/:id" element={<PrivateRoute allowedRoles={['manager']}><EditRestaurant /></PrivateRoute>} />
      <Route path="/manager-menus" element={<PrivateRoute allowedRoles={['manager']}><ManagerMenus /></PrivateRoute>} />
      <Route path="/manager-menus/:restaurantId" element={<PrivateRoute allowedRoles={['manager']}><ManagerMenus /></PrivateRoute>} />
      <Route path="/edit-menu/:id" element={<PrivateRoute allowedRoles={['manager']}><EditMenu /></PrivateRoute>} />
      <Route path="/add-menu" element={<PrivateRoute allowedRoles={['manager']}><AddMenu /></PrivateRoute>} />
      <Route path="/restaurants/:restaurantId/menu" element={<RestaurantMenu />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/return" element={<Return />} />
      <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
      <Route path="/order-history" element={<PrivateRoute allowedRoles={['manager', 'user']}><OrderHistory /></PrivateRoute>} />
      <Route path="/unauthorized" element={<PublicRoute><Unauthorized /></PublicRoute>} />
    </Routes>
    <Footer />
  </SocketProvider>
  );
}

export default App;