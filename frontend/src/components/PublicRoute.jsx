import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PublicRoute = ({ children }) => {
  const { user } = useAuth();
  // Check if the user is logged in and is not a guest
  return user && user.role !== 'guest' ? <Navigate to="/dashboard" /> : children;
};

export default PublicRoute;


