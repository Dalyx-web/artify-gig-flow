import React, { useState, useEffect } from 'react';
import { Filter, MapPin, DollarSign, Clock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';

interface Category {
  id: string;
  name: string;
  color: string;
}

interface Skill {
  id: string;
  name: string;
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

interface ArtistFiltersProps {
  filters: Filters;
  onFiltersChange: (filters: Partial<Filters>) => void;
}

export const ArtistFilters: React.FC<ArtistFiltersProps> = ({
  filters,
  onFiltersChange
}) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCategoriesAndSkills();
  }, []);

  const fetchCategoriesAndSkills = async () => {
    try {
      const [categoriesResponse, skillsResponse] = await Promise.all([
        supabase.from('categories').select('id, name, color').order('name'),
        supabase.from('skills').select('id, name').order('name')
      ]);

      if (categoriesResponse.data) setCategories(categoriesResponse.data);
      if (skillsResponse.data) setSkills(skillsResponse.data);
    } catch (error) {
      console.error('Error fetching filter data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSkillToggle = (skillName: string) => {
    const newSkills = filters.skills.includes(skillName)
      ? filters.skills.filter(s => s !== skillName)
      : [...filters.skills, skillName];
    
    onFiltersChange({ skills: newSkills });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      category: '',
      location: '',
      minRate: 0,
      maxRate: 1000,
      availability: '',
      skills: []
    });
  };

  const activeFiltersCount = 
    (filters.category ? 1 : 0) +
    (filters.location ? 1 : 0) +
    (filters.availability ? 1 : 0) +
    filters.skills.length +
    (filters.minRate > 0 || filters.maxRate < 1000 ? 1 : 0);

  return (
    <Card className="sticky top-4 bg-card/95 backdrop-blur border-0 shadow-elegant">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Filter className="w-5 h-5 text-primary" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
          {activeFiltersCount > 0 && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-1" />
              Clear
            </Button>
          )}
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Category</Label>
          <Select value={filters.category} onValueChange={(value) => onFiltersChange({ category: value })}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.name}>
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: category.color }}
                    />
                    <span>{category.name}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Location Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            Location
          </Label>
          <Input
            type="text"
            placeholder="Enter city or area"
            value={filters.location}
            onChange={(e) => onFiltersChange({ location: e.target.value })}
          />
        </div>

        {/* Price Range Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center">
            <DollarSign className="w-4 h-4 mr-1" />
            Hourly Rate Range
          </Label>
          <div className="px-2">
            <Slider
              value={[filters.minRate, filters.maxRate]}
              onValueChange={([min, max]) => onFiltersChange({ minRate: min, maxRate: max })}
              max={1000}
              min={0}
              step={25}
              className="mb-3"
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>${filters.minRate}</span>
              <span>${filters.maxRate}+</span>
            </div>
          </div>
        </div>

        {/* Availability Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Availability
          </Label>
          <Select value={filters.availability} onValueChange={(value) => onFiltersChange({ availability: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Any availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any availability</SelectItem>
              <SelectItem value="available">Available</SelectItem>
              <SelectItem value="busy">Busy</SelectItem>
              <SelectItem value="unavailable">Unavailable</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Skills Filter */}
        <div className="space-y-3">
          <Label className="text-sm font-medium">Skills</Label>
          <div className="max-h-40 overflow-y-auto space-y-2">
            {skills.slice(0, 15).map((skill) => (
              <div key={skill.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id={`skill-${skill.id}`}
                  checked={filters.skills.includes(skill.name)}
                  onChange={() => handleSkillToggle(skill.name)}
                  className="rounded border-border text-primary focus:ring-primary"
                />
                <label 
                  htmlFor={`skill-${skill.id}`}
                  className="text-sm cursor-pointer"
                >
                  {skill.name}
                </label>
              </div>
            ))}
          </div>
          {filters.skills.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {filters.skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="text-xs">
                  {skill}
                  <button
                    onClick={() => handleSkillToggle(skill)}
                    className="ml-1 hover:text-destructive"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};