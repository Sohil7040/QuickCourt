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

// Helper function to handle API errors
const handleApiError = (error: any, defaultMessage: string) => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.response?.data?.error) {
    return error.response.data.error;
  }
  if (error.message) {
    return error.message;
  }
  return defaultMessage;
};

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Login failed. Please check your credentials.'));
    }
  },

  register: async (userData: any) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Registration failed. Please try again.'));
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await api.get('/auth/me');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch user data.'));
    }
  },
};

// Venues API
export const venuesAPI = {
  getAllVenues: async (filters?: any) => {
    try {
      const response = await api.get('/venues', { params: filters });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch venues.'));
    }
  },

  getVenueById: async (id: string) => {
    try {
      const response = await api.get(`/venues/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch venue details.'));
    }
  },

  createVenue: async (venueData: any) => {
    try {
      const response = await api.post('/venues', venueData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to create venue.'));
    }
  },

  updateVenue: async (id: string, venueData: any) => {
    try {
      const response = await api.put(`/venues/${id}`, venueData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to update venue.'));
    }
  },

  deleteVenue: async (id: string) => {
    try {
      const response = await api.delete(`/venues/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to delete venue.'));
    }
  },

  getMyVenues: async () => {
    try {
      const response = await api.get('/venues/owner/my-venues');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch your venues.'));
    }
  },

  checkUserBookingStatus: async (venueId: string) => {
    try {
      const response = await api.get(`/venues/${venueId}/user-booking-status`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to check booking status.'));
    }
  },

  getVenueAvailability: async (venueId: string, date: string) => {
    try {
      const response = await api.get(`/venues/${venueId}/availability`, { params: { date } });
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch venue availability.'));
    }
  },
};

// Bookings API
export const bookingsAPI = {
  createBooking: async (bookingData: any) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to create booking.'));
    }
  },

  getMyBookings: async () => {
    try {
      const response = await api.get('/bookings/my-bookings');
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch bookings.'));
    }
  },

  getBookingById: async (id: string) => {
    try {
      const response = await api.get(`/bookings/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch booking details.'));
    }
  },

  cancelBooking: async (id: string) => {
    try {
      const response = await api.put(`/bookings/${id}/cancel`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to cancel booking.'));
    }
  },

  getVenueBookings: async (venueId: string) => {
    try {
      const response = await api.get(`/bookings/venue/${venueId}`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch venue bookings.'));
    }
  },

  checkUserBookingStatus: async (userId: string, venueId: string) => {
    try {
      const response = await api.get(`/bookings/user/${userId}/venue/${venueId}/check`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to check booking status.'));
    }
  },

  getUserUpcomingBookings: async (userId: string) => {
    try {
      const response = await api.get(`/bookings/user/${userId}/upcoming`);
      return response.data;
    } catch (error) {
      throw new Error(handleApiError(error, 'Failed to fetch upcoming bookings.'));
    }
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
