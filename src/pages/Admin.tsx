import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MetricCard } from '@/components/ui/metric-card';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  MoreVertical,
  UserCheck,
  UserX,
  Mail,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  BarChart3,
  Server,
  Zap,
  FileText
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  artistsCount: number;
  clientsCount: number;
  activeBookings: number;
  completedBookings: number;
  totalRevenue: string;
  activeDisputes: number;
  newUsersThisMonth: number;
  totalTransactions: number;
  globalRating: number;
  escrowBalance: string;
}

interface UserData {
  id: string;
  avatar: string;
  name: string;
  email: string;
  role: string;
  status: string;
  joinedAt: string;
}

interface BookingData {
  id: string;
  artistName: string;
  clientName: string;
  status: string;
  amount: string;
  date: string;
}

interface DisputeData {
  id: string;
  status: string;
  initiator: string;
  reason: string;
  lastUpdated: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
}

const Admin = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [userFilter, setUserFilter] = useState('all');
  
  // Mock data - replace with real API calls
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 1248,
    artistsCount: 432,
    clientsCount: 816,
    activeBookings: 87,
    completedBookings: 1563,
    totalRevenue: '$284,500',
    activeDisputes: 3,
    newUsersThisMonth: 156,
    totalTransactions: 2847,
    globalRating: 4.7,
    escrowBalance: '$45,800'
  });

  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      avatar: '/placeholder.svg',
      name: 'Sarah Johnson',
      email: 'sarah@artune.com',
      role: 'Artist',
      status: 'Active',
      joinedAt: '2024-01-15'
    },
    {
      id: '2',
      avatar: '/placeholder.svg',
      name: 'Mike Chen',
      email: 'mike@artune.com',
      role: 'Client',
      status: 'Active',
      joinedAt: '2024-02-20'
    },
    {
      id: '3',
      avatar: '/placeholder.svg',
      name: 'Emma Davis',
      email: 'emma@artune.com',
      role: 'Artist',
      status: 'Pending',
      joinedAt: '2024-03-10'
    }
  ]);

  const [bookings, setBookings] = useState<BookingData[]>([
    {
      id: 'BK-001',
      artistName: 'Sarah Johnson',
      clientName: 'Mike Chen',
      status: 'Active',
      amount: '$2,800',
      date: '2024-04-15'
    },
    {
      id: 'BK-002',
      artistName: 'Emma Davis',
      clientName: 'John Smith',
      status: 'Completed',
      amount: '$1,500',
      date: '2024-03-22'
    }
  ]);

  const [disputes, setDisputes] = useState<DisputeData[]>([
    {
      id: 'DSP-001',
      status: 'Open',
      initiator: 'Mike Chen',
      reason: 'Service not delivered as described',
      lastUpdated: '2024-03-18',
      priority: 'high'
    },
    {
      id: 'DSP-002',
      status: 'Under Review',
      initiator: 'Emma Davis',
      reason: 'Payment delay issue',
      lastUpdated: '2024-03-20',
      priority: 'medium'
    }
  ]);

  useEffect(() => {
    if (user && user.profile?.user_type === 'admin') {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch real data from Supabase
      const { data: usersData } = await supabase
        .from('profiles')
        .select('*')
        .limit(50);

      const { data: bookingsData } = await supabase
        .from('bookings')
        .select('*')
        .limit(50);

      // Transform data as needed
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load dashboard data",
        variant: "destructive"
      });
      setIsLoading(false);
    }
  };

  if (loading || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading Admin Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || user.profile?.user_type !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      'Active': 'default',
      'Pending': 'secondary',
      'Suspended': 'destructive',
      'Completed': 'default',
      'Open': 'destructive'
    };
    return <Badge variant={variants[status] || 'outline'}>{status}</Badge>;
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      'urgent': 'text-red-500',
      'high': 'text-orange-500',
      'medium': 'text-yellow-500',
      'low': 'text-green-500'
    };
    return colors[priority] || 'text-gray-500';
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = userFilter === 'all' || 
                          user.role.toLowerCase() === userFilter.toLowerCase() ||
                          user.status.toLowerCase() === userFilter.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0E0E12]">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Shield className="w-8 h-8 text-[#9B5DE5]" />
              <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>
            </div>
            <p className="text-gray-400">Platform overview and management tools.</p>
          </div>
          <Button 
            onClick={() => navigate('/analytics')}
            className="bg-[#9B5DE5] hover:bg-[#7B3DC5] text-white"
          >
            <BarChart3 className="w-4 h-4 mr-2" />
            View Analytics
          </Button>
        </div>

        {/* Top Metric Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <MetricCard
            title="Total Users"
            value={stats.totalUsers}
            description={`${stats.artistsCount} artists, ${stats.clientsCount} clients`}
            icon={Users}
            trend={{ value: 12.5, isPositive: true }}
            className="bg-[#1A1A24] border-[#9B5DE5]/20 hover-lift"
          />
          <MetricCard
            title="Active Bookings"
            value={stats.activeBookings}
            description={`${stats.completedBookings} completed`}
            icon={Calendar}
            trend={{ value: 8.3, isPositive: true }}
            className="bg-[#1A1A24] border-[#9B5DE5]/20 hover-lift"
          />
          <MetricCard
            title="Total Revenue"
            value={stats.totalRevenue}
            description="Platform fees collected"
            icon={DollarSign}
            trend={{ value: 15.2, isPositive: true }}
            className="bg-[#1A1A24] border-[#9B5DE5]/20 hover-lift"
          />
          <MetricCard
            title="Active Disputes"
            value={stats.activeDisputes}
            description="Requiring attention"
            icon={AlertTriangle}
            className="bg-[#1A1A24] border-amber-500/20 hover-lift"
          />
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="bg-[#1A1A24] border border-[#9B5DE5]/20">
            <TabsTrigger value="users" className="data-[state=active]:bg-[#9B5DE5]">
              <Users className="w-4 h-4 mr-2" />
              User Management
            </TabsTrigger>
            <TabsTrigger value="bookings" className="data-[state=active]:bg-[#9B5DE5]">
              <Calendar className="w-4 h-4 mr-2" />
              Bookings
            </TabsTrigger>
            <TabsTrigger value="disputes" className="data-[state=active]:bg-[#9B5DE5]">
              <AlertTriangle className="w-4 h-4 mr-2" />
              Disputes
            </TabsTrigger>
            <TabsTrigger value="analytics" className="data-[state=active]:bg-[#9B5DE5]">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
          </TabsList>

          {/* User Management Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-[#1A1A24] border-[#9B5DE5]/20">
              <CardHeader>
                <CardTitle className="text-white">User Management</CardTitle>
                <CardDescription className="text-gray-400">
                  Manage artists and clients on the platform.
                </CardDescription>
                
                {/* Search and Filters */}
                <div className="flex gap-4 mt-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="Search users..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 bg-[#0E0E12] border-[#9B5DE5]/20 text-white"
                    />
                  </div>
                  <Select value={userFilter} onValueChange={setUserFilter}>
                    <SelectTrigger className="w-48 bg-[#0E0E12] border-[#9B5DE5]/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A24] border-[#9B5DE5]/20">
                      <SelectItem value="all">All Users</SelectItem>
                      <SelectItem value="artist">Artists</SelectItem>
                      <SelectItem value="client">Clients</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-4 rounded-lg bg-[#0E0E12] border border-[#9B5DE5]/10 hover:border-[#9B5DE5]/30 transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar className="h-12 w-12 border-2 border-[#9B5DE5]/20">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="bg-[#9B5DE5]/20 text-white">
                            {user.name.split(' ').map(n => n[0]).join('')}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold text-white">{user.name}</h4>
                            <Badge variant="outline" className="text-xs border-[#9B5DE5]/30">
                              {user.role}
                            </Badge>
                            {getStatusBadge(user.status)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {user.email}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              Joined {user.joinedAt}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#1A1A24] border-[#9B5DE5]/20">
                          <DropdownMenuItem className="text-white hover:bg-[#9B5DE5]/20">
                            <Eye className="w-4 h-4 mr-2" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-white hover:bg-[#9B5DE5]/20">
                            <MessageSquare className="w-4 h-4 mr-2" />
                            Send Message
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-amber-500 hover:bg-amber-500/20">
                            <UserX className="w-4 h-4 mr-2" />
                            Suspend Account
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bookings Overview Tab */}
          <TabsContent value="bookings" className="space-y-6">
            <Card className="bg-[#1A1A24] border-[#9B5DE5]/20">
              <CardHeader>
                <CardTitle className="text-white">Bookings Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  Track current and past bookings across the platform.
                </CardDescription>
                
                <div className="flex gap-2 mt-4">
                  <Button variant="outline" size="sm" className="border-[#9B5DE5]/30 text-white">
                    All
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    Active
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    Completed
                  </Button>
                  <Button variant="ghost" size="sm" className="text-gray-400">
                    Cancelled
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 rounded-lg bg-[#0E0E12] border border-[#9B5DE5]/10 hover:border-[#9B5DE5]/30 transition-all"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <Badge variant="outline" className="border-[#9B5DE5]/30 text-white">
                            {booking.id}
                          </Badge>
                          {getStatusBadge(booking.status)}
                        </div>
                        <span className="text-xl font-bold text-[#9B5DE5]">{booking.amount}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <p className="text-gray-400 mb-1">Artist</p>
                          <p className="text-white font-medium">{booking.artistName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Client</p>
                          <p className="text-white font-medium">{booking.clientName}</p>
                        </div>
                        <div>
                          <p className="text-gray-400 mb-1">Event Date</p>
                          <p className="text-white font-medium">{booking.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Disputes Center Tab */}
          <TabsContent value="disputes" className="space-y-6">
            <Card className="bg-[#1A1A24] border-[#9B5DE5]/20">
              <CardHeader>
                <CardTitle className="text-white">Disputes & Resolution</CardTitle>
                <CardDescription className="text-gray-400">
                  Monitor and resolve conflicts between clients and artists.
                </CardDescription>
                
                <div className="flex gap-4 text-sm mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                    <span className="text-white">{disputes.filter(d => d.status === 'Open').length} open</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-white">0 resolved</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {disputes.map((dispute) => (
                    <div
                      key={dispute.id}
                      className="p-4 rounded-lg bg-[#0E0E12] border border-amber-500/20 hover:border-amber-500/40 transition-all"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            dispute.priority === 'urgent' ? 'bg-red-500 animate-pulse' :
                            dispute.priority === 'high' ? 'bg-orange-500' :
                            dispute.priority === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                          }`}></div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <Badge variant="outline" className="border-amber-500/30 text-white">
                                {dispute.id}
                              </Badge>
                              {getStatusBadge(dispute.status)}
                              <span className={`text-xs uppercase font-semibold ${getPriorityColor(dispute.priority)}`}>
                                {dispute.priority}
                              </span>
                            </div>
                            <p className="text-sm text-gray-400">Initiated by {dispute.initiator}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" className="border-[#9B5DE5]/30 text-white">
                            <Eye className="w-4 h-4 mr-1" />
                            Review Case
                          </Button>
                          <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Mark Resolved
                          </Button>
                        </div>
                      </div>
                      <div className="pl-6">
                        <p className="text-white mb-2">{dispute.reason}</p>
                        <p className="text-xs text-gray-400">Last updated: {dispute.lastUpdated}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Platform Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="bg-[#1A1A24] border-[#9B5DE5]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-500" />
                    New Users This Month
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-white mb-2">{stats.newUsersThisMonth}</p>
                  <p className="text-sm text-gray-400">↑ 23% from last month</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A24] border-[#9B5DE5]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="w-5 h-5 text-[#9B5DE5]" />
                    Total Transactions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-white mb-2">{stats.totalTransactions}</p>
                  <p className="text-sm text-gray-400">All-time platform transactions</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A24] border-[#9B5DE5]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-amber-500" />
                    Global Rating
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-white mb-2">{stats.globalRating} ⭐</p>
                  <p className="text-sm text-gray-400">Average platform-wide rating</p>
                </CardContent>
              </Card>

              <Card className="bg-[#1A1A24] border-[#9B5DE5]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-green-500" />
                    Escrow Balance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-4xl font-bold text-white mb-2">{stats.escrowBalance}</p>
                  <p className="text-sm text-gray-400">Funds held in escrow</p>
                </CardContent>
              </Card>

              {/* System Health Widget */}
              <Card className="bg-[#1A1A24] border-[#9B5DE5]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Server className="w-5 h-5 text-blue-500" />
                    System Health
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">API Uptime</span>
                    <span className="text-sm text-green-500 font-semibold">99.9%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">DB Latency</span>
                    <span className="text-sm text-green-500 font-semibold">12ms</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-400">Webhook Success</span>
                    <span className="text-sm text-green-500 font-semibold">98.5%</span>
                  </div>
                </CardContent>
              </Card>

              {/* Activity Feed */}
              <Card className="bg-[#1A1A24] border-[#9B5DE5]/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Zap className="w-5 h-5 text-yellow-500" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-green-500 rounded-full mt-1.5"></div>
                    <p className="text-gray-400">New artist registered</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5"></div>
                    <p className="text-gray-400">Booking completed</p>
                  </div>
                  <div className="flex items-start gap-2 text-sm">
                    <div className="w-2 h-2 bg-amber-500 rounded-full mt-1.5"></div>
                    <p className="text-gray-400">Refund issued</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-[#9B5DE5]/20 flex items-center justify-between text-sm text-gray-400">
          <p>Admin Dashboard v1.0.0</p>
          <p>Built by ArtUne Team</p>
        </div>
      </div>
    </div>
  );
};

export default Admin;