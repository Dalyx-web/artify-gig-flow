import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Music } from "lucide-react";

export const MusicalDetailsTab = () => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Music className="w-6 h-6 text-primary" />
          <div>
            <CardTitle className="text-2xl">Musical Details</CardTitle>
            <CardDescription>Your musical skills, genres, and expertise</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Musical details form coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
