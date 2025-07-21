import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Star, MapPin, Clock, Badge, MessageCircle, Verified } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Artist {
  id: string;
  user_id: string;
  artistic_name: string | null;
  bio: string | null;
  hourly_rate: number | null;
  location: string | null;
  availability_status: string;
  response_time_hours: number;
  verified: boolean;
  featured: boolean;
  rating: number;
  total_reviews: number;
  profiles: {
    id: string;
    full_name: string;
    avatar_url: string | null;
  };
  artist_skills: {
    skills: {
      name: string;
      categories: {
        name: string;
        color: string;
      };
    };
  }[];
  portfolio_items: {
    media_url: string;
    thumbnail_url: string | null;
    media_type: string;
  }[];
}

interface ArtistCardProps {
  artist: Artist;
}

export const ArtistCard: React.FC<ArtistCardProps> = ({ artist }) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const displayName = artist.artistic_name || artist.profiles.full_name;
  const primarySkills = artist.artist_skills.slice(0, 3);
  const featuredPortfolio = artist.portfolio_items.filter(item => item.media_type === 'image').slice(0, 3);

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-success';
      case 'busy': return 'text-warning';
      case 'unavailable': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getAvailabilityText = (status: string) => {
    switch (status) {
      case 'available': return 'Available';
      case 'busy': return 'Busy';
      case 'unavailable': return 'Unavailable';
      default: return status;
    }
  };

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to save favorites",
        variant: "destructive"
      });
      return;
    }

    setIsToggling(true);

    try {
      if (isFavorited) {
        const { error } = await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('artist_profile_id', artist.id);

        if (error) throw error;
        
        setIsFavorited(false);
        toast({
          title: "Removed from favorites",
          description: `${displayName} has been removed from your favorites`
        });
      } else {
        const { error } = await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            artist_profile_id: artist.id
          });

        if (error) throw error;
        
        setIsFavorited(true);
        toast({
          title: "Added to favorites",
          description: `${displayName} has been added to your favorites`
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsToggling(false);
    }
  };

  return (
    <Card className="group hover-lift overflow-hidden border-0 shadow-card bg-card/95 backdrop-blur animate-fade-in">
      <div className="relative">
        {/* Featured Badge */}
        {artist.featured && (
          <div className="absolute top-3 left-3 z-10">
            <div className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-xs font-medium flex items-center">
              <Badge className="w-3 h-3 mr-1" />
              Featured
            </div>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteToggle}
          disabled={isToggling}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border border-border hover:bg-background transition-colors"
        >
          <Heart 
            className={`w-4 h-4 transition-colors ${
              isFavorited 
                ? 'fill-red-500 text-red-500' 
                : 'text-muted-foreground hover:text-red-500'
            }`} 
          />
        </button>

        {/* Portfolio Preview */}
        <div className="aspect-[4/3] bg-muted overflow-hidden">
          {featuredPortfolio.length > 0 ? (
            <div className="grid grid-cols-3 h-full gap-0.5">
              {featuredPortfolio.map((item, index) => (
                <div key={index} className="relative overflow-hidden">
                  <img
                    src={item.thumbnail_url || item.media_url}
                    alt=""
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full h-full bg-gradient-hero flex items-center justify-center">
              <div className="text-white text-center">
                <div className="text-2xl font-bold mb-1">
                  {displayName.charAt(0)}
                </div>
                <div className="text-xs opacity-75">No portfolio</div>
              </div>
            </div>
          )}
        </div>
      </div>

      <CardContent className="p-4">
        {/* Artist Info */}
        <div className="flex items-start space-x-3 mb-3">
          <Avatar className="w-12 h-12 border-2 border-background shadow-sm">
            <AvatarImage src={artist.profiles.avatar_url || ''} />
            <AvatarFallback className="bg-primary text-primary-foreground font-semibold">
              {displayName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-1 mb-1">
              <h3 className="font-semibold text-lg truncate">{displayName}</h3>
              {artist.verified && (
                <Verified className="w-4 h-4 text-primary flex-shrink-0" />
              )}
            </div>
            
            {/* Rating */}
            <div className="flex items-center space-x-1 mb-2">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{artist.rating.toFixed(1)}</span>
              <span className="text-xs text-muted-foreground">
                ({artist.total_reviews} review{artist.total_reviews !== 1 ? 's' : ''})
              </span>
            </div>

            {/* Bio */}
            {artist.bio && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {artist.bio}
              </p>
            )}
          </div>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1 mb-3">
          {primarySkills.map((skill, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full border"
              style={{ 
                borderColor: skill.skills.categories.color + '40',
                backgroundColor: skill.skills.categories.color + '10',
                color: skill.skills.categories.color 
              }}
            >
              {skill.skills.name}
            </span>
          ))}
          {artist.artist_skills.length > 3 && (
            <span className="px-2 py-1 text-xs rounded-full bg-muted text-muted-foreground">
              +{artist.artist_skills.length - 3} more
            </span>
          )}
        </div>

        {/* Details */}
        <div className="space-y-2 mb-4">
          {artist.location && (
            <div className="flex items-center text-sm text-muted-foreground">
              <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{artist.location}</span>
            </div>
          )}

          <div className="flex items-center justify-between text-sm">
            <div className={`flex items-center ${getAvailabilityColor(artist.availability_status)}`}>
              <Clock className="w-4 h-4 mr-1" />
              {getAvailabilityText(artist.availability_status)}
            </div>

            {artist.hourly_rate && (
              <div className="font-semibold text-primary">
                ${artist.hourly_rate}/hr
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground">
            Responds in ~{artist.response_time_hours}h
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Link to={`/artist/${artist.id}`} className="flex-1">
            <Button variant="outline" className="w-full">
              View Profile
            </Button>
          </Link>
          
          <Button size="icon" variant="outline">
            <MessageCircle className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};