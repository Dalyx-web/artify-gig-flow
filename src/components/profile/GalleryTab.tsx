import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Image } from "lucide-react";

export const GalleryTab = () => {
  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Image className="w-6 h-6 text-primary" />
          <div>
            <CardTitle className="text-2xl">Gallery</CardTitle>
            <CardDescription>Photos and videos of your performances</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center py-12 text-muted-foreground">
          <Image className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Gallery management coming soon...</p>
        </div>
      </CardContent>
    </Card>
  );
};
