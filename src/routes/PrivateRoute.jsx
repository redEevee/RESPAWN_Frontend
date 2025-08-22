import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthGate';

const PrivateRoute = ({ children }) => {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (!user) return <Navigate to="/login" replace />;
  return children;
};

export default PrivateRoute;
