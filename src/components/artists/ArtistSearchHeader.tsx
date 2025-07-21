import React from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ArtistSearchHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalResults: number;
  sortBy: string;
  onSortChange: (sortBy: string) => void;
}

export const ArtistSearchHeader: React.FC<ArtistSearchHeaderProps> = ({
  searchQuery,
  onSearchChange,
  totalResults,
  sortBy,
  onSortChange
}) => {
  return (
    <div className="mb-8 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-display font-bold mb-2 gradient-hero bg-clip-text text-transparent">
            Discover Artists
          </h1>
          <p className="text-muted-foreground text-lg">
            {totalResults} talented artists ready to bring your vision to life
          </p>
        </div>
        
        <div className="flex items-center space-x-2 text-sm text-muted-foreground">
          <SlidersHorizontal className="w-4 h-4" />
          <span>Filter & Sort</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            type="text"
            placeholder="Search artists, skills, or locations..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 h-12 text-base"
          />
        </div>

        {/* Sort Dropdown */}
        <Select value={sortBy} onValueChange={onSortChange}>
          <SelectTrigger className="w-full md:w-48 h-12">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rating">Top Rated</SelectItem>
            <SelectItem value="featured">Featured First</SelectItem>
            <SelectItem value="reviews">Most Reviews</SelectItem>
            <SelectItem value="price_low">Price: Low to High</SelectItem>
            <SelectItem value="price_high">Price: High to Low</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};