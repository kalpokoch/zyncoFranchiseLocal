import React from 'react';
import { Navigate } from 'react-router-dom';

// This file now redirects to the Login page
const Index = () => {
  return <Navigate to="/" replace />;
};

export default Index;
