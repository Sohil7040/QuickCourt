// src/pages/Bookings/Bookings.js
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchMyBookings = async () => {
  const res = await axios.get('/api/bookings/my?upcoming=true');
  return res.data.data.bookings;
};

const Bookings = () => {
  const { data: bookings = [], isLoading, isError } = useQuery('myBookings', fetchMyBookings);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {isLoading && <p className="p-6 text-gray-500">Loading bookings...</p>}
        {isError && <p className="p-6 text-red-600">Failed to load bookings</p>}
        {!isLoading && !isError && (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {bookings.map((b) => (
                <tr key={b._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">{b._id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.facility?.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(b.bookingDate).toISOString().slice(0,10)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.timeSlot?.startTime}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <Link to={`/bookings/${b._id}`} className="text-blue-600 hover:text-blue-700">View</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Bookings;

