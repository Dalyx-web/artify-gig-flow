import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

interface ArtisticProfileFormProps {
  data: {
    artist_type: string;
    genres: string[];
    experience_years: number;
    formation: string;
  };
  onChange: (data: Partial<any>) => void;
}

const artistTypes = [
  'Músico/Cantante',
  'DJ',
  'Mago',
  'Comediante',
  'Bailarín',
  'Performer',
  'Otro'
];

const musicGenres = [
  'Pop', 'Rock', 'Jazz', 'Blues', 'Folk', 'Clásica', 'Electrónica', 'Reggaeton',
  'Salsa', 'Bachata', 'Flamenco', 'Indie', 'Country', 'R&B', 'Hip Hop', 'Reggae'
];

const formations = [
  { value: 'solista', label: 'Solista' },
  { value: 'duo', label: 'Dúo' },
  { value: 'trio', label: 'Trío' },
  { value: 'banda', label: 'Banda (4+ miembros)' }
];

export const ArtisticProfileForm: React.FC<ArtisticProfileFormProps> = ({ data, onChange }) => {
  const [newGenre, setNewGenre] = React.useState('');

  const addGenre = (genre: string) => {
    if (genre && !data.genres.includes(genre) && data.genres.length < 3) {
      onChange({ genres: [...data.genres, genre] });
    }
  };

  const removeGenre = (genreToRemove: string) => {
    onChange({ genres: data.genres.filter(genre => genre !== genreToRemove) });
  };

  const handleGenreInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addGenre(newGenre);
      setNewGenre('');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="artist_type">Tipo de Artista *</Label>
          <Select value={data.artist_type} onValueChange={(value) => onChange({ artist_type: value })}>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tu especialidad" />
            </SelectTrigger>
            <SelectContent>
              {artistTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="formation">Formación</Label>
          <Select value={data.formation} onValueChange={(value) => onChange({ formation: value })}>
            <SelectTrigger>
              <SelectValue placeholder="¿Cómo actúas?" />
            </SelectTrigger>
            <SelectContent>
              {formations.map((formation) => (
                <SelectItem key={formation.value} value={formation.value}>
                  {formation.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Géneros/Estilos (máximo 3)</Label>
        <div className="flex flex-wrap gap-2 mb-2">
          {data.genres.map((genre) => (
            <Badge key={genre} variant="secondary" className="flex items-center gap-1">
              {genre}
              <X 
                className="h-3 w-3 cursor-pointer hover:text-destructive" 
                onClick={() => removeGenre(genre)}
              />
            </Badge>
          ))}
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {musicGenres.slice(0, 8).map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => addGenre(genre)}
              disabled={data.genres.includes(genre) || data.genres.length >= 3}
              className="text-left p-2 text-sm border border-border rounded hover:bg-accent disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {genre}
            </button>
          ))}
        </div>
        
        <div className="flex gap-2">
          <Input
            value={newGenre}
            onChange={(e) => setNewGenre(e.target.value)}
            onKeyDown={handleGenreInputKeyPress}
            placeholder="Agregar otro género..."
            className="flex-1"
            disabled={data.genres.length >= 3}
          />
          <button
            type="button"
            onClick={() => {
              addGenre(newGenre);
              setNewGenre('');
            }}
            disabled={!newGenre || data.genres.length >= 3}
            className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label>Años de experiencia: {data.experience_years}</Label>
        <Slider
          value={[data.experience_years]}
          onValueChange={(value) => onChange({ experience_years: value[0] })}
          max={50}
          min={0}
          step={1}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Principiante</span>
          <span>Experto (50+ años)</span>
        </div>
      </div>
    </div>
  );
};