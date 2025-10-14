import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useProfileScore } from '@/hooks/use-profile-score';
import { cn } from '@/lib/utils';

interface ProfileScoreIndicatorProps {
  artistProfileId: string | undefined;
  className?: string;
}

export function ProfileScoreIndicator({ artistProfileId, className }: ProfileScoreIndicatorProps) {
  const { score, loading, getCompletionStatus } = useProfileScore(artistProfileId);
  const status = getCompletionStatus();

  if (loading) {
    return (
      <Card className={className}>
        <CardHeader>
          <div className="h-6 w-32 bg-muted rounded animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="h-2 bg-muted rounded animate-pulse" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("hover-lift", className)}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Profile Strength
          </CardTitle>
          <Badge 
            variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}
            className="text-sm"
          >
            {score}%
          </Badge>
        </div>
        <CardDescription className={status.color}>
          {status.message}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <Progress value={score} className="h-2" />
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            {score >= 80 ? (
              <CheckCircle2 className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-amber-500" />
            )}
            <span>
              {score >= 80 
                ? 'Your profile is complete and optimized!'
                : score >= 60
                ? 'Add more details to improve visibility'
                : 'Complete your profile to start receiving bookings'}
            </span>
          </div>
          
          {score < 100 && (
            <div className="mt-3 p-3 bg-muted rounded-lg">
              <p className="text-xs font-semibold mb-2">Next steps to improve:</p>
              <ul className="text-xs space-y-1">
                {score < 30 && <li>• Add your bio and location</li>}
                {score < 50 && <li>• Upload portfolio items</li>}
                {score < 65 && <li>• Create pricing packages</li>}
                {score < 75 && <li>• Add your skills and tags</li>}
                {score < 85 && <li>• Set your availability schedule</li>}
                {score < 95 && <li>• Connect social media accounts</li>}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}