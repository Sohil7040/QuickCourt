import axios from 'axios';
import { Venue, Booking, User, ApiResponse, FilterOptions } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('quickcourt_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('quickcourt_token');
      localStorage.removeItem('quickcourt_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  register: async (userData: any) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },
};

// Venues API
export const venuesAPI = {
  getAllVenues: async (filters?: any) => {
    const response = await api.get('/venues', { params: filters });
    return response.data;
  },

  getVenueById: async (id: string) => {
    const response = await api.get(`/venues/${id}`);
    return response.data;
  },

  createVenue: async (venueData: any) => {
    const response = await api.post('/venues', venueData);
    return response.data;
  },

  updateVenue: async (id: string, venueData: any) => {
    const response = await api.put(`/venues/${id}`, venueData);
    return response.data;
  },

  deleteVenue: async (id: string) => {
    const response = await api.delete(`/venues/${id}`);
    return response.data;
  },

  getMyVenues: async () => {
    const response = await api.get('/venues/owner/my-venues');
    return response.data;
  },

  checkUserBookingStatus: async (venueId: string) => {
    const response = await api.get(`/venues/${venueId}/user-booking-status`);
    return response.data;
  },

  getVenueAvailability: async (venueId: string, date: string) => {
    const response = await api.get(`/venues/${venueId}/availability`, { params: { date } });
    return response.data;
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (bookingData: any) => {
    const response = await api.post('/bookings', bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get('/bookings/my-bookings');
    return response.data;
  },

  getBookingById: async (id: string) => {
    const response = await api.get(`/bookings/${id}`);
    return response.data;
  },

  cancelBooking: async (id: string) => {
    const response = await api.put(`/bookings/${id}/cancel`);
    return response.data;
  },

  getVenueBookings: async (venueId: string) => {
    const response = await api.get(`/bookings/venue/${venueId}`);
    return response.data;
  },

  checkUserBookingStatus: async (userId: string, venueId: string) => {
    const response = await api.get(`/bookings/user/${userId}/venue/${venueId}/check`);
    return response.data;
  },

  getUserUpcomingBookings: async (userId: string) => {
    const response = await api.get(`/bookings/user/${userId}/upcoming`);
    return response.data;
  },
};

// Utility functions
export const setAuthToken = (token: string) => {
  localStorage.setItem('quickcourt_token', token);
};

export const removeAuthToken = () => {
  localStorage.removeItem('quickcourt_token');
  localStorage.removeItem('quickcourt_user');
};

export const getAuthToken = () => {
  return localStorage.getItem('quickcourt_token');
};

export default api;
