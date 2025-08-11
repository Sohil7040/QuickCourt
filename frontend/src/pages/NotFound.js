// src/pages/NotFound.js
import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-extrabold text-gray-900">404</h1>
      <p className="mt-4 text-gray-600 text-lg">The page you’re looking for doesn’t exist.</p>
      <Link to="/" className="mt-6 inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
        Go home
      </Link>
    </div>
  );
};

export default NotFound;

