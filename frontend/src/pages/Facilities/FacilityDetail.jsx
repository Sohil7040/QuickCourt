// src/pages/Facilities/FacilityDetail.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchFacility = async (id) => {
  const res = await axios.get(`/api/facilities/${id}`);
  return res.data.data;
};

const FacilityDetail = () => {
  const { id } = useParams();
  const { data, isLoading, isError } = useQuery(['facility', id], () => fetchFacility(id), { enabled: !!id });

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Facility Detail</h1>
        <Link to="/facilities" className="text-blue-600 hover:text-blue-700 text-sm">Back to Facilities</Link>
      </div>
      <div className="bg-white shadow rounded-lg p-6">
        {isLoading && <p className="text-gray-500">Loading...</p>}
        {isError && <p className="text-red-600">Failed to load facility</p>}
        {data && (
          <div className="space-y-3">
            <p className="text-gray-700">
              Name: <span className="font-semibold">{data.facility?.name}</span>
            </p>
            <p className="text-gray-700">City: {data.facility?.location?.city}</p>
            <p className="text-gray-700">Sports: {(data.facility?.sports || []).join(', ')}</p>
            <p className="text-gray-700">Amenities: {(data.facility?.amenities || []).join(', ') || '—'}</p>
            <div>
              <p className="text-gray-900 font-semibold">Recent Reviews</p>
              <ul className="list-disc ml-6 text-gray-700 text-sm">
                {(data.reviews || []).map((r) => (
                  <li key={r._id}>{r.user?.name || 'User'}: {r.comment || ''}</li>
                ))}
                {(!data.reviews || data.reviews.length === 0) && <li>No reviews yet</li>}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FacilityDetail;

