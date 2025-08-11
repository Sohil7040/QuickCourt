import React, { createContext, useContext, useState, useEffect } from 'react';
import { venuesAPI, bookingsAPI } from '../services/api';

interface Venue {
  _id: string;
  id: string;
  name: string;
  description: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  images: string[];
  pricePerHour: number;
  sportType: string;
  amenities: string[];
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  rating: number;
  totalBookings: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Booking {
  _id: string;
  id: string;
  user: string;
  venue: Venue;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
  status: string;
  specialRequests: string;
  createdAt: string;
  updatedAt: string;
}

interface DataContextType {
  venues: Venue[];
  bookings: Booking[];
  loading: boolean;
  error: string | null;
  fetchVenues: (filters?: any) => Promise<void>;
  fetchVenueById: (id: string) => Promise<Venue | null>;
  fetchBookings: () => Promise<void>;
  createBooking: (bookingData: any) => Promise<void>;
  getMyBookings: () => Promise<Booking[]>;
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

  const fetchVenues = async (filters?: any) => {
    setLoading(true);
    setError(null);
    try {
      const response = await venuesAPI.getAllVenues(filters);
      setVenues(response.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch venues');
      setVenues([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchVenueById = async (id: string) => {
    try {
      const response = await venuesAPI.getVenueById(id);
      return response.data || null;
    } catch (err) {
      console.error('Failed to fetch venue:', err);
      return null;
    }
  };

  const fetchBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      setBookings(response.data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      setBookings([]);
    }
  };

  const createBooking = async (bookingData: any) => {
    try {
      await bookingsAPI.createBooking(bookingData);
      await fetchBookings(); // Refresh bookings
    } catch (err) {
      throw err;
    }
  };

  const getMyBookings = async () => {
    try {
      const response = await bookingsAPI.getMyBookings();
      return response.data || [];
    } catch (err) {
      return [];
    }
  };

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <DataContext.Provider value={{
      venues,
      bookings,
      loading,
      error,
      fetchVenues,
      fetchVenueById,
      fetchBookings,
      createBooking,
      getMyBookings,
    }}>
      {children}
    </DataContext.Provider>
  );
};
