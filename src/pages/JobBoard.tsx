import React from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';

const JobBoard = () => {
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

  if (user.role !== 'artist' || !user.profile?.is_premium) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Job Board Access</h1>
            <p className="text-muted-foreground mb-6">
              The Job Board is available exclusively for Premium artists.
            </p>
            {user.role !== 'artist' ? (
              <p className="text-warning">Only artists can access the Job Board.</p>
            ) : (
              <p className="text-primary">Upgrade to Premium to access exclusive job opportunities.</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold mb-8">Job Board</h1>
        <p className="text-muted-foreground">Premium job opportunities coming soon...</p>
      </div>
    </div>
  );
};

export default JobBoard;