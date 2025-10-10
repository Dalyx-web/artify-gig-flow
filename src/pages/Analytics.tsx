import { useState, useEffect } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BarChart3, TrendingUp, Eye, Search, MessageSquare, Calendar, Crown, Loader2, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface MetricData {
  date: string;
  profile_views: number;
  search_impressions: number;
  contact_clicks: number;
  booking_requests: number;
}

interface AnalyticsSummary {
  total_profile_views: number;
  total_search_impressions: number;
  total_contact_clicks: number;
  total_booking_requests: number;
  profile_views_change: number;
  search_impressions_change: number;
  contact_clicks_change: number;
  booking_requests_change: number;
}

export default function Analytics() {
  const { user, loading: authLoading } = useAuth();
  const [timeRange, setTimeRange] = useState('7d');
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<MetricData[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const isPro = true; // TODO: Get from user profile

  useEffect(() => {
    const loadAnalytics = async () => {
      setLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (isPro) {
        const days = timeRange === '7d' ? 7 : timeRange === '30d' ? 30 : 90;
        const mockMetrics: MetricData[] = [];
        
        for (let i = days - 1; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          mockMetrics.push({
            date: date.toISOString().split('T')[0],
            profile_views: Math.floor(Math.random() * 50) + 10,
            search_impressions: Math.floor(Math.random() * 100) + 20,
            contact_clicks: Math.floor(Math.random() * 15) + 2,
            booking_requests: Math.floor(Math.random() * 8) + 1
          });
        }
        
        setMetrics(mockMetrics);
        setSummary({
          total_profile_views: mockMetrics.reduce((sum, m) => sum + m.profile_views, 0),
          total_search_impressions: mockMetrics.reduce((sum, m) => sum + m.search_impressions, 0),
          total_contact_clicks: mockMetrics.reduce((sum, m) => sum + m.contact_clicks, 0),
          total_booking_requests: mockMetrics.reduce((sum, m) => sum + m.booking_requests, 0),
          profile_views_change: Math.floor(Math.random() * 40) - 20,
          search_impressions_change: Math.floor(Math.random() * 60) - 30,
          contact_clicks_change: Math.floor(Math.random() * 30) - 15,
          booking_requests_change: Math.floor(Math.random() * 20) - 10
        });
      }
      
      setLoading(false);
    };

    loadAnalytics();
  }, [timeRange, isPro]);

  const getTrendIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="h-4 w-4 text-success" />;
    if (change < 0) return <ArrowDown className="h-4 w-4 text-destructive" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getTrendColor = (change: number) => {
    if (change > 0) return 'text-success';
    if (change < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isPro) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="border-border bg-card">
          <CardContent className="pt-6">
            <div className="text-center py-12">
              <div className="relative">
                <div className="filter blur-sm pointer-events-none">
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
                    <div className="bg-muted/50 h-24 rounded-lg"></div>
                    <div className="bg-muted/50 h-24 rounded-lg"></div>
                    <div className="bg-muted/50 h-24 rounded-lg"></div>
                    <div className="bg-muted/50 h-24 rounded-lg"></div>
                  </div>
                  <div className="bg-muted/50 h-64 rounded-lg"></div>
                </div>
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-background/95 backdrop-blur-sm border border-border rounded-lg p-8 max-w-md">
                    <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Unlock Pro Analytics</h3>
                    <p className="text-muted-foreground mb-6 text-sm">
                      Get detailed insights into your profile performance, search visibility, and client engagement.
                    </p>
                    <Button className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      <Crown className="mr-2 h-4 w-4" />
                      Upgrade to Pro
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <Card className="border-border bg-card">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <BarChart3 className="mr-2 h-6 w-6 text-primary" />
              Analytics Dashboard
            </h2>
            <p className="text-muted-foreground">Track your profile performance and engagement</p>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className="bg-primary text-primary-foreground border-0">
              <Crown className="mr-1 h-3 w-3" />
              Pro
            </Badge>
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Profile Views</p>
                    <p className="text-2xl font-bold">{summary.total_profile_views.toLocaleString()}</p>
                  </div>
                  <Eye className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  {getTrendIcon(summary.profile_views_change)}
                  <span className={`text-sm ml-1 ${getTrendColor(summary.profile_views_change)}`}>
                    {Math.abs(summary.profile_views_change)}% vs previous period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Search Impressions</p>
                    <p className="text-2xl font-bold">{summary.total_search_impressions.toLocaleString()}</p>
                  </div>
                  <Search className="h-8 w-8 text-cyan" />
                </div>
                <div className="flex items-center mt-2">
                  {getTrendIcon(summary.search_impressions_change)}
                  <span className={`text-sm ml-1 ${getTrendColor(summary.search_impressions_change)}`}>
                    {Math.abs(summary.search_impressions_change)}% vs previous period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Contact Clicks</p>
                    <p className="text-2xl font-bold">{summary.total_contact_clicks.toLocaleString()}</p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-coral" />
                </div>
                <div className="flex items-center mt-2">
                  {getTrendIcon(summary.contact_clicks_change)}
                  <span className={`text-sm ml-1 ${getTrendColor(summary.contact_clicks_change)}`}>
                    {Math.abs(summary.contact_clicks_change)}% vs previous period
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border bg-card/50 backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Booking Requests</p>
                    <p className="text-2xl font-bold">{summary.total_booking_requests.toLocaleString()}</p>
                  </div>
                  <Calendar className="h-8 w-8 text-primary" />
                </div>
                <div className="flex items-center mt-2">
                  {getTrendIcon(summary.booking_requests_change)}
                  <span className={`text-sm ml-1 ${getTrendColor(summary.booking_requests_change)}`}>
                    {Math.abs(summary.booking_requests_change)}% vs previous period
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Charts */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Profile Views Over Time</CardTitle>
                <CardDescription>Daily profile views for the selected period</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="profile_views"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="engagement" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Engagement Metrics</CardTitle>
                <CardDescription>Contact clicks and booking requests</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Bar dataKey="contact_clicks" fill="hsl(var(--coral))" />
                    <Bar dataKey="booking_requests" fill="hsl(var(--primary))" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <Card className="border-border bg-card">
              <CardHeader>
                <CardTitle>Search Performance</CardTitle>
                <CardDescription>Search impressions and profile views correlation</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={metrics}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="date" stroke="hsl(var(--muted-foreground))" />
                    <YAxis stroke="hsl(var(--muted-foreground))" />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px'
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="search_impressions"
                      stroke="hsl(var(--cyan))"
                      strokeWidth={2}
                      name="Search Impressions"
                    />
                    <Line
                      type="monotone"
                      dataKey="profile_views"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      name="Profile Views"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Insights */}
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>AI-powered recommendations to improve your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start space-x-3 p-4 bg-success/10 border border-success/20 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success mt-0.5" />
              <div>
                <h4 className="font-medium text-success">Great Performance!</h4>
                <p className="text-sm text-muted-foreground">
                  Your profile views increased by 23% this week. Keep up the great work!
                </p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3 p-4 bg-cyan/10 border border-cyan/20 rounded-lg">
              <MessageSquare className="h-5 w-5 text-cyan mt-0.5" />
              <div>
                <h4 className="font-medium text-cyan">Engagement Opportunity</h4>
                <p className="text-sm text-muted-foreground">
                  Consider updating your gallery with recent performance videos to increase contact clicks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
