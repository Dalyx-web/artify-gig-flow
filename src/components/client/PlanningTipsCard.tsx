import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lightbulb, CheckCircle2 } from 'lucide-react';

const PLANNING_TIPS = [
  'Book artists 4–6 weeks in advance for popular dates',
  'Review portfolios and watch performance videos before booking',
  'Communicate your event theme and expectations clearly',
  'Confirm technical requirements with your venue',
  'Consider travel time and setup needs in your schedule',
  'Read reviews from previous clients for insights'
];

export function PlanningTipsCard() {
  return (
    <Card className="shadow-card hover-lift border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-warning/10 flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-warning" />
          </div>
          <CardTitle className="text-xl font-display">Planning Tips</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {PLANNING_TIPS.map((tip, index) => (
            <div 
              key={index}
              className="flex gap-3 items-start p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <p className="text-sm text-foreground leading-relaxed">
                {tip}
              </p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
