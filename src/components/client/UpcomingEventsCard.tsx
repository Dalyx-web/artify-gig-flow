import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, MessageSquare, User, DollarSign } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Event {
  id: string;
  name: string;
  artistName: string;
  date: string;
  venue: string;
  status: 'confirmed' | 'pending' | 'completed';
  paymentAmount: number;
  artistImage?: string;
}

interface UpcomingEventsCardProps {
  events: Event[];
}

const getStatusVariant = (status: string): 'default' | 'secondary' | 'outline' => {
  switch (status) {
    case 'confirmed':
      return 'default';
    case 'pending':
      return 'secondary';
    case 'completed':
      return 'outline';
    default:
      return 'outline';
  }
};

const getStatusColor = (status: string): string => {
  switch (status) {
    case 'confirmed':
      return 'text-primary';
    case 'pending':
      return 'text-warning';
    case 'completed':
      return 'text-success';
    default:
      return 'text-muted-foreground';
  }
};

export function UpcomingEventsCard({ events }: UpcomingEventsCardProps) {
  if (events.length === 0) {
    return (
      <Card className="shadow-card border-border/50">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-display">Upcoming Events</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground mb-4">No upcoming events yet</p>
            <Button variant="outline" className="hover:border-primary hover:text-primary">
              Book Your First Artist
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-card hover-lift border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            <CardTitle className="text-xl font-display">Upcoming Events</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary">
            {events.length} Event{events.length !== 1 ? 's' : ''}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {events.map((event, index) => (
          <Card 
            key={event.id} 
            className="group hover-lift border-border/50 overflow-hidden animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Artist Avatar */}
                <div className="flex-shrink-0">
                  <div className="w-16 h-16 rounded-xl bg-gradient-purple flex items-center justify-center overflow-hidden shadow-card">
                    {event.artistImage ? (
                      <img 
                        src={event.artistImage} 
                        alt={event.artistName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-white" />
                    )}
                  </div>
                </div>

                {/* Event Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div>
                      <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                        {event.name}
                      </h4>
                      <p className="text-sm text-muted-foreground flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {event.artistName}
                      </p>
                    </div>
                    <Badge 
                      variant={getStatusVariant(event.status)}
                      className={`${getStatusColor(event.status)} capitalize`}
                    >
                      {event.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-muted-foreground mb-3">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDistanceToNow(new Date(event.date), { addSuffix: true })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span>{event.venue}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold text-primary">
                        AED {event.paymentAmount.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex-1 hover:border-primary hover:text-primary"
                    >
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Chat
                    </Button>
                    <Button 
                      size="sm" 
                      className="flex-1 gradient-button text-white"
                    >
                      View Details
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button 
          variant="ghost" 
          className="w-full hover:text-primary hover:bg-primary/10"
        >
          View All Events
        </Button>
      </CardContent>
    </Card>
  );
}
