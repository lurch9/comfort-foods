// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import RestaurantList from './pages/RestaurantList';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './components/PrivateRoute';
import './App.css'

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/restaurants" element={<RestaurantList />} />
      </Routes>
    </div>
  );
};

export default App;






