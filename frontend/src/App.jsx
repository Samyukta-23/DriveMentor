import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import DriverDashboard from './pages/DriverDashboard';
import MentorDashboard from './pages/MentorDashboard';
import AdminPanel from './pages/AdminPanel';
import Marketplace from './pages/Marketplace';
import ProgressTracker from './pages/ProgressTracker';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading, isAuthenticated } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cyan-500" />
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;
  return children;
};

const AppLayout = () => (
  <div className="min-h-screen flex flex-col bg-[#0F172A]">
    <Navbar />
    <main className="flex-1">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Driver Routes */}
        <Route path="/driver-dashboard" element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <DriverDashboard />
          </ProtectedRoute>
        } />
        <Route path="/marketplace" element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <Marketplace />
          </ProtectedRoute>
        } />
        <Route path="/progress" element={
          <ProtectedRoute allowedRoles={['DRIVER']}>
            <ProgressTracker />
          </ProtectedRoute>
        } />

        {/* Mentor Routes */}
        <Route path="/mentor-dashboard" element={
          <ProtectedRoute allowedRoles={['MENTOR']}>
            <MentorDashboard />
          </ProtectedRoute>
        } />

        {/* Admin Routes */}
        <Route path="/admin-panel" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminPanel />
          </ProtectedRoute>
        } />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </main>
    <Footer />
  </div>
);

const App = () => (
  <BrowserRouter>
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  </BrowserRouter>
);

export default App;
