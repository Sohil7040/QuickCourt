// src/pages/Facilities/Facilities.js
import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchFacilities = async () => {
  const res = await axios.get('/api/facilities');
  return res.data.data.facilities;
};

const Facilities = () => {
  const { data: facilities = [], isLoading, isError } = useQuery('facilities', fetchFacilities);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Facilities</h1>

      {isLoading && <p className="text-gray-500">Loading facilities...</p>}
      {isError && <p className="text-red-600">Failed to load facilities</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((f) => (
          <Link key={f._id} to={`/facilities/${f._id}`} className="block bg-white rounded-lg shadow p-5 hover:shadow-md transition">
            <h2 className="text-lg font-semibold text-gray-900">{f.name}</h2>
            <p className="text-sm text-gray-500 mt-2">{f.location?.city}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Facilities;

