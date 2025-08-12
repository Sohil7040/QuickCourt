import React, { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { authAPI, venuesAPI, bookingsAPI } from '../../services/api';

interface DashboardStats {
  totalUsers: number;
  totalFacilityOwners: number;
  totalBookings: number;
  totalActiveCourts: number;
  totalRevenue: number;
}

interface ChartData {
  bookingActivity: any[];
  userRegistration: any[];
  facilityApproval: any[];
  activeSports: any[];
  earningsSimulation: any[];
}

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalFacilityOwners: 0,
    totalBookings: 0,
    totalActiveCourts: 0,
    totalRevenue: 0,
  });

  const [chartData, setChartData] = useState<ChartData>({
    bookingActivity: [],
    userRegistration: [],
    facilityApproval: [],
    activeSports: [],
    earningsSimulation: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch dashboard stats
      const [
        usersResponse,
        venuesResponse,
        bookingsResponse,
      ] = await Promise.all([
        authAPI.getCurrentUser(), // This would need to be updated to get all users for admin
        venuesAPI.getAllVenues(),
        bookingsAPI.getMyBookings(), // This would need to be updated to get all bookings for admin
      ]);

      // Mock data for demonstration - replace with actual API calls
      const mockStats: DashboardStats = {
        totalUsers: 1250,
        totalFacilityOwners: 85,
        totalBookings: 3420,
        totalActiveCourts: 156,
        totalRevenue: 48500,
      };

      // Mock chart data
      const mockChartData: ChartData = {
        bookingActivity: [
          { month: 'Jan', bookings: 120 },
          { month: 'Feb', bookings: 180 },
          { month: 'Mar', bookings: 240 },
          { month: 'Apr', bookings: 320 },
          { month: 'May', bookings: 280 },
          { month: 'Jun', bookings: 350 },
        ],
        userRegistration: [
          { month: 'Jan', users: 45 },
          { month: 'Feb', users: 62 },
          { month: 'Mar', users: 78 },
          { month: 'Apr', users: 95 },
          { month: 'May', users: 110 },
          { month: 'Jun', users: 125 },
        ],
        facilityApproval: [
          { month: 'Jan', approved: 8, pending: 12 },
          { month: 'Feb', approved: 15, pending: 10 },
          { month: 'Mar', approved: 22, pending: 8 },
          { month: 'Apr', approved: 18, pending: 15 },
          { month: 'May', approved: 25, pending: 7 },
          { month: 'Jun', approved: 30, pending: 5 },
        ],
        activeSports: [
          { sport: 'Tennis', count: 45 },
          { sport: 'Badminton', count: 38 },
          { sport: 'Basketball', count: 52 },
          { sport: 'Football', count: 41 },
          { sport: 'Volleyball', count: 35 },
          { sport: 'Swimming', count: 28 },
        ],
        earningsSimulation: [
          { month: 'Jan', earnings: 3200 },
          { month: 'Feb', earnings: 4800 },
          { month: 'Mar', earnings: 6200 },
          { month: 'Apr', earnings: 7500 },
          { month: 'May', earnings: 8900 },
          { month: 'Jun', earnings: 10200 },
        ],
      };

      setStats(mockStats);
      setChartData(mockChartData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
      
      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Users</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.totalUsers.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">+12% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Facility Owners</h3>
          <p className="text-3xl font-bold text-green-600">{stats.totalFacilityOwners}</p>
          <p className="text-sm text-gray-500 mt-1">+8% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Bookings</h3>
          <p className="text-3xl font-bold text-purple-600">{stats.totalBookings.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">+15% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Active Courts</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.totalActiveCourts}</p>
          <p className="text-sm text-gray-500 mt-1">+5% from last month</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-red-600">${stats.totalRevenue.toLocaleString()}</p>
          <p className="text-sm text-gray-500 mt-1">+20% from last month</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Booking Activity Over Time */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Activity Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData.bookingActivity}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="bookings" stroke="#3B82F6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* User Registration Trends */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">User Registration Trends</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData.userRegistration}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area type="monotone" dataKey="users" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Facility Approval Trend */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Facility Approval Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.facilityApproval}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="approved" fill="#10B981" />
              <Bar dataKey="pending" fill="#F59E0B" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Most Active Sports */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Most Active Sports</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData.activeSports}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ sport, count }) => `${sport}: ${count}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {chartData.activeSports.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Earnings Simulation Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Earnings Simulation Chart</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData.earningsSimulation}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="earnings" fill="#EF4444" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
