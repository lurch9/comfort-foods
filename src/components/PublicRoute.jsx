// src/components/PublicRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();

  return user ? <Navigate to="/restaurants" /> : children;
};

export default PublicRoute;
