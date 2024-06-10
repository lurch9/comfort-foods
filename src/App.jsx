// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Register from './components/Register';
import Header from './components/Header';
import PrivateRoute from './components/PrivateRoute';
import ProtectedComponent from './components/ProtectedComponent';

const App = () => {
  return (
    <div>
      <Header />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/protected"
          element={
            <PrivateRoute>
              <ProtectedComponent />
            </PrivateRoute>
          }
        />
      </Routes>
    </div>
  );
};

export default App;






