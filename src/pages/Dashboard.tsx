import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { QuickStats } from "@/components/dashboard/QuickStats";
import { ClientDashboard } from '@/components/client/ClientDashboard';
import { Calendar, Users, Clock, Music, CalendarCheck, BarChart3, LayoutDashboard, Briefcase, User, MessageSquare, CreditCard, Settings, Search, Bell, DollarSign, Star } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";

// Sidebar Navigation Component
const DashboardSidebar = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: Calendar, label: "Bookings", path: "/bookings", badge: 3 },
    { icon: User, label: "Profile", path: "/profile-settings" },
    { icon: MessageSquare, label: "Messages", path: "/messages", badge: 2 },
    { icon: Briefcase, label: "Job Board", path: "/job-board" },
    { icon: BarChart3, label: "Analytics", path: "/analytics" },
    { icon: Star, label: "Reviews", path: "/reviews" },
    { icon: CreditCard, label: "Payments", path: "/payments" },
    { icon: Settings, label: "Settings", path: "/settings" },
  ];

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-card border-r border-border">
        <div className="p-4 border-b border-border flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Music className="w-6 h-6 text-white" />
          </div>
          {!isCollapsed && <span className="font-bold text-xl">ArtUne</span>}
        </div>

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1 p-2">
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    className="w-full justify-start hover:bg-primary/10 hover:text-primary transition-all rounded-lg"
                  >
                    <item.icon className="w-5 h-5" />
                    {!isCollapsed && (
                      <>
                        <span className="flex-1">{item.label}</span>
                        {item.badge && (
                          <Badge variant="secondary" className="ml-auto">
                            {item.badge}
                          </Badge>
                        )}
                      </>
                    )}
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <div className="mt-auto p-4 border-t border-border">
          <div className="text-xs text-muted-foreground">
            {!isCollapsed && (
              <>
                <p className="mb-1">Artist Dashboard</p>
                <p>v1.0.0</p>
              </>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};


// Artist Dashboard Component
const ArtistDashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Welcome back, Alex! 👋</h1>
          <p className="text-muted-foreground">Here's what's happening with your bookings today.</p>
        </div>
        <Button className="bg-primary hover:bg-primary/90">
          <Calendar className="w-4 h-4 mr-2" />
          New Booking
        </Button>
      </div>

      {/* Quick Stats */}
      <QuickStats 
        userRole="artist"
        data={{
          totalEarnings: 12500,
          upcomingBookings: 8,
          rating: 4.8,
        }}
      />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Upcoming Events */}
        <Card className="lg:col-span-2 bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-primary" />
              <CardTitle className="text-2xl">Upcoming Events</CardTitle>
            </div>
            <CardDescription>Your next bookings and their details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Event 1 */}
            <div className="flex items-start justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">Wedding Reception</h3>
                  <Badge className="bg-green-500/20 text-green-500 border-green-500/30">confirmed</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Client: Sarah & Mike Johnson</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    2024-01-15 at 18:00
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Grand Hotel Ballroom
                  </span>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="text-2xl font-bold text-cyan">$2,500</p>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>

            {/* Event 2 */}
            <div className="flex items-start justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-all">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">Corporate Event</h3>
                  <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30">pending</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Client: Tech Corporation</p>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    2024-01-20 at 19:00
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    Convention Center
                  </span>
                </div>
              </div>
              <div className="text-right space-y-2">
                <p className="text-2xl font-bold text-cyan">$3,200</p>
                <Button variant="outline" size="sm">View Details</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="bg-card/50 backdrop-blur-sm border-border">
          <CardHeader>
            <CardTitle className="text-2xl">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-4"
              onClick={() => navigate('/quotes')}
            >
              <DollarSign className="w-5 h-5 mr-3" />
              <span className="font-medium">Generate Quote</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-4"
              onClick={() => navigate('/profile-settings')}
            >
              <Music className="w-5 h-5 mr-3" />
              <span className="font-medium">Update Portfolio</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-4"
              onClick={() => navigate('/availability')}
            >
              <CalendarCheck className="w-5 h-5 mr-3" />
              <span className="font-medium">Set Availability</span>
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start h-auto py-4"
              onClick={() => navigate('/analytics')}
            >
              <BarChart3 className="w-5 h-5 mr-3" />
              <span className="font-medium">View Analytics</span>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// ClientDashboard is imported from @/components/client/ClientDashboard

const AdminDashboard = () => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-muted-foreground">Manage users, bookings, and platform settings.</p>
      </div>
    </div>
    
    <QuickStats 
      userRole="admin"
      data={{
        totalUsers: 1234,
        activeDisputes: 3,
        completedBookings: 156,
        pendingApprovals: 8,
      }}
    />
  </div>
);

// Main Dashboard Component
export default function Dashboard() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <DashboardSidebar />
        
        <div className="flex-1 flex flex-col">
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <nav className="hidden md:flex items-center gap-6">
                <a href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Dashboard</a>
                <a href="/bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Bookings</a>
                <a href="/profile-settings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Profile</a>
                <a href="/job-board" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Job Board</a>
              </nav>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Search className="w-5 h-5" />
              </Button>
              <div className="relative">
                <Button variant="ghost" size="icon">
                  <Bell className="w-5 h-5" />
                </Button>
                <Badge className="absolute -top-1 -right-1 w-5 h-5 flex items-center justify-center p-0 bg-coral border-0 text-xs">
                  2
                </Badge>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center text-white font-bold">
                {user.profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'A'}
              </div>
            </div>
          </header>

          <main className="flex-1 p-6 overflow-auto">
            {user.role === 'artist' && <ArtistDashboard />}
            {user.role === 'client' && <ClientDashboard />}
            {user.role === 'admin' && <AdminDashboard />}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

