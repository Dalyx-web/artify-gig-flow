import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Camera, MapPin, Phone, Globe, User } from "lucide-react";

export const BasicInfoTab = () => {
  const [formData, setFormData] = useState({
    stageName: "Alex Rivera",
    location: "Los Angeles, CA",
    phone: "(555) 123-4567",
    website: "https://alexrivera.music",
    bio: "Professional acoustic guitarist and vocalist with 8 years of experience. Specializing in wedding ceremonies, corporate events, and intimate gatherings.",
    avatarUrl: ""
  });

  return (
    <Card className="bg-card/50 backdrop-blur-sm border-border">
      <CardHeader>
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-primary" />
          <div>
            <CardTitle className="text-2xl">Basic Information</CardTitle>
            <CardDescription>Your public profile information</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Avatar Upload */}
        <div className="flex items-center gap-6">
          <Avatar className="w-24 h-24 border-4 border-primary/20">
            <AvatarImage src={formData.avatarUrl} />
            <AvatarFallback className="bg-gradient-primary text-white text-2xl">
              {formData.stageName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-2">
            <Button variant="outline" className="gap-2">
              <Camera className="w-4 h-4" />
              Change Photo
            </Button>
            <p className="text-sm text-muted-foreground">JPG, PNG up to 5MB</p>
          </div>
        </div>

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Stage Name */}
          <div className="space-y-2">
            <Label htmlFor="stageName" className="flex items-center gap-2">
              <User className="w-4 h-4 text-muted-foreground" />
              Stage Name
            </Label>
            <Input
              id="stageName"
              value={formData.stageName}
              onChange={(e) => setFormData({ ...formData, stageName: e.target.value })}
              className="bg-background border-border"
            />
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Location
            </Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="bg-background border-border"
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Label htmlFor="phone" className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              Phone
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="bg-background border-border"
            />
          </div>

          {/* Website */}
          <div className="space-y-2">
            <Label htmlFor="website" className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-muted-foreground" />
              Website
            </Label>
            <Input
              id="website"
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="bg-background border-border"
            />
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            className="bg-background border-border min-h-[120px]"
            placeholder="Tell clients about your experience, specialties, and what makes you unique..."
          />
          <p className="text-sm text-muted-foreground">
            {formData.bio.length} characters
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
