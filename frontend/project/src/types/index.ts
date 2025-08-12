export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string;
}

export interface Court {
  _id: string;
  name: string;
  courtNumber: number;
  type: string;
  capacity: number;
  isAvailable: boolean;
  pricePerHour: number;
  features: string[];
  images: string[];
  venue: string;
  createdAt: string;
}

export interface Venue {
  _id: string;
  id: string;
  name: string;
  description: string;
  address: string;
  location: {
    type: string;
    coordinates: [number, number];
  };
  photos: string[];
  pricePerHour: number;
  sports: string[];
  amenities: string[];
  owner: {
    _id: string;
    name: string;
    email: string;
  };
  courts: Court[];
  status: 'pending' | 'approved' | 'rejected';
  rating: number;
  totalBookings: number;
  createdAt: string;
  updatedAt: string;
}

export interface Booking {
  _id: string;
  user: User;
  venue: Venue;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalHours: number;
  totalPrice: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  specialRequests?: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  count?: number;
}

export interface FilterOptions {
  search?: string;
  sportType?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  page?: number;
  limit?: number;
  sortBy?: string;
}
