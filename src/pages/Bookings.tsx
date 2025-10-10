import { useState } from 'react';
import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  DollarSign,
  MessageSquare,
  CheckCircle,
  AlertCircle,
  XCircle,
  Users,
  Plus,
  Filter
} from 'lucide-react';
import { format } from 'date-fns';

export type BookingType = 'single' | 'recurring' | 'contract';

export interface Booking {
  id: string;
  type: BookingType;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'disputed';
  eventName: string;
  eventType: string;
  artist: {
    id: string;
    name: string;
    genre: string;
    avatar: string;
    rating: number;
  };
  client?: {
    id: string;
    name: string;
    avatar: string;
  };
  date: string;
  startTime: string;
  endTime?: string;
  location: string;
  amount: number;
  guestCount?: number;
  description?: string;
  specialRequests?: string;
  createdAt: string;
  updatedAt: string;
}

interface BookingCardProps {
  booking: Booking;
  userRole: 'artist' | 'client';
  onStatusChange?: (bookingId: string, newStatus: Booking['status']) => void;
  onMessage?: (bookingId: string) => void;
}

const BookingCard = ({ booking, userRole, onStatusChange, onMessage }: BookingCardProps) => {
  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return 'bg-success/20 text-success border-success/30';
      case 'pending': return 'bg-warning/20 text-warning border-warning/30';
      case 'completed': return 'bg-cyan/20 text-cyan border-cyan/30';
      case 'cancelled': return 'bg-muted text-muted-foreground border-border';
      case 'disputed': return 'bg-destructive/20 text-destructive border-destructive/30';
      default: return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="h-4 w-4" />;
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      case 'disputed': return <AlertCircle className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <Card className="border-border bg-card hover:shadow-lg transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={userRole === 'artist' ? booking.client?.avatar : booking.artist.avatar} />
              <AvatarFallback>
                {(userRole === 'artist' ? booking.client?.name : booking.artist.name)?.split(' ').map(n => n[0]).join('') || 'U'}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg flex items-center space-x-2">
                <span>{booking.eventName}</span>
              </CardTitle>
              <CardDescription>
                {userRole === 'artist' ? 'Client' : 'Artist'}: {userRole === 'artist' ? booking.client?.name : booking.artist.name}
              </CardDescription>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className={getStatusColor(booking.status)}>
              <div className="flex items-center space-x-1">
                {getStatusIcon(booking.status)}
                <span className="capitalize">{booking.status}</span>
              </div>
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid gap-3 md:grid-cols-2">
          <div className="flex items-center space-x-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-primary" />
            <span>{format(new Date(booking.date), "PPP")}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Clock className="h-4 w-4 text-cyan" />
            <span>{booking.startTime} {booking.endTime && `- ${booking.endTime}`}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <MapPin className="h-4 w-4 text-coral" />
            <span className="truncate">{booking.location}</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <DollarSign className="h-4 w-4 text-primary" />
            <span className="font-semibold">${booking.amount.toLocaleString()}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <Badge variant="secondary">{booking.eventType}</Badge>
          {booking.guestCount && (
            <span className="text-sm text-muted-foreground flex items-center gap-1">
              <Users className="h-4 w-4" />
              ~{booking.guestCount} guests
            </span>
          )}
        </div>

        {booking.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">
            {booking.description}
          </p>
        )}

        {booking.specialRequests && (
          <div className="p-3 bg-muted/50 rounded-lg">
            <p className="text-xs font-medium text-muted-foreground mb-1">Special Requests:</p>
            <p className="text-sm line-clamp-2">{booking.specialRequests}</p>
          </div>
        )}

        <div className="flex space-x-2 pt-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex-1"
            onClick={() => onMessage?.(booking.id)}
          >
            <MessageSquare className="mr-2 h-4 w-4" />
            Message
          </Button>
          
          {userRole === 'artist' && booking.status === 'pending' && (
            <Button 
              size="sm" 
              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={() => onStatusChange?.(booking.id, 'confirmed')}
            >
              <CheckCircle className="mr-2 h-4 w-4" />
              Accept
            </Button>
          )}
          
          {booking.status === 'confirmed' && (
            <Button variant="outline" size="sm" className="flex-1">
              View Details
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function Bookings() {
  const { user, loading: authLoading } = useAuth();
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  // Mock bookings data
  const mockBookings: Booking[] = [
    {
      id: '1',
      type: 'single',
      status: 'confirmed',
      eventName: 'Wedding Reception',
      eventType: 'Wedding',
      artist: {
        id: '1',
        name: 'Jazz Quartet',
        genre: 'Jazz',
        avatar: '',
        rating: 4.8
      },
      client: {
        id: '1',
        name: 'Sarah Johnson',
        avatar: ''
      },
      date: '2025-02-15',
      startTime: '18:00',
      endTime: '22:00',
      location: 'Grand Hotel Ballroom, New York',
      amount: 2500,
      guestCount: 150,
      description: 'Looking for elegant jazz music for our wedding reception',
      createdAt: '2025-01-10',
      updatedAt: '2025-01-10'
    },
    {
      id: '2',
      type: 'single',
      status: 'pending',
      eventName: 'Corporate Gala',
      eventType: 'Corporate',
      artist: {
        id: '2',
        name: 'Classical Orchestra',
        genre: 'Classical',
        avatar: '',
        rating: 4.9
      },
      client: {
        id: '2',
        name: 'Tech Corporation',
        avatar: ''
      },
      date: '2025-03-20',
      startTime: '19:00',
      endTime: '23:00',
      location: 'Convention Center, San Francisco',
      amount: 4500,
      guestCount: 300,
      description: 'Annual company gala event',
      specialRequests: 'Need sound system and lighting setup',
      createdAt: '2025-01-15',
      updatedAt: '2025-01-15'
    },
    {
      id: '3',
      type: 'recurring',
      status: 'confirmed',
      eventName: 'Weekly Jazz Nights',
      eventType: 'Bar/Lounge',
      artist: {
        id: '3',
        name: 'Solo Pianist',
        genre: 'Jazz',
        avatar: '',
        rating: 4.7
      },
      client: {
        id: '3',
        name: 'The Blue Note',
        avatar: ''
      },
      date: '2025-02-01',
      startTime: '20:00',
      endTime: '23:00',
      location: 'The Blue Note, Chicago',
      amount: 800,
      guestCount: 80,
      description: 'Every Friday night performance',
      createdAt: '2025-01-05',
      updatedAt: '2025-01-05'
    }
  ];

  const userRole: 'artist' | 'client' = user?.role === 'artist' ? 'artist' : 'client';

  const filteredBookings = mockBookings.filter(booking => {
    if (statusFilter !== 'all' && booking.status !== statusFilter) return false;
    if (typeFilter !== 'all' && booking.type !== typeFilter) return false;
    return true;
  });

  const handleStatusChange = (bookingId: string, newStatus: Booking['status']) => {
    console.log(`Changing booking ${bookingId} to ${newStatus}`);
    // TODO: Implement status change logic
  };

  const handleMessage = (bookingId: string) => {
    console.log(`Opening message for booking ${bookingId}`);
    // TODO: Implement message logic
  };

  if (authLoading) {
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
    <div className="min-h-screen bg-background p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold flex items-center">
              <CalendarIcon className="mr-2 h-6 w-6 text-primary" />
              Bookings Management
            </h2>
            <p className="text-muted-foreground">Manage your bookings and event requests</p>
          </div>
          <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" />
            New Booking
          </Button>
        </div>

        {/* Filters */}
        <Card className="border-border bg-card/50 backdrop-blur-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Filters:</span>
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="single">Single Event</SelectItem>
                  <SelectItem value="recurring">Recurring</SelectItem>
                  <SelectItem value="contract">Contract</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Bookings Tabs */}
        <Tabs defaultValue="all" className="space-y-4">
          <TabsList className="bg-muted">
            <TabsTrigger value="all">
              All Bookings
              <Badge variant="secondary" className="ml-2">{filteredBookings.length}</Badge>
            </TabsTrigger>
            <TabsTrigger value="upcoming">
              Upcoming
              <Badge variant="secondary" className="ml-2">
                {filteredBookings.filter(b => b.status === 'confirmed').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="pending">
              Pending
              <Badge variant="secondary" className="ml-2">
                {filteredBookings.filter(b => b.status === 'pending').length}
              </Badge>
            </TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {filteredBookings.map((booking) => (
                <BookingCard
                  key={booking.id}
                  booking={booking}
                  userRole={userRole}
                  onStatusChange={handleStatusChange}
                  onMessage={handleMessage}
                />
              ))}
            </div>
            {filteredBookings.length === 0 && (
              <Card className="border-border bg-card">
                <CardContent className="flex flex-col items-center justify-center py-12">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">No bookings found</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {filteredBookings
                .filter(b => b.status === 'confirmed')
                .map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    userRole={userRole}
                    onStatusChange={handleStatusChange}
                    onMessage={handleMessage}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="pending" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {filteredBookings
                .filter(b => b.status === 'pending')
                .map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    userRole={userRole}
                    onStatusChange={handleStatusChange}
                    onMessage={handleMessage}
                  />
                ))}
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
              {filteredBookings
                .filter(b => b.status === 'completed' || b.status === 'cancelled')
                .map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    userRole={userRole}
                    onStatusChange={handleStatusChange}
                    onMessage={handleMessage}
                  />
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
