// src/pages/Facilities/Facilities.js
import React from 'react';
import { Link } from 'react-router-dom';

const Facilities = () => {
  const sampleFacilities = [
    { id: '1', name: 'City Sports Arena' },
    { id: '2', name: 'Greenfield Courts' },
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Facilities</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {sampleFacilities.map((f) => (
          <Link key={f.id} to={`/facilities/${f.id}`} className="block bg-white rounded-lg shadow p-5 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900">{f.name}</h2>
            <p className="text-sm text-gray-500 mt-2">View details</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Facilities;

