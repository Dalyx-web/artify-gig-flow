import React, { useState, useEffect } from 'react';
import { Navbar } from '@/components/layout/Navbar';
import { ArtistFilters } from '@/components/artists/ArtistFilters';
import { ArtistCard } from '@/components/artists/ArtistCard';
import { ArtistSearchHeader } from '@/components/artists/ArtistSearchHeader';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

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

interface Filters {
  category: string;
  location: string;
  minRate: number;
  maxRate: number;
  availability: string;
  skills: string[];
  sortBy: string;
}

const Artists = () => {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Filters>({
    category: '',
    location: '',
    minRate: 0,
    maxRate: 1000,
    availability: '',
    skills: [],
    sortBy: 'rating'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const { toast } = useToast();

  const ARTISTS_PER_PAGE = 12;

  useEffect(() => {
    fetchArtists();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [artists, searchQuery, filters]);

  const fetchArtists = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('artist_profiles')
        .select(`
          *,
          profiles!inner (
            id,
            full_name,
            avatar_url
          ),
          artist_skills (
            skills (
              name,
              categories (
                name,
                color
              )
            )
          ),
          portfolio_items (
            media_url,
            thumbnail_url,
            media_type
          )
        `)
        .order('featured', { ascending: false })
        .order('rating', { ascending: false });

      if (error) throw error;

      setArtists(data || []);
    } catch (error) {
      console.error('Error fetching artists:', error);
      toast({
        variant: "destructive",
        title: "Error loading artists",
        description: "Please try again later."
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...artists];

    // Apply search query
    if (searchQuery) {
      filtered = filtered.filter(artist => 
        artist.profiles.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.artistic_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.bio?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.location?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        artist.artist_skills.some(skill => 
          skill.skills.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }

    // Apply category filter
    if (filters.category) {
      filtered = filtered.filter(artist =>
        artist.artist_skills.some(skill =>
          skill.skills.categories.name === filters.category
        )
      );
    }

    // Apply location filter
    if (filters.location) {
      filtered = filtered.filter(artist =>
        artist.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Apply rate filter
    filtered = filtered.filter(artist =>
      !artist.hourly_rate || 
      (artist.hourly_rate >= filters.minRate && artist.hourly_rate <= filters.maxRate)
    );

    // Apply availability filter
    if (filters.availability) {
      filtered = filtered.filter(artist =>
        artist.availability_status === filters.availability
      );
    }

    // Apply skills filter
    if (filters.skills.length > 0) {
      filtered = filtered.filter(artist =>
        filters.skills.some(skillName =>
          artist.artist_skills.some(skill =>
            skill.skills.name === skillName
          )
        )
      );
    }

    // Apply sorting
    switch (filters.sortBy) {
      case 'rating':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'price_low':
        filtered.sort((a, b) => (a.hourly_rate || 0) - (b.hourly_rate || 0));
        break;
      case 'price_high':
        filtered.sort((a, b) => (b.hourly_rate || 0) - (a.hourly_rate || 0));
        break;
      case 'reviews':
        filtered.sort((a, b) => b.total_reviews - a.total_reviews);
        break;
      case 'featured':
        filtered.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
        break;
      default:
        break;
    }

    setFilteredArtists(filtered);
    setTotalResults(filtered.length);
    setCurrentPage(1);
  };

  const handleFiltersChange = (newFilters: Partial<Filters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const getCurrentPageArtists = () => {
    const startIndex = (currentPage - 1) * ARTISTS_PER_PAGE;
    const endIndex = startIndex + ARTISTS_PER_PAGE;
    return filteredArtists.slice(startIndex, endIndex);
  };

  const totalPages = Math.ceil(filteredArtists.length / ARTISTS_PER_PAGE);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ArtistSearchHeader 
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          totalResults={totalResults}
          sortBy={filters.sortBy}
          onSortChange={(sortBy) => handleFiltersChange({ sortBy })}
        />

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <ArtistFilters 
              filters={filters}
              onFiltersChange={handleFiltersChange}
            />
          </div>

          {/* Artists Grid */}
          <div className="flex-1">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-2 text-muted-foreground">Loading artists...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                  {getCurrentPageArtists().map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>
                    
                    <div className="flex space-x-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => setCurrentPage(page)}
                            className={`px-3 py-2 text-sm font-medium rounded-md ${
                              currentPage === page
                                ? 'bg-primary text-primary-foreground'
                                : 'text-muted-foreground bg-background border border-border hover:bg-accent'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 text-sm font-medium text-muted-foreground bg-background border border-border rounded-md hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}

                {filteredArtists.length === 0 && !loading && (
                  <div className="text-center py-12">
                    {artists.length === 0 ? (
                      <div className="animate-fade-in">
                        <div className="mb-8">
                          <div className="w-24 h-24 mx-auto bg-gradient-hero rounded-full flex items-center justify-center shadow-glow mb-4">
                            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                          </div>
                          <h3 className="text-2xl font-bold mb-2">Be the First Artist!</h3>
                          <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                            ArtUne is ready for talented artists like you. Create your profile and start connecting with clients who need your unique skills.
                          </p>
                          <div className="space-y-3">
                            <p className="text-sm text-muted-foreground">✨ Showcase your portfolio</p>
                            <p className="text-sm text-muted-foreground">🎯 Connect with ideal clients</p>
                            <p className="text-sm text-muted-foreground">💰 Set your own rates</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-xl text-muted-foreground mb-2">No artists found</p>
                        <p className="text-muted-foreground">Try adjusting your filters or search criteria</p>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Artists;