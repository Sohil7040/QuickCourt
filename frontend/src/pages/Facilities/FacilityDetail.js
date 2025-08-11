// src/pages/Facilities/FacilityDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';

const FacilityDetail = () => {
  const { id } = useParams();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Facility Detail</h1>
        <Link to="/facilities" className="text-blue-600 hover:text-blue-700 text-sm">Back to Facilities</Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        <p className="text-gray-700">Facility ID: <span className="font-mono">{id}</span></p>
        <p className="text-gray-500 mt-3">This is a placeholder for facility information, photos, reviews, and booking options.</p>
      </div>
    </div>
  );
};

export default FacilityDetail;

