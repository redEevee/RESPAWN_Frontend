import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthGate';

const PublicRoute = ({ children }) => {
  const { user, ready } = useAuth();
  if (!ready) return null;
  if (user) return <Navigate to="/" replace />;
  return children;
};
export default PublicRoute;
