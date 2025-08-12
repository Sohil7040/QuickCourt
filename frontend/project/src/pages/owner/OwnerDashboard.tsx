import React, { useState, useMemo } from 'react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';
import { Calendar, DollarSign, TrendingUp, Clock, Users, Activity } from 'lucide-react';
import { format } from 'date-fns';

const OwnerDashboard: React.FC = () => {
  const { user } = useAuth();
  const { venues, bookings, getBookingsByOwnerId } = useData();
  
  // Get owner's venues and bookings
  const ownerVenues = useMemo(() => 
    venues.filter(venue => venue.ownerId === user?.id), 
    [venues, user?.id]
  );
  
  const ownerBookings = useMemo(() => 
    getBookingsByOwnerId(user?.id || ''), 
    [getBookingsByOwnerId, user?.id]
  );

  // Calculate metrics
  const totalBookings = ownerBookings.length;
  const activeCourts = ownerVenues.reduce((acc, venue) => acc + venue.courts.length, 0);
  const totalEarnings = ownerBookings.reduce((acc, booking) => acc + booking.totalPrice, 0);

  // Generate booking trends data
  const bookingTrends = useMemo(() => {
    const trends = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = format(date, 'MMM dd');
      
      const dayBookings = ownerBookings.filter(booking => 
        format(new Date(booking.date), 'MMM dd') === dateStr
      );
      
      trends.push({
        date: dateStr,
        bookings: dayBookings.length,
        earnings: dayBookings.reduce((sum, b) => sum + b.totalPrice, 0)
      });
    }
    
    return trends;
  }, [ownerBookings]);

  // Generate earnings summary
  const earningsSummary = useMemo(() => {
    const venueEarnings = ownerVenues.map(venue => {
      const venueBookings = ownerBookings.filter(b => b.venueId === venue.id);
      return {
        name: venue.name,
        earnings: venueBookings.reduce((sum, b) => sum + b.totalPrice, 0),
        bookings: venueBookings.length
      };
    });
    
    return venueEarnings.filter(v => v.earnings > 0);
  }, [ownerVenues, ownerBookings]);

  // Generate peak booking hours
  const peakHours = useMemo(() => {
    const hours = Array.from({ length: 24 }, (_, i) => i);
    const hourData = hours.map(hour => ({
      hour: `${hour.toString().padStart(2, '0')}:00`,
      bookings: ownerBookings.filter(booking => {
        const startHour = parseInt(booking.startTime.split(':')[0]);
        return startHour === hour;
      }).length
    }));
    
    return hourData;
  }, [ownerBookings]);

  // Generate upcoming bookings
  const upcomingBookings = useMemo(() => 
    ownerBookings
      .filter(booking => new Date(booking.date) >= new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 5),
    [ownerBookings]
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Owner Dashboard</h1>
        <p className="text-gray-600">Manage your sports facilities and track performance</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Bookings</p>
              <p className="text-3xl font-bold text-gray-900">{totalBookings}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Courts</p>
              <p className="text-3xl font-bold text-gray-900">{activeCourts}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-full">
              <Activity className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Earnings</p>
              <p className="text-3xl font-bold text-gray-900">${totalEarnings.toLocaleString()}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <DollarSign className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Venues</p>
              <p className="text-3xl font-bold text-gray-900">{ownerVenues.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Booking Trends */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrends}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings by Venue */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Earnings by Venue</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={earningsSummary}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip />
              <Bar dataKey="earnings" fill="#10B981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Peak Hours and Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Peak Booking Hours */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Peak Booking Hours</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={peakHours}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="bookings" stroke="#F59E0B" fill="#FEF3C7" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Calendar */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h3>
          <div className="space-y-4">
            {upcomingBookings.map((booking) => {
              const venue = ownerVenues.find(v => v.id === booking.venueId);
              const court = venue?.courts.find(c => c.id === booking.courtId);
              
              return (
                <div key={booking.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">{venue?.name}</p>
                      <p className="text-sm text-gray-600">{court?.name}</p>
                      <p className="text-sm text-gray-500">
                        {format(new Date(booking.date), 'MMM dd, yyyy')} • {booking.startTime} - {booking.endTime}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-green-600">${booking.totalPrice}</p>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
            {upcomingBookings.length === 0 && (
              <p className="text-gray-500 text-center py-8">No upcoming bookings</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
