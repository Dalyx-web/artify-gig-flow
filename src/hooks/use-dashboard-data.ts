import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useRealtimeSubscription } from './use-realtime-subscription';
import { useToast } from '@/hooks/use-toast';

export interface DashboardStats {
  // Common stats
  totalBookings: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: string;
  
  // Artist-specific
  upcomingEvents?: number;
  averageRating?: number;
  profileViews?: number;
  pendingRequests?: number;
  
  // Client-specific
  totalSpent?: string;
  favoriteArtists?: number;
  upcomingEventsCount?: number;
  
  // Admin-specific
  totalUsers?: number;
  artistsCount?: number;
  clientsCount?: number;
  activeDisputes?: number;
  pendingApprovals?: number;
  newUsersThisMonth?: number;
  totalTransactions?: number;
  globalRating?: number;
  escrowBalance?: string;
}

export interface RecentActivity {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'message' | 'dispute';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  amount?: string;
}

export function useDashboardData(userRole: 'artist' | 'client' | 'admin') {
  const { user } = useAuth();
  const { toast } = useToast();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());

  // Fetch initial data
  const fetchData = useCallback(async () => {
    if (!user) return;

    try {
      setLoading(true);

      if (userRole === 'artist') {
        await fetchArtistData();
      } else if (userRole === 'client') {
        await fetchClientData();
      } else if (userRole === 'admin') {
        await fetchAdminData();
      }

      setLastUpdate(new Date());
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [user, userRole]);

  const fetchArtistData = async () => {
    if (!user) return;

    // Get artist profile
    const { data: artistProfile } = await supabase
      .from('artist_profiles')
      .select('id, rating, total_reviews, total_bookings')
      .eq('user_id', user.id)
      .single();

    if (!artistProfile) return;

    // Get bookings stats
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, status, total_amount, event_date')
      .eq('artist_profile_id', artistProfile.id);

    const now = new Date();
    const upcomingEvents = bookings?.filter(b => 
      new Date(b.event_date) > now && b.status === 'confirmed'
    ).length || 0;

    const activeBookings = bookings?.filter(b => 
      b.status === 'pending' || b.status === 'confirmed'
    ).length || 0;

    const completedBookings = bookings?.filter(b => 
      b.status === 'completed'
    ).length || 0;

    const totalRevenue = bookings
      ?.filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

    setStats({
      totalBookings: bookings?.length || 0,
      activeBookings,
      completedBookings,
      totalRevenue: `AED ${totalRevenue.toLocaleString()}`,
      upcomingEvents,
      averageRating: artistProfile.rating || 0,
      profileViews: 0, // TODO: Implement view tracking
      pendingRequests: bookings?.filter(b => b.status === 'pending').length || 0
    });

    // Get recent activity
    await fetchArtistActivity(artistProfile.id);
  };

  const fetchClientData = async () => {
    if (!user) return;

    // Get bookings as client
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, status, total_amount, event_date, artist_profiles(artistic_name)')
      .eq('client_id', user.id);

    const now = new Date();
    const upcomingEventsCount = bookings?.filter(b => 
      new Date(b.event_date) > now && b.status === 'confirmed'
    ).length || 0;

    const activeBookings = bookings?.filter(b => 
      b.status === 'pending' || b.status === 'confirmed'
    ).length || 0;

    const completedBookings = bookings?.filter(b => 
      b.status === 'completed'
    ).length || 0;

    const totalSpent = bookings
      ?.filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

    // Get favorite artists count
    const { data: favorites } = await supabase
      .from('favorites')
      .select('id')
      .eq('user_id', user.id);

    setStats({
      totalBookings: bookings?.length || 0,
      activeBookings,
      completedBookings,
      totalRevenue: `AED ${totalSpent.toLocaleString()}`,
      totalSpent: `AED ${totalSpent.toLocaleString()}`,
      favoriteArtists: favorites?.length || 0,
      upcomingEventsCount
    });

    // Get recent activity
    await fetchClientActivity();
  };

  const fetchAdminData = async () => {
    // Get user counts
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, user_type');

    const artistsCount = profiles?.filter(p => p.user_type === 'artist').length || 0;
    const clientsCount = profiles?.filter(p => p.user_type === 'client').length || 0;

    // Get bookings stats
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, status, total_amount');

    const activeBookings = bookings?.filter(b => 
      b.status === 'pending' || b.status === 'confirmed'
    ).length || 0;

    const completedBookings = bookings?.filter(b => 
      b.status === 'completed'
    ).length || 0;

    const totalRevenue = bookings
      ?.filter(b => b.status === 'completed')
      .reduce((sum, b) => sum + Number(b.total_amount), 0) || 0;

    // Get disputes
    const { data: infractions } = await supabase
      .from('message_infractions')
      .select('id, review_status')
      .is('review_status', null);

    // Calculate additional metrics
    const newUsersThisMonth = 156; // TODO: Calculate from profiles.created_at
    const totalTransactions = bookings?.length || 0;
    const globalRating = 4.7; // TODO: Calculate from reviews average

    setStats({
      totalUsers: profiles?.length || 0,
      artistsCount,
      clientsCount,
      totalBookings: bookings?.length || 0,
      activeBookings,
      completedBookings,
      totalRevenue: `AED ${totalRevenue.toLocaleString()}`,
      activeDisputes: infractions?.length || 0,
      pendingApprovals: 0, // TODO: Implement approval system
      newUsersThisMonth,
      totalTransactions,
      globalRating,
      escrowBalance: `AED ${(totalRevenue * 0.15).toLocaleString()}` // 15% platform fee
    });

    // Get recent activity
    await fetchAdminActivity();
  };

  const fetchArtistActivity = async (artistProfileId: string) => {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, event_title, status, total_amount, created_at, profiles!client_id(full_name)')
      .eq('artist_profile_id', artistProfileId)
      .order('created_at', { ascending: false })
      .limit(5);

    const activity: RecentActivity[] = bookings?.map(b => ({
      id: b.id,
      type: 'booking' as const,
      title: b.event_title,
      description: `Booking from ${(b.profiles as any)?.full_name || 'Client'}`,
      timestamp: b.created_at,
      status: b.status,
      amount: `AED ${Number(b.total_amount).toLocaleString()}`
    })) || [];

    setRecentActivity(activity);
  };

  const fetchClientActivity = async () => {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, event_title, status, total_amount, created_at, artist_profiles(artistic_name)')
      .eq('client_id', user?.id)
      .order('created_at', { ascending: false })
      .limit(5);

    const activity: RecentActivity[] = bookings?.map(b => ({
      id: b.id,
      type: 'booking' as const,
      title: b.event_title,
      description: `With ${(b.artist_profiles as any)?.artistic_name || 'Artist'}`,
      timestamp: b.created_at,
      status: b.status,
      amount: `AED ${Number(b.total_amount).toLocaleString()}`
    })) || [];

    setRecentActivity(activity);
  };

  const fetchAdminActivity = async () => {
    const { data: bookings } = await supabase
      .from('bookings')
      .select('id, event_title, status, created_at')
      .order('created_at', { ascending: false })
      .limit(5);

    const activity: RecentActivity[] = bookings?.map(b => ({
      id: b.id,
      type: 'booking' as const,
      title: `Booking: ${b.event_title}`,
      description: `Status: ${b.status}`,
      timestamp: b.created_at,
      status: b.status
    })) || [];

    setRecentActivity(activity);
  };

  // Set up real-time subscriptions
  useRealtimeSubscription({
    table: 'bookings',
    event: '*',
    enabled: true,
    onInsert: (payload) => {
      console.log('[Dashboard] New booking:', payload);
      fetchData(); // Refetch all data
    },
    onUpdate: (payload) => {
      console.log('[Dashboard] Booking updated:', payload);
      fetchData(); // Refetch all data
    }
  });

  useRealtimeSubscription({
    table: 'reviews',
    event: '*',
    enabled: userRole === 'artist',
    onInsert: () => fetchData()
  });

  useRealtimeSubscription({
    table: 'messages',
    event: 'INSERT',
    enabled: true,
    onInsert: () => {
      toast({
        title: "New Message",
        description: "You have a new message",
        duration: 3000
      });
    }
  });

  // Initial data fetch
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return {
    stats,
    recentActivity,
    loading,
    lastUpdate,
    refetch: fetchData
  };
}