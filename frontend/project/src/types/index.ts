export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'owner' | 'admin';
  avatar?: string;
}

export interface Venue {
  _id: string;
  name: string;
  description: string;
  sportType: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  pricePerHour: number;
  capacity: number;
  images: string[];
  amenities: string[];
  availability: {
    [key: string]: {
      startTime: string;
      endTime: string;
      isAvailable: boolean;
    };
  };
  owner: User;
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
