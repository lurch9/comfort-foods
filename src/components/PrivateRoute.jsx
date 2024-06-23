// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();
  console.log("PrivateRoute - User:", user);
  console.log("PrivateRoute - AllowedRoles:", allowedRoles);

  // Check if the user role is allowed
  if (user && allowedRoles.includes(user.role)) {
    return children;
  }

  // Redirect to login if not authenticated
  return <Navigate to="/unauthorized" />;
};

export default PrivateRoute;

