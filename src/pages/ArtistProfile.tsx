import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Star, MapPin, Clock, Heart, MessageCircle, Globe, Instagram, Twitter, Facebook, Linkedin } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { ContactArtistButton } from '@/components/messages/ContactArtistButton';

interface ArtistProfileData {
  id: string;
  user_id: string;
  artistic_name: string | null;
  bio: string | null;
  location: string | null;
  hourly_rate: number | null;
  experience_years: number | null;
  response_time_hours: number | null;
  verified: boolean | null;
  featured: boolean | null;
  rating: number | null;
  total_reviews: number | null;
  availability_status: string | null;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  } | null;
  artist_skills: Array<{
    skills: {
      name: string;
      category_id: string | null;
    } | null;
    proficiency_level: string | null;
  }>;
  portfolio_items: Array<{
    id: string;
    title: string;
    description: string | null;
    media_url: string;
    media_type: string;
    thumbnail_url: string | null;
    is_featured: boolean | null;
  }>;
  social_links: Array<{
    platform: string;
    url: string;
    display_name: string | null;
  }>;
  pricing_packages: Array<{
    id: string;
    name: string;
    description: string | null;
    price: number;
    duration_hours: number | null;
    includes: string[] | null;
    is_featured: boolean | null;
  }>;
}

const ArtistProfile = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [artist, setArtist] = useState<ArtistProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  useEffect(() => {
    if (id) {
      fetchArtistProfile();
      if (user) {
        checkFavoriteStatus();
      }
    }
  }, [id, user]);

  const fetchArtistProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('artist_profiles')
        .select(`
          *,
          profiles:profiles!inner(full_name, avatar_url),
          artist_skills(
            proficiency_level,
            skills(name, category_id)
          ),
          portfolio_items(
            id, title, description, media_url, media_type, 
            thumbnail_url, is_featured
          ),
          social_links(platform, url, display_name),
          pricing_packages(
            id, name, description, price, duration_hours, 
            includes, is_featured
          )
        `)
        .eq('id', id)
        .maybeSingle();

      if (error) {
        console.error('Error fetching artist profile:', error);
        toast({
          title: "Error",
          description: "Failed to load artist profile",
          variant: "destructive"
        });
        return;
      }

      setArtist(data);
    } catch (error) {
      console.error('Error:', error);
      toast({
        title: "Error",
        description: "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const checkFavoriteStatus = async () => {
    if (!user || !id) return;

    try {
      const { data } = await supabase
        .from('favorites')
        .select('id')
        .eq('user_id', user.id)
        .eq('artist_profile_id', id)
        .maybeSingle();

      setIsFavorited(!!data);
    } catch (error) {
      console.error('Error checking favorite status:', error);
    }
  };

  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to add favorites",
        variant: "destructive"
      });
      return;
    }

    try {
      if (isFavorited) {
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('artist_profile_id', id);
        
        setIsFavorited(false);
        toast({
          title: "Removed from favorites",
          description: "Artist removed from your favorites"
        });
      } else {
        await supabase
          .from('favorites')
          .insert({
            user_id: user.id,
            artist_profile_id: id
          });
        
        setIsFavorited(true);
        toast({
          title: "Added to favorites",
          description: "Artist added to your favorites"
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive"
      });
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case 'instagram': return <Instagram className="w-4 h-4" />;
      case 'twitter': return <Twitter className="w-4 h-4" />;
      case 'facebook': return <Facebook className="w-4 h-4" />;
      case 'linkedin': return <Linkedin className="w-4 h-4" />;
      default: return <Globe className="w-4 h-4" />;
    }
  };

  const getAvailabilityColor = (status: string | null) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'unavailable': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-8">
            <div className="h-64 bg-muted rounded-lg"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="h-32 bg-muted rounded-lg"></div>
                <div className="h-48 bg-muted rounded-lg"></div>
              </div>
              <div className="space-y-6">
                <div className="h-40 bg-muted rounded-lg"></div>
                <div className="h-32 bg-muted rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Artist Not Found</h1>
              <p className="text-muted-foreground">The artist profile you're looking for doesn't exist.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-background via-background/95 to-primary/5 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            <div className="flex-shrink-0">
              <Avatar className="w-32 h-32 ring-4 ring-primary/20">
                <AvatarImage 
                  src={artist.profiles?.avatar_url || ''} 
                  alt={artist.artistic_name || artist.profiles?.full_name || 'Artist'} 
                />
                <AvatarFallback className="text-2xl bg-primary/10">
                  {(artist.artistic_name || artist.profiles?.full_name || 'A').charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                <div>
                  <h1 className="text-4xl font-bold mb-2">
                    {artist.artistic_name || artist.profiles?.full_name}
                  </h1>
                  <div className="flex items-center gap-4 text-muted-foreground mb-3">
                    {artist.location && (
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{artist.location}</span>
                      </div>
                    )}
                    {artist.response_time_hours && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>Responds in {artist.response_time_hours}h</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-3 mb-4">
                    {artist.rating && artist.rating > 0 && (
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        <span className="font-medium">{artist.rating.toFixed(1)}</span>
                        <span className="text-muted-foreground">
                          ({artist.total_reviews} reviews)
                        </span>
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${getAvailabilityColor(artist.availability_status)}`}></div>
                      <span className="text-sm capitalize">{artist.availability_status}</span>
                    </div>
                    
                    {artist.verified && (
                      <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                        Verified
                      </Badge>
                    )}
                    
                    {artist.featured && (
                      <Badge variant="secondary" className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                        Featured
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={toggleFavorite}
                    className={isFavorited ? "text-red-400 border-red-400/50" : ""}
                  >
                    <Heart className={`w-4 h-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? 'Favorited' : 'Favorite'}
                  </Button>
                  <ContactArtistButton 
                    artistUserId={artist.user_id}
                    artistName={artist.artistic_name || artist.profiles?.full_name || undefined}
                    className="size-sm"
                  />
                </div>
              </div>
              
              {artist.bio && (
                <p className="text-muted-foreground leading-relaxed max-w-3xl">
                  {artist.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Portfolio & Skills */}
          <div className="lg:col-span-2 space-y-8">
            {/* Portfolio */}
            {artist.portfolio_items && artist.portfolio_items.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Portfolio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {artist.portfolio_items.map((item) => (
                      <div key={item.id} className="group cursor-pointer">
                        <div className="aspect-video bg-muted rounded-lg overflow-hidden mb-3">
                          <img 
                            src={item.thumbnail_url || item.media_url} 
                            alt={item.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        </div>
                        <h3 className="font-medium mb-1">{item.title}</h3>
                        {item.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        {item.is_featured && (
                          <Badge variant="secondary" className="mt-2">Featured</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills */}
            {artist.artist_skills && artist.artist_skills.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Skills & Expertise</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {artist.artist_skills.map((skillItem, index) => (
                      skillItem.skills && (
                        <Badge 
                          key={index} 
                          variant="outline" 
                          className="bg-primary/5 border-primary/20"
                        >
                          {skillItem.skills.name}
                          {skillItem.proficiency_level && skillItem.proficiency_level !== 'intermediate' && (
                            <span className="ml-1 text-xs opacity-70">
                              ({skillItem.proficiency_level})
                            </span>
                          )}
                        </Badge>
                      )
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Pricing & Info */}
          <div className="space-y-8">
            {/* Pricing Packages */}
            {artist.pricing_packages && artist.pricing_packages.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Pricing Packages</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {artist.pricing_packages.map((pkg) => (
                    <div 
                      key={pkg.id} 
                      className={`p-4 rounded-lg border ${pkg.is_featured ? 'border-primary/50 bg-primary/5' : 'border-border'}`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-medium">{pkg.name}</h3>
                        {pkg.is_featured && (
                          <Badge variant="secondary" className="text-xs">Featured</Badge>
                        )}
                      </div>
                      <div className="text-2xl font-bold text-primary mb-2">
                        ${pkg.price}
                        {pkg.duration_hours && (
                          <span className="text-sm text-muted-foreground font-normal">
                            /{pkg.duration_hours}h
                          </span>
                        )}
                      </div>
                      {pkg.description && (
                        <p className="text-sm text-muted-foreground mb-3">{pkg.description}</p>
                      )}
                      {pkg.includes && pkg.includes.length > 0 && (
                        <ul className="text-sm space-y-1">
                          {pkg.includes.map((item, index) => (
                            <li key={index} className="flex items-center gap-2">
                              <div className="w-1 h-1 bg-primary rounded-full"></div>
                              {item}
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Quick Info */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {artist.hourly_rate && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-medium">${artist.hourly_rate}/hour</span>
                  </div>
                )}
                {artist.experience_years && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Experience</span>
                    <span className="font-medium">{artist.experience_years} years</span>
                  </div>
                )}
                {artist.response_time_hours && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Response Time</span>
                    <span className="font-medium">{artist.response_time_hours} hours</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Social Links */}
            {artist.social_links && artist.social_links.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Connect</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {artist.social_links.map((link, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        asChild
                        className="h-auto p-2"
                      >
                        <a href={link.url} target="_blank" rel="noopener noreferrer">
                          {getSocialIcon(link.platform)}
                        </a>
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;