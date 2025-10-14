import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Music, Mic2, Disc3, Palette, Camera, Video, 
  Theater, Shirt, PenTool, Mic, PenLine, GraduationCap, 
  Check
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useArtistArchetypes, ArtistArchetype } from '@/hooks/use-artist-archetypes';

interface ArchetypeSelectorProps {
  selectedArchetype: ArtistArchetype | null;
  onSelect: (archetype: ArtistArchetype) => void;
  language?: 'en' | 'ar';
}

const ICON_MAP: Record<string, any> = {
  'Music': Music,
  'Mic2': Mic2,
  'Disc3': Disc3,
  'Palette': Palette,
  'Camera': Camera,
  'Video': Video,
  'Theater': Theater,
  'Shirt': Shirt,
  'PenTool': PenTool,
  'Mic': Mic,
  'PenLine': PenLine,
  'GraduationCap': GraduationCap,
};

export function ArchetypeSelector({ selectedArchetype, onSelect, language = 'en' }: ArchetypeSelectorProps) {
  const { archetypes, loading } = useArtistArchetypes();

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-12 w-12 bg-muted rounded-full mb-2" />
              <div className="h-6 bg-muted rounded w-3/4" />
              <div className="h-4 bg-muted rounded w-full mt-2" />
            </CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">
          {language === 'ar' ? 'اختر نوع الفنان الخاص بك' : 'Choose Your Artist Type'}
        </h2>
        <p className="text-muted-foreground">
          {language === 'ar' 
            ? 'حدد الفئة التي تصف خدماتك الفنية بشكل أفضل'
            : 'Select the category that best describes your artistic services'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {archetypes.map((archetype) => {
          const IconComponent = ICON_MAP[archetype.icon || 'Music'];
          const isSelected = selectedArchetype?.id === archetype.id;
          const name = language === 'ar' && archetype.name_ar ? archetype.name_ar : archetype.name;
          const description = language === 'ar' && archetype.description_ar 
            ? archetype.description_ar 
            : archetype.description;

          return (
            <Card
              key={archetype.id}
              className={cn(
                "cursor-pointer transition-all hover:shadow-lg hover-lift",
                isSelected && "ring-2 ring-primary border-primary"
              )}
              onClick={() => onSelect(archetype)}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: `${archetype.color}20` }}
                  >
                    {IconComponent && (
                      <IconComponent
                        className="w-6 h-6"
                        style={{ color: archetype.color }}
                      />
                    )}
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
                <CardTitle className={cn("text-lg", language === 'ar' && 'text-right')}>
                  {name}
                </CardTitle>
                <CardDescription className={cn(language === 'ar' && 'text-right')}>
                  {description}
                </CardDescription>
              </CardHeader>
            </Card>
          );
        })}
      </div>

      {selectedArchetype && (
        <div className="flex justify-center mt-6">
          <Badge variant="outline" className="text-lg px-6 py-2">
            <Check className="w-4 h-4 mr-2" />
            {language === 'ar' ? 'تم الاختيار' : 'Selected'}: {' '}
            {language === 'ar' && selectedArchetype.name_ar 
              ? selectedArchetype.name_ar 
              : selectedArchetype.name}
          </Badge>
        </div>
      )}
    </div>
  );
}