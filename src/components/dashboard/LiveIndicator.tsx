import { Badge } from '@/components/ui/badge';
import { Zap } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface LiveIndicatorProps {
  lastUpdate: Date;
  isLive?: boolean;
}

export function LiveIndicator({ lastUpdate, isLive = true }: LiveIndicatorProps) {
  return (
    <Badge 
      variant="outline" 
      className="gap-2 px-3 py-1 animate-fade-in"
    >
      <div className="relative flex items-center">
        <div className={`w-2 h-2 rounded-full ${isLive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
        {isLive && (
          <div className="absolute w-2 h-2 rounded-full bg-green-500 animate-ping" />
        )}
      </div>
      <Zap className="w-3 h-3" />
      <span className="text-xs">
        {isLive ? 'Live' : 'Offline'}
        {' • '}
        Updated {formatDistanceToNow(lastUpdate, { addSuffix: true })}
      </span>
    </Badge>
  );
}