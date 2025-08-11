import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Navbar from './components/Layout/Navbar';
import Footer from './components/Layout/Footer';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import VenuesPage from './pages/VenuesPage';
import VenueDetailsPage from './pages/VenueDetailsPage';
import BookingPage from './pages/BookingPage';
import UserDashboard from './pages/user/UserDashboard';
import UserProfile from './pages/user/UserProfile';
import OwnerDashboard from './pages/owner/OwnerDashboard';
import OwnerProfile from './pages/owner/OwnerProfile';
import FacilityManagement from './pages/owner/FacilityManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProfile from './pages/admin/AdminProfile';
import UserManagement from './pages/admin/UserManagement';
import FacilityApproval from './pages/admin/FacilityApproval';

function ProtectedRoute({ children, requiredRole }: { children: React.ReactNode; requiredRole?: string }) {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

function AppContent() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path="/signup" element={!isAuthenticated ? <SignupPage /> : <Navigate to="/" />} />
          <Route path="/venues" element={<VenuesPage />} />
          <Route path="/venues/:id" element={<VenueDetailsPage />} />
          <Route path="/booking/:venueId" element={
            <ProtectedRoute requiredRole="user">
              <BookingPage />
            </ProtectedRoute>
          } />
          
          {/* User Routes */}
          <Route path="/user/dashboard" element={
            <ProtectedRoute requiredRole="user">
              <UserDashboard />
            </ProtectedRoute>
          } />
          <Route path="/user/profile" element={
            <ProtectedRoute requiredRole="user">
              <UserProfile />
            </ProtectedRoute>
          } />

          {/* Owner Routes */}
          <Route path="/owner/dashboard" element={
            <ProtectedRoute requiredRole="owner">
              <OwnerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/owner/profile" element={
            <ProtectedRoute requiredRole="owner">
              <OwnerProfile />
            </ProtectedRoute>
          } />
          <Route path="/owner/facilities" element={
            <ProtectedRoute requiredRole="owner">
              <FacilityManagement />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute requiredRole="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/profile" element={
            <ProtectedRoute requiredRole="admin">
              <AdminProfile />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute requiredRole="admin">
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/facilities" element={
            <ProtectedRoute requiredRole="admin">
              <FacilityApproval />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;