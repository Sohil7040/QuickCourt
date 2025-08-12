import React, { createContext, useContext, useState, useEffect } from 'react';
import { venuesAPI, bookingsAPI } from '../services/api';
import { Venue, Booking } from '../types';

interface DataContextType {
  venues: Venue[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchVenues: (filters?: any) => Promise<void>;
  fetchBookings: () => Promise<void>;
  addVenue: (venue: Omit<Venue, 'id'>) => void;
  updateVenue: (id: string, updates: Partial<Venue>) => void;
  addBooking: (booking: Omit<Booking, 'id' | 'createdAt'>) => void;
  updateBooking: (id: string, updates: Partial<Booking>) => void;
  getVenueById: (id: string) => Venue | undefined;
  getBookingsByUserId: (userId: string) => Booking[];
  getBookingsByOwnerId: (ownerId: string) => Booking[];
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [venues, setVenues] = useState<Venue[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch venues from the server
  const fetchVenues = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await venuesAPI.getAllVenues(filters);
      setVenues(response.data || []);
      console.log('Venues fetched:', response.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch venues');
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch bookings from the server
  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    }
  };

  // Load venues on component mount
  useEffect(() => {
    fetchVenues();
  }, []);

  const addVenue = (venue: Omit<Venue, 'id'>) => {
    const newVenue = { ...venue, id: Date.now().toString() };
    setVenues(prev => [...prev, newVenue]);
  };

  const updateVenue = (id: string, updates: Partial<Venue>) => {
    setVenues(prev => prev.map(venue => 
      venue.id === id ? { ...venue, ...updates } : venue
    ));
  };

  const addBooking = (booking: Omit<Booking, 'id' | 'createdAt'>) => {
    const newBooking = {
      ...booking,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [...prev, newBooking]);
  };

  const updateBooking = (id: string, updates: Partial<Booking>) => {
    setBookings(prev => prev.map(booking => 
      booking.id === id ? { ...booking, ...updates } : booking
    ));
  };

  const getVenueById = (id: string) => venues.find(venue => venue.id === id);

  const getBookingsByUserId = (userId: string) => 
    bookings.filter(booking => booking.user?._id === userId);

  const getBookingsByOwnerId = (ownerId: string) => 
    bookings.filter(booking => {
      const venue = venues.find(v => v.id === booking.venue?._id);
      return venue?.ownerId === ownerId;
    });

  return (
    <DataContext.Provider value={{
      venues,
      bookings,
      loading,
      error,
      fetchVenues,
      fetchBookings,
      addVenue,
      updateVenue,
      addBooking,
      updateBooking,
      getVenueById,
      getBookingsByUserId,
      getBookingsByOwnerId,
    }}>
      {children}
    </DataContext.Provider>
  );
};
