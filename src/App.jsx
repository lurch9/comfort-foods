// src/App.jsx
import React from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Header from './components/Header';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RestaurantList from './pages/RestaurantList';
import PrivateRoute from './components/PrivateRoute';
import { useAuth } from './context/AuthContext';

const App = () => {
  const { user } = useAuth();

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={user ? <Navigate to="/restaurants" /> : <LandingPage />} />
        <Route path="/login" element={user ? <Navigate to="/restaurants" /> : <Login />} />
        <Route path="/register" element={user ? <Navigate to="/restaurants" /> : <Register />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/restaurants" element={<RestaurantList />} />
      </Routes>
    </>
  );
};

export default App;







