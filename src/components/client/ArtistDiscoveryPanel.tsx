import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, Heart, MapPin, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const FILTER_TAGS = [
  'Wedding', 'Corporate', 'DJ', 'Live Band', 'Classical', 
  'Jazz', 'Pop', 'Rock', 'Electronic', 'Traditional'
];

interface Artist {
  id: string;
  name: string;
  genre: string;
  rating: number;
  location: string;
  hourlyRate: number;
  imageUrl: string;
  tags: string[];
  isFavorite: boolean;
}

export function ArtistDiscoveryPanel() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  // Mock featured artists - in real app, this comes from useDashboardData or API
  const featuredArtists: Artist[] = [
    {
      id: '1',
      name: 'Sarah Al Mansouri',
      genre: 'Jazz & Soul',
      rating: 4.9,
      location: 'Dubai, UAE',
      hourlyRate: 1200,
      imageUrl: '/placeholder.svg',
      tags: ['Jazz', 'Wedding', 'Corporate'],
      isFavorite: false
    },
    {
      id: '2',
      name: 'Ahmed Hassan Band',
      genre: 'Live Band',
      rating: 4.8,
      location: 'Abu Dhabi, UAE',
      hourlyRate: 2500,
      imageUrl: '/placeholder.svg',
      tags: ['Rock', 'Pop', 'Corporate'],
      isFavorite: true
    },
    {
      id: '3',
      name: 'DJ Khalifa',
      genre: 'Electronic',
      rating: 4.7,
      location: 'Dubai, UAE',
      hourlyRate: 1800,
      imageUrl: '/placeholder.svg',
      tags: ['DJ', 'Electronic', 'Wedding'],
      isFavorite: false
    }
  ];

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  return (
    <Card className="shadow-card hover-lift border-border/50">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Search className="w-5 h-5 text-primary" />
          <CardTitle className="text-xl font-display">Find Your Perfect Artist</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search by artist, genre, or event type..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border focus:border-primary"
          />
        </div>

        {/* Filter Tags */}
        <div className="flex flex-wrap gap-2">
          {FILTER_TAGS.map((tag) => (
            <Badge
              key={tag}
              variant={selectedTags.includes(tag) ? 'default' : 'outline'}
              className={`cursor-pointer transition-all hover:scale-105 ${
                selectedTags.includes(tag) 
                  ? 'bg-primary text-primary-foreground shadow-elegant' 
                  : 'hover:border-primary'
              }`}
              onClick={() => toggleTag(tag)}
            >
              {tag}
            </Badge>
          ))}
        </div>

        {/* Featured Artists Grid */}
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wide">
            Featured Artists
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {featuredArtists.map((artist, index) => (
              <Card 
                key={artist.id}
                className="group cursor-pointer hover-lift overflow-hidden border-border/50 animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => navigate(`/artists/${artist.id}`)}
              >
                <div className="aspect-square relative overflow-hidden bg-muted">
                  <img 
                    src={artist.imageUrl} 
                    alt={artist.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <Button
                    size="icon"
                    variant="ghost"
                    className={`absolute top-2 right-2 rounded-full ${
                      artist.isFavorite 
                        ? 'bg-primary/90 text-primary-foreground hover:bg-primary' 
                        : 'bg-background/80 backdrop-blur-sm hover:bg-background'
                    }`}
                    onClick={(e) => {
                      e.stopPropagation();
                      // Toggle favorite logic here
                    }}
                  >
                    <Heart className={`w-4 h-4 ${artist.isFavorite ? 'fill-current' : ''}`} />
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h4 className="font-semibold text-base mb-1 group-hover:text-primary transition-colors">
                    {artist.name}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-2">{artist.genre}</p>
                  
                  <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-primary text-primary" />
                      <span className="font-medium">{artist.rating}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{artist.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-3">
                    {artist.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-border">
                    <span className="text-sm font-semibold text-primary">
                      AED {artist.hourlyRate.toLocaleString()}/hr
                    </span>
                    <Button size="sm" variant="ghost" className="text-xs hover:text-primary">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Button 
          className="w-full gradient-button text-white font-semibold"
          onClick={() => navigate('/artists')}
        >
          Explore All Artists
        </Button>
      </CardContent>
    </Card>
  );
}
