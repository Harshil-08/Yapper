import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-teal-100 px-4">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-teal-600">404</h1>
        <h2 className="mt-2 text-2xl font-semibold text-teal-800">
          Page Not Found
        </h2>
        <p className="mt-4 text-teal-700">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <button
          onClick={() => navigate('/home')}
          className="mt-6 px-4 py-2 bg-teal-600 text-white font-semibold rounded-md shadow hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-400"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default NotFound;
