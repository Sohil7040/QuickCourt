// src/pages/Bookings/Bookings.js
import React from 'react';
import { Link } from 'react-router-dom';

const Bookings = () => {
  const sampleBookings = [
    { id: 'A100', facility: 'City Sports Arena', date: '2025-08-01', time: '10:00' },
    { id: 'A101', facility: 'Greenfield Courts', date: '2025-08-03', time: '14:00' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">My Bookings</h1>
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
            {sampleBookings.map((b) => (
              <tr key={b.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-mono text-sm text-gray-900">{b.id}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.facility}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.date}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{b.time}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                  <Link to={`/bookings/${b.id}`} className="text-blue-600 hover:text-blue-700">View</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;

