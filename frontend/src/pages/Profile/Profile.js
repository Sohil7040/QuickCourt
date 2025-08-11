// src/pages/Profile/Profile.js
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';

const Profile = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile</h1>
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <div>
          <p className="text-gray-500 text-sm">Name</p>
          <p className="text-gray-900 font-medium">{user?.name || '—'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Email</p>
          <p className="text-gray-900 font-medium">{user?.email || '—'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Phone</p>
          <p className="text-gray-900 font-medium">{user?.phone || '—'}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Role</p>
          <p className="text-gray-900 font-medium">{user?.role || 'user'}</p>
        </div>
      </div>
    </div>
  );
};

export default Profile;

