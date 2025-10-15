import { useAuth } from '@/contexts/AuthContext';
import { useDashboardData } from '@/hooks/use-dashboard-data';
import { QuickStats } from '@/components/dashboard/QuickStats';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { LiveIndicator } from '@/components/dashboard/LiveIndicator';
import { ArtistDiscoveryPanel } from './ArtistDiscoveryPanel';
import { UpcomingEventsCard } from './UpcomingEventsCard';
import { QuickActionsPanel } from './QuickActionsPanel';
import { PlanningTipsCard } from './PlanningTipsCard';
import { Button } from '@/components/ui/button';
import { Music, RefreshCw } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function ClientDashboard() {
  const { user } = useAuth();
  const { stats, recentActivity, loading, lastUpdate, refetch } = useDashboardData('client');

  // Mock upcoming events - in real app, this comes from the hook
  const upcomingEvents = [
    {
      id: '1',
      name: 'Corporate Annual Gala',
      artistName: 'Sarah Al Mansouri',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Burj Khalifa, Dubai',
      status: 'confirmed' as const,
      paymentAmount: 5000
    },
    {
      id: '2',
      name: 'Wedding Reception',
      artistName: 'Ahmed Hassan Band',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      venue: 'Atlantis The Palm, Dubai',
      status: 'pending' as const,
      paymentAmount: 8500
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="relative overflow-hidden rounded-2xl gradient-hero p-8 shadow-elegant">
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <Music className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold text-white mb-1">
                  Welcome back, {user?.user_metadata?.full_name || 'there'}! 🎵
                </h1>
                <p className="text-white/80">
                  Discover amazing artists and manage your events effortlessly
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <LiveIndicator lastUpdate={lastUpdate} isLive={true} />
              <Button
                variant="secondary"
                size="icon"
                onClick={refetch}
                className="rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/30"
              >
                <RefreshCw className="w-4 h-4 text-white" />
              </Button>
            </div>
          </div>
        </div>
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-glow/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      </div>

      {/* Quick Stats */}
      <QuickStats userRole="client" data={stats} />

      {/* Quick Actions */}
      <QuickActionsPanel />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Upcoming Events & Planning Tips */}
        <div className="lg:col-span-2 space-y-6">
          <UpcomingEventsCard events={upcomingEvents} />
          <ArtistDiscoveryPanel />
        </div>

        {/* Right Column - Activity Feed & Tips */}
        <div className="space-y-6">
          <ActivityFeed 
            activities={recentActivity}
            title="Recent Activity"
            description="Your latest bookings and updates"
          />
          <PlanningTipsCard />
        </div>
      </div>
    </div>
  );
}
