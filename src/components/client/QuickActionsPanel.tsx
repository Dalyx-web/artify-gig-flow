import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Calendar, Heart, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function QuickActionsPanel() {
  const navigate = useNavigate();

  const actions = [
    {
      icon: Search,
      label: 'Find Artists',
      description: 'Browse our marketplace',
      gradient: 'gradient-button',
      action: () => navigate('/artists')
    },
    {
      icon: Calendar,
      label: 'Schedule Event',
      description: 'Plan your next booking',
      gradient: 'gradient-purple',
      action: () => navigate('/bookings')
    },
    {
      icon: Heart,
      label: 'View Favorites',
      description: 'Your saved artists',
      gradient: 'gradient-card',
      action: () => navigate('/favorites')
    },
    {
      icon: History,
      label: 'Event History',
      description: 'Past bookings & reviews',
      gradient: 'gradient-hero',
      action: () => navigate('/bookings?filter=completed')
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {actions.map((action, index) => (
        <Card
          key={action.label}
          className="group cursor-pointer hover-lift border-border/50 overflow-hidden animate-scale-in"
          style={{ animationDelay: `${index * 0.1}s` }}
          onClick={action.action}
        >
          <CardContent className="p-6">
            <div className={`w-12 h-12 rounded-xl ${action.gradient} flex items-center justify-center mb-4 shadow-card group-hover:shadow-glow transition-all`}>
              <action.icon className="w-6 h-6 text-white" />
            </div>
            <h3 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
              {action.label}
            </h3>
            <p className="text-sm text-muted-foreground">
              {action.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
