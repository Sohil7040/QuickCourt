// src/pages/Dashboard/Dashboard.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 text-sm">Welcome</p>
          <p className="text-gray-900 font-semibold">{user?.name || 'User'}</p>
          <p className="text-gray-500 text-sm mt-1">Role: {user?.role || 'user'}</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 text-sm">Facilities Managed</p>
          <p className="text-3xl font-bold text-gray-900">—</p>
        </div>
        <div className="bg-white shadow rounded-lg p-6">
          <p className="text-gray-500 text-sm">Upcoming Bookings</p>
          <p className="text-3xl font-bold text-gray-900">—</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

