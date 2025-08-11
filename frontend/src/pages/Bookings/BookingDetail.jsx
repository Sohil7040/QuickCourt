// src/pages/Bookings/BookingDetail.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useQuery } from 'react-query';

const fetchBooking = async (id) => {
  const res = await axios.get(`/api/bookings/${id}`);
  return res.data.data.booking;
};

function BookingDetail() {
  const { id } = useParams();
  const { data: booking, isLoading, isError } = useQuery(['booking', id], () => fetchBooking(id), { enabled: !!id });

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Booking Detail</h1>
        <Link to="/bookings" className="text-blue-600 hover:text-blue-700 text-sm">Back to Bookings</Link>
      </div>

      <div className="bg-white shadow rounded-lg p-6 space-y-3">
        {isLoading && <p className="text-gray-500">Loading...</p>}
        {isError && <p className="text-red-600">Failed to load booking</p>}
        {booking && (
          <>
            <p className="text-gray-700">ID: <span className="font-mono">{booking._id}</span></p>
            <p className="text-gray-700">Facility: {booking.facility?.name}</p>
            <p className="text-gray-700">Date: {new Date(booking.bookingDate).toISOString().slice(0,10)}</p>
            <p className="text-gray-700">Time: {booking.timeSlot?.startTime} - {booking.timeSlot?.endTime}</p>
            <p className="text-gray-700">Status: {booking.status}</p>
            <p className="text-gray-700">Total: {booking.pricing?.totalAmount} {booking.pricing?.currency}</p>
          </>
        )}
      </div>
    </div>
  );
}

export default BookingDetail;
