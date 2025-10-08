import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save } from "lucide-react";
import { BasicInfoTab } from "@/components/profile/BasicInfoTab";
import { MusicalDetailsTab } from "@/components/profile/MusicalDetailsTab";
import { ServicesTab } from "@/components/profile/ServicesTab";
import { GalleryTab } from "@/components/profile/GalleryTab";
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
import { Badge } from "@/components/ui/badge";
import { Calendar, LayoutDashboard, User, MessageSquare, Briefcase, BarChart3, Star, CreditCard, Settings, Music, Search, Bell } from "lucide-react";

// Sidebar Navigation Component (same as Dashboard)
const DashboardSidebar = () => {
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
                    onClick={() => window.location.href = item.path}
                    className={`w-full justify-start hover:bg-primary/10 hover:text-primary transition-all rounded-lg ${
                      window.location.pathname === item.path ? 'bg-primary text-primary-foreground' : ''
                    }`}
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

export default function ProfileSettings() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("basic-info");

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
          {/* Top Navigation Bar */}
          <header className="h-16 border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-40 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <nav className="hidden md:flex items-center gap-6">
                <a href="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Dashboard</a>
                <a href="/bookings" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Bookings</a>
                <a href="/profile-settings" className="text-sm font-medium text-foreground hover:text-primary transition-colors">Profile</a>
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

          {/* Main Content */}
          <main className="flex-1 p-6 overflow-auto">
            <div className="max-w-7xl mx-auto space-y-6">
              {/* Page Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-4xl font-bold mb-2">Artist Profile</h1>
                  <p className="text-muted-foreground">Manage your public profile and showcase your talent</p>
                </div>
                <Button className="bg-primary hover:bg-primary/90">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="bg-card/50 border border-border p-1 h-12 inline-flex rounded-lg">
                  <TabsTrigger 
                    value="basic-info" 
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground px-6"
                  >
                    Basic Info
                  </TabsTrigger>
                  <TabsTrigger 
                    value="musical-details"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground px-6"
                  >
                    Musical Details
                  </TabsTrigger>
                  <TabsTrigger 
                    value="services"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground px-6"
                  >
                    Services
                  </TabsTrigger>
                  <TabsTrigger 
                    value="gallery"
                    className="data-[state=active]:bg-background data-[state=active]:text-foreground px-6"
                  >
                    Gallery
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="basic-info" className="space-y-6">
                  <BasicInfoTab />
                </TabsContent>

                <TabsContent value="musical-details" className="space-y-6">
                  <MusicalDetailsTab />
                </TabsContent>

                <TabsContent value="services" className="space-y-6">
                  <ServicesTab />
                </TabsContent>

                <TabsContent value="gallery" className="space-y-6">
                  <GalleryTab />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
