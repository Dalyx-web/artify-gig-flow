import React from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const Dashboard = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.profile?.full_name || user.email}!
          </h1>
          <p className="text-muted-foreground">
            Role: {user.role} {user.profile?.is_premium ? '(Premium)' : ''}
          </p>
        </div>

        {user.role === 'artist' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-card">
              <h3 className="text-lg font-semibold mb-2">Profile Status</h3>
              <p className="text-muted-foreground">Complete your artist profile</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card">
              <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
              <p className="text-2xl font-bold text-primary">0</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card">
              <h3 className="text-lg font-semibold mb-2">Total Earnings</h3>
              <p className="text-2xl font-bold text-success">$0</p>
            </div>
          </div>
        )}

        {user.role === 'client' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-card p-6 rounded-lg shadow-card">
              <h3 className="text-lg font-semibold mb-2">Recent Bookings</h3>
              <p className="text-muted-foreground">No bookings yet</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card">
              <h3 className="text-lg font-semibold mb-2">Saved Artists</h3>
              <p className="text-2xl font-bold text-primary">0</p>
            </div>
            <div className="bg-card p-6 rounded-lg shadow-card">
              <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
              <p className="text-2xl font-bold text-secondary">$0</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;