import { MetricCard } from '@/components/ui/metric-card';
import { 
  DollarSign, 
  Calendar, 
  Star, 
  TrendingUp,
  Users,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

interface QuickStatsProps {
  userRole: 'artist' | 'client' | 'admin';
  data?: {
    totalEarnings?: number;
    upcomingBookings?: number;
    rating?: number;
    totalBookings?: number;
    totalSpent?: number;
    favoriteArtists?: number;
    totalUsers?: number;
    activeDisputes?: number;
    completedBookings?: number;
    pendingApprovals?: number;
  };
}

export function QuickStats({ userRole, data = {} }: QuickStatsProps) {
  if (userRole === 'artist') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Earnings"
          value={`$${data.totalEarnings?.toLocaleString() || '0'}`}
          description="This month"
          icon={DollarSign}
          trend={{ value: 12, isPositive: true }}
        />
        <MetricCard
          title="Upcoming Bookings"
          value={data.upcomingBookings || 0}
          description="Next 30 days"
          icon={Calendar}
          trend={{ value: 8, isPositive: true }}
        />
        <MetricCard
          title="Average Rating"
          value={`${data.rating || '0.0'}/5.0`}
          description="Based on reviews"
          icon={Star}
          trend={{ value: 2, isPositive: true }}
        />
        <MetricCard
          title="Profile Views"
          value="1,234"
          description="This week"
          icon={TrendingUp}
          trend={{ value: 15, isPositive: true }}
        />
      </div>
    );
  }

  if (userRole === 'client') {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Spent"
          value={`$${data.totalSpent?.toLocaleString() || '0'}`}
          description="All time"
          icon={DollarSign}
        />
        <MetricCard
          title="Total Bookings"
          value={data.totalBookings || 0}
          description="Completed events"
          icon={Calendar}
          trend={{ value: 5, isPositive: true }}
        />
        <MetricCard
          title="Favorite Artists"
          value={data.favoriteArtists || 0}
          description="Saved profiles"
          icon={Star}
        />
        <MetricCard
          title="Upcoming Events"
          value={data.upcomingBookings || 0}
          description="Next 30 days"
          icon={Clock}
          trend={{ value: 3, isPositive: true }}
        />
      </div>
    );
  }

  // Admin stats
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <MetricCard
        title="Total Users"
        value={data.totalUsers?.toLocaleString() || '0'}
        description="Artists + Clients"
        icon={Users}
        trend={{ value: 7, isPositive: true }}
      />
      <MetricCard
        title="Active Disputes"
        value={data.activeDisputes || 0}
        description="Requiring attention"
        icon={AlertCircle}
        trend={{ value: 2, isPositive: false }}
      />
      <MetricCard
        title="Completed Bookings"
        value={data.completedBookings?.toLocaleString() || '0'}
        description="This month"
        icon={CheckCircle}
        trend={{ value: 12, isPositive: true }}
      />
      <MetricCard
        title="Pending Approvals"
        value={data.pendingApprovals || 0}
        description="Artist profiles"
        icon={Clock}
      />
    </div>
  );
}
