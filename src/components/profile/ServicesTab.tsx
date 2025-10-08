import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Briefcase } from "lucide-react";

export const ServicesTab = () => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Briefcase className="w-6 h-6 text-primary" />
          <div>
            <CardTitle className="text-2xl">Services</CardTitle>
            <CardDescription>Packages, pricing, and what you offer</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <Briefcase className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Services form coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
