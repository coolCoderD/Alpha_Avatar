import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const user = localStorage.getItem('user'); // Replace 'user' with your localStorage key
  return user ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;
