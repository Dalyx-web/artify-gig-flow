import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Navbar } from '@/components/layout/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MetricCard } from '@/components/ui/metric-card';
import { Separator } from '@/components/ui/separator';
import {
  Briefcase,
  Send,
  TrendingUp,
  DollarSign,
  Search,
  MapPin,
  Calendar,
  Users,
  Clock,
  Crown
} from 'lucide-react';
import { format } from 'date-fns';

interface JobPosting {
  id: string;
  title: string;
  featured: boolean;
  location: string;
  eventDate: string;
  guestCount: number;
  duration: string;
  description: string;
  genres: string[];
  specialRequirements: string;
  clientName: string;
  clientRating: number;
  clientBookings: number;
  budgetMin: number;
  budgetMax: number;
  applicationsCount: number;
  postedDate: string;
}

const JobBoard = () => {
  const { user, loading } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [budgetFilter, setBudgetFilter] = useState('all');

  // Mock data for job postings
  const jobPostings: JobPosting[] = [
    {
      id: '1',
      title: 'Wedding Reception Musician',
      featured: true,
      location: 'Napa Valley, CA',
      eventDate: '2024-06-14',
      guestCount: 80,
      duration: '4h',
      description: 'Looking for an acoustic guitarist/vocalist for an intimate wedding reception. Must be able to play romantic classics and take requests.',
      genres: ['Acoustic', 'Pop', 'Classical'],
      specialRequirements: 'Must have own sound equipment. Outdoor venue.',
      clientName: 'Sarah Johnson',
      clientRating: 4.9,
      clientBookings: 12,
      budgetMin: 800,
      budgetMax: 1200,
      applicationsCount: 3,
      postedDate: '2024-01-10'
    },
    {
      id: '2',
      title: 'Corporate Event DJ',
      featured: false,
      location: 'San Francisco, CA',
      eventDate: '2024-02-03',
      guestCount: 200,
      duration: '6h',
      description: 'Seeking professional DJ for annual company party. Mix of background music during dinner and dance music later.',
      genres: ['Electronic', 'Pop', 'Hip-hop'],
      specialRequirements: 'Full DJ setup required. Must read the crowd well.',
      clientName: 'TechCorp Events',
      clientRating: 4.7,
      clientBookings: 15,
      budgetMin: 1500,
      budgetMax: 2500,
      applicationsCount: 7,
      postedDate: '2024-01-12'
    },
    {
      id: '3',
      title: 'Jazz Trio for Restaurant Opening',
      featured: true,
      location: 'Los Angeles, CA',
      eventDate: '2024-02-01',
      guestCount: 150,
      duration: '5h',
      description: 'Upscale restaurant opening needs sophisticated jazz trio for grand opening event. Classy, professional atmosphere required.',
      genres: ['Jazz', 'Blues', 'Piano', 'Bass', 'Drums'],
      specialRequirements: 'Must be a complete trio. Formal attire required.',
      clientName: 'Bella Vista Restaurant',
      clientRating: 5.0,
      clientBookings: 3,
      budgetMin: 2000,
      budgetMax: 3000,
      applicationsCount: 5,
      postedDate: '2024-01-13'
    }
  ];

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

  // Check if user is premium (mock check - replace with actual premium check)
  const isPremium = true; // TODO: Replace with actual premium status check

  if (!isPremium) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-16 max-w-4xl">
          <Card className="text-center p-12">
            <div className="relative">
              {/* Blurred background */}
              <div className="filter blur-sm pointer-events-none mb-8">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                  <div className="bg-muted/50 h-24 rounded-lg"></div>
                  <div className="bg-muted/50 h-24 rounded-lg"></div>
                  <div className="bg-muted/50 h-24 rounded-lg"></div>
                  <div className="bg-muted/50 h-24 rounded-lg"></div>
                </div>
              </div>

              {/* Overlay content */}
              <div className="absolute inset-0 flex items-center justify-center -mt-8">
                <div className="bg-background/95 backdrop-blur-sm border rounded-lg p-8 max-w-md">
                  <Crown className="h-16 w-16 text-primary mx-auto mb-4" />
                  <h2 className="text-2xl font-bold mb-2">Premium Feature</h2>
                  <p className="text-muted-foreground mb-6">
                    Access exclusive job opportunities from verified clients with premium membership.
                  </p>
                  <Button className="w-full" size="lg">
                    <Crown className="mr-2 h-4 w-4" />
                    Upgrade to Premium
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Crown className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold">Premium Job Board</h1>
          </div>
          <p className="text-muted-foreground">
            Exclusive opportunities from verified clients
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          <MetricCard
            title="Active Jobs"
            value="3"
            description="Available now"
            icon={Briefcase}
          />
          <MetricCard
            title="Applications Sent"
            value="7"
            description="This month"
            icon={Send}
          />
          <MetricCard
            title="Response Rate"
            value="43%"
            description="Your success rate"
            icon={TrendingUp}
          />
          <MetricCard
            title="Average Earnings"
            value="$1.8K"
            description="Per booking"
            icon={DollarSign}
          />
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search jobs, genres, or requirements..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={locationFilter} onValueChange={setLocationFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="ca">California</SelectItem>
                  <SelectItem value="ny">New York</SelectItem>
                  <SelectItem value="tx">Texas</SelectItem>
                </SelectContent>
              </Select>

              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="wedding">Wedding</SelectItem>
                  <SelectItem value="corporate">Corporate</SelectItem>
                  <SelectItem value="private">Private Party</SelectItem>
                </SelectContent>
              </Select>

              <Select value={budgetFilter} onValueChange={setBudgetFilter}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="All Budgets" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Budgets</SelectItem>
                  <SelectItem value="under1k">Under $1,000</SelectItem>
                  <SelectItem value="1k-2k">$1,000 - $2,000</SelectItem>
                  <SelectItem value="over2k">Over $2,000</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-4">
          {jobPostings.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <CardTitle className="text-xl">{job.title}</CardTitle>
                      {job.featured && (
                        <Badge className="bg-primary">Featured</Badge>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {job.location}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {format(new Date(job.eventDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {job.guestCount} guests
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-4 w-4" />
                        {job.duration}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-primary">
                      ${job.budgetMin.toLocaleString()} - ${job.budgetMax.toLocaleString()}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {job.applicationsCount} applications
                    </p>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="text-sm mb-4">{job.description}</p>

                {/* Genre Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {job.genres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>

                {/* Special Requirements */}
                <div className="p-3 bg-muted/50 rounded-lg mb-4">
                  <p className="text-xs font-medium text-muted-foreground mb-1">
                    Special Requirements:
                  </p>
                  <p className="text-sm">{job.specialRequirements}</p>
                </div>

                <Separator className="my-4" />

                {/* Client Info and Actions */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{job.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      ⭐ {job.clientRating} • {job.clientBookings} bookings
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-xs text-muted-foreground">
                      Apply by {format(new Date(job.postedDate), 'MMM dd')}
                    </p>
                    <Button>
                      <Send className="mr-2 h-4 w-4" />
                      Apply Now
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
};

export default JobBoard;
