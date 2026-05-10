import React from 'react';
import { Navigate } from 'react-router-dom';
import Navigation from './Navigation';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" />;
  }

  return (
    <>
      <Navigation />
      <div className="container">
        {children}
      </div>
    </>
  );
};

export default ProtectedRoute;