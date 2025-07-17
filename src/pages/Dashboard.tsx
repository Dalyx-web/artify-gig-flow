import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Music, Calendar, DollarSign, Users, MessageCircle, Star, Settings, TrendingUp, Award } from 'lucide-react';

// Welcome screen component with role-specific animations
const WelcomeScreen = ({ role, userName }: { role: string; userName: string }) => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000);
    return () => clearTimeout(timer);
  }, []);

  const welcomeMessages = {
    artist: "🎶 Share your talent. The stage is yours!",
    client: "Let's find the perfect vibe for your event!",
    admin: "You're in control. Time to fine-tune the platform."
  };

  const message = welcomeMessages[role as keyof typeof welcomeMessages] || "🎧 Discover fresh talent near you!";

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
      <div className="text-center animate-scale-in">
        <div className="mb-8 animate-bounce">
          <div className="w-24 h-24 mx-auto bg-gradient-hero rounded-full flex items-center justify-center shadow-glow">
            <Music className="w-12 h-12 text-white" />
          </div>
        </div>
        <h1 className="text-4xl md:text-6xl font-display font-bold mb-4 animate-fade-in gradient-hero bg-clip-text text-transparent">
          Welcome, {userName}!
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground animate-slide-up delay-200">
          {message}
        </p>
      </div>
    </div>
  );
};

// Role-specific dashboard components
const ArtistDashboard = ({ user }: { user: any }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <Calendar className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">3</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Upcoming Gigs</h3>
        <p className="text-muted-foreground">Next: Tonight at 8 PM</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in delay-100">
        <div className="flex items-center justify-between mb-4">
          <MessageCircle className="w-8 h-8 text-secondary" />
          <span className="text-2xl font-bold text-secondary">5</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">New Requests</h3>
        <p className="text-muted-foreground">2 high priority</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in delay-200">
        <div className="flex items-center justify-between mb-4">
          <DollarSign className="w-8 h-8 text-success" />
          <span className="text-2xl font-bold text-success">$2,450</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">This Month</h3>
        <p className="text-muted-foreground">+15% from last month</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in delay-300">
        <div className="flex items-center justify-between mb-4">
          <Star className="w-8 h-8 text-warning" />
          <span className="text-2xl font-bold">4.9</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Rating</h3>
        <p className="text-muted-foreground">From 127 reviews</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-card p-6 rounded-lg shadow-card animate-slide-up">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-primary" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Wedding Reception</p>
              <p className="text-sm text-muted-foreground">Tomorrow, 6:00 PM</p>
            </div>
            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm">Confirmed</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Corporate Event</p>
              <p className="text-sm text-muted-foreground">Dec 25, 2:00 PM</p>
            </div>
            <span className="px-3 py-1 bg-warning/10 text-warning rounded-full text-sm">Pending</span>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-card animate-slide-up delay-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <TrendingUp className="w-6 h-6 mr-2 text-primary" />
          Performance Stats
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Profile Views</span>
            <span className="font-semibold">1,234</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Booking Rate</span>
            <span className="font-semibold">85%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Response Time</span>
            <span className="font-semibold">2 hours</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ClientDashboard = ({ user }: { user: any }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <Calendar className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">2</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
        <p className="text-muted-foreground">Next event in 3 days</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in delay-100">
        <div className="flex items-center justify-between mb-4">
          <Users className="w-8 h-8 text-secondary" />
          <span className="text-2xl font-bold text-secondary">12</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Saved Artists</h3>
        <p className="text-muted-foreground">In 3 categories</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in delay-200">
        <div className="flex items-center justify-between mb-4">
          <DollarSign className="w-8 h-8 text-success" />
          <span className="text-2xl font-bold text-success">$1,200</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Total Spent</h3>
        <p className="text-muted-foreground">Last 6 months</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in delay-300">
        <div className="flex items-center justify-between mb-4">
          <Award className="w-8 h-8 text-warning" />
          <span className="text-2xl font-bold">8</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Events Hosted</h3>
        <p className="text-muted-foreground">This year</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-card p-6 rounded-lg shadow-card animate-slide-up">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-primary" />
          Upcoming Events
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Anniversary Party</p>
              <p className="text-sm text-muted-foreground">Dec 22, 7:00 PM - Jazz Quartet</p>
            </div>
            <span className="px-3 py-1 bg-success/10 text-success rounded-full text-sm">Confirmed</span>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">New Year's Gala</p>
              <p className="text-sm text-muted-foreground">Dec 31, 9:00 PM - Live Band</p>
            </div>
            <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">In Progress</span>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-card animate-slide-up delay-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Star className="w-6 h-6 mr-2 text-primary" />
          Recommended Artists
        </h3>
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-hero rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium">Sarah Johnson</p>
              <p className="text-sm text-muted-foreground">Jazz Vocalist • 4.9★</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-purple rounded-full flex items-center justify-center">
              <Music className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="font-medium">The Rhythm Kings</p>
              <p className="text-sm text-muted-foreground">Cover Band • 4.8★</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AdminDashboard = ({ user }: { user: any }) => (
  <div className="space-y-8">
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <Users className="w-8 h-8 text-primary" />
          <span className="text-2xl font-bold text-primary">1,234</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Total Users</h3>
        <p className="text-muted-foreground">+12% this month</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in delay-100">
        <div className="flex items-center justify-between mb-4">
          <Calendar className="w-8 h-8 text-secondary" />
          <span className="text-2xl font-bold text-secondary">89</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Active Bookings</h3>
        <p className="text-muted-foreground">Platform-wide</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in delay-200">
        <div className="flex items-center justify-between mb-4">
          <DollarSign className="w-8 h-8 text-success" />
          <span className="text-2xl font-bold text-success">$45,200</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Revenue</h3>
        <p className="text-muted-foreground">This month</p>
      </div>
      
      <div className="bg-card p-6 rounded-lg shadow-card hover-lift animate-fade-in delay-300">
        <div className="flex items-center justify-between mb-4">
          <TrendingUp className="w-8 h-8 text-warning" />
          <span className="text-2xl font-bold">94%</span>
        </div>
        <h3 className="text-lg font-semibold mb-2">Satisfaction</h3>
        <p className="text-muted-foreground">User rating</p>
      </div>
    </div>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div className="bg-card p-6 rounded-lg shadow-card animate-slide-up">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Settings className="w-6 h-6 mr-2 text-primary" />
          Platform Overview
        </h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Artists</span>
            <span className="font-semibold">456</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Clients</span>
            <span className="font-semibold">778</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-muted-foreground">Success Rate</span>
            <span className="font-semibold">92%</span>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-card animate-slide-up delay-100">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <MessageCircle className="w-6 h-6 mr-2 text-primary" />
          Recent Activity
        </h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">New artist registration</p>
              <p className="text-sm text-muted-foreground">2 minutes ago</p>
            </div>
          </div>
          <div className="flex items-center justify-between py-3 border-b border-border">
            <div>
              <p className="font-medium">Booking completed</p>
              <p className="text-sm text-muted-foreground">15 minutes ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

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

  const userName = user.profile?.full_name || user.email?.split('@')[0] || 'User';

  return (
    <div className="min-h-screen bg-background">
      <WelcomeScreen role={user.role || 'guest'} userName={userName} />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 gradient-hero bg-clip-text text-transparent">
            Welcome back, {userName}!
          </h1>
          <p className="text-muted-foreground text-lg">
            Role: {user.role?.charAt(0).toUpperCase() + user.role?.slice(1)} {user.profile?.is_premium ? '(Premium)' : ''}
          </p>
        </div>

        {user.role === 'artist' && <ArtistDashboard user={user} />}
        {user.role === 'client' && <ClientDashboard user={user} />}
        {user.role === 'admin' && <AdminDashboard user={user} />}
      </div>
    </div>
  );
};

export default Dashboard;