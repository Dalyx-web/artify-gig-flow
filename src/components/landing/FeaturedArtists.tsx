import React from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Music2, Headphones, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import artist1 from '@/assets/artist-1.jpg';
import artist2 from '@/assets/artist-2.jpg';
import artist3 from '@/assets/artist-3.jpg';

const featuredArtists = [
  {
    id: 1,
    name: 'Sofia Martinez',
    artisticName: 'Sofia Vocals',
    category: 'Singer',
    location: 'Miami, FL',
    rating: 4.9,
    reviewCount: 127,
    hourlyRate: 150,
    image: artist1,
    isPremium: true,
    languages: ['English', 'Spanish'],
    icon: Music2,
  },
  {
    id: 2,
    name: 'Marcus Johnson',
    artisticName: 'Electric Marcus',
    category: 'Guitarist',
    location: 'Nashville, TN',
    rating: 4.8,
    reviewCount: 89,
    hourlyRate: 120,
    image: artist2,
    isPremium: true,
    languages: ['English'],
    icon: Music2,
  },
  {
    id: 3,
    name: 'Alex Kim',
    artisticName: 'DJ Alex',
    category: 'DJ',
    location: 'Los Angeles, CA',
    rating: 5.0,
    reviewCount: 203,
    hourlyRate: 200,
    image: artist3,
    isPremium: true,
    languages: ['English', 'Korean'],
    icon: Headphones,
  },
];

export function FeaturedArtists() {
  return (
    <section className="py-20 bg-gradient-to-br from-accent to-accent/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 font-display">
            Featured{' '}
            <span className="text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
              Artists
            </span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Discover talented professionals ready to make your event unforgettable
          </p>
        </div>

        {/* Artists Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredArtists.map((artist) => {
            const IconComponent = artist.icon;
            return (
              <Card key={artist.id} className="hover-lift shadow-card bg-card/80 backdrop-blur border-0">
                <CardContent className="p-0">
                  {/* Artist Image */}
                  <div className="relative">
                    <img
                      src={artist.image}
                      alt={artist.name}
                      className="w-full h-64 object-cover rounded-t-lg"
                    />
                    {artist.isPremium && (
                      <Badge className="absolute top-3 right-3 gradient-purple text-white border-0">
                        Premium
                      </Badge>
                    )}
                  </div>

                  {/* Artist Info */}
                  <div className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="text-xl font-bold">{artist.artisticName}</h3>
                        <p className="text-muted-foreground">{artist.name}</p>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-4 h-4 fill-warning text-warning" />
                        <span className="font-semibold">{artist.rating}</span>
                        <span className="text-muted-foreground text-sm">
                          ({artist.reviewCount})
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 text-muted-foreground">
                      <IconComponent className="w-4 h-4" />
                      <span>{artist.category}</span>
                      <span>•</span>
                      <MapPin className="w-4 h-4" />
                      <span>{artist.location}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          ${artist.hourlyRate}
                        </span>
                        <span className="text-muted-foreground">/hour</span>
                      </div>
                      <div className="flex gap-1">
                        {artist.languages.map((lang) => (
                          <Badge key={lang} variant="outline" className="text-xs">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Link to={`/artist/${artist.id}`} className="flex-1">
                        <Button variant="outline" className="w-full">
                          View Profile
                        </Button>
                      </Link>
                      <Button className="flex-1 gradient-button text-white">
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <Link to="/artists">
            <Button size="lg" className="gradient-button text-white text-lg px-8 hover-lift">
              View All Artists
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}