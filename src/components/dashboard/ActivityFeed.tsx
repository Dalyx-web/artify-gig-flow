import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Calendar, 
  DollarSign, 
  Star, 
  MessageSquare, 
  AlertTriangle,
  Clock
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface Activity {
  id: string;
  type: 'booking' | 'payment' | 'review' | 'message' | 'dispute';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  amount?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  title?: string;
  description?: string;
}

const getActivityIcon = (type: Activity['type']) => {
  switch (type) {
    case 'booking':
      return Calendar;
    case 'payment':
      return DollarSign;
    case 'review':
      return Star;
    case 'message':
      return MessageSquare;
    case 'dispute':
      return AlertTriangle;
    default:
      return Clock;
  }
};

const getActivityColor = (type: Activity['type']) => {
  switch (type) {
    case 'booking':
      return 'text-blue-500';
    case 'payment':
      return 'text-green-500';
    case 'review':
      return 'text-yellow-500';
    case 'message':
      return 'text-purple-500';
    case 'dispute':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

const getStatusBadge = (status?: string) => {
  if (!status) return null;

  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'confirmed': 'default',
    'pending': 'secondary',
    'completed': 'default',
    'cancelled': 'destructive',
    'rejected': 'destructive'
  };

  return (
    <Badge variant={variants[status] || 'outline'} className="text-xs">
      {status}
    </Badge>
  );
};

export function ActivityFeed({ 
  activities, 
  title = "Recent Activity", 
  description = "Latest updates and events" 
}: ActivityFeedProps) {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {activities.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Clock className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No recent activity</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => {
                const Icon = getActivityIcon(activity.type);
                const iconColor = getActivityColor(activity.type);

                return (
                  <div
                    key={activity.id}
                    className="flex gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors animate-fade-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full bg-muted flex items-center justify-center ${iconColor}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <h4 className="font-semibold text-sm truncate">
                          {activity.title}
                        </h4>
                        {getStatusBadge(activity.status)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">
                        {activity.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                        </p>
                        {activity.amount && (
                          <span className="text-sm font-semibold text-primary">
                            {activity.amount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}