// src/pages/Bookings/BookingDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const BookingDetail = () => {
  const { id } = useParams();

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Booking Detail</h1>
        <Link to="/bookings" className="text-blue-600 hover:text-blue-700 text-sm">Back to Bookings</Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        <p className="text-gray-700">Booking ID: <span className="font-mono">{id}</span></p>
        <p className="text-gray-500">This is a placeholder for booking information, status, and actions.</p>
      </div>
    </div>
  );
};

export default BookingDetail;

