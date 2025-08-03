
import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { X } from 'lucide-react';

interface ArtisticProfileFormProps {
  data: {
    artist_type: string;
    genres: string[];
    experience_years: number;
    formation: string;
    // Campos específicos por tipo de artista
    instruments?: string[];
    performance_style?: string;
    repertoire_size?: number;
    equipment_needs?: string[];
    special_skills?: string[];
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

// Géneros específicos por tipo de artista
const genresByType = {
  'Músico/Cantante': ['Pop', 'Rock', 'Jazz', 'Blues', 'Folk', 'Clásica', 'Flamenco', 'Indie', 'Country', 'R&B', 'Salsa', 'Bachata'],
  'DJ': ['House', 'Techno', 'Pop', 'Reggaeton', 'Hip Hop', 'Electrónica', 'Deep House', 'Progressive', 'Trance'],
  'Bailarín': ['Salsa', 'Bachata', 'Flamenco', 'Hip Hop', 'Ballet', 'Contemporáneo', 'Jazz', 'Tango'],
  'Mago': ['Magia de cerca', 'Magia de salón', 'Mentalismo', 'Magia cómica', 'Magia infantil'],
  'Comediante': ['Stand-up', 'Improvisación', 'Monólogos', 'Comedy musical', 'Humor corporativo'],
  'Performer': ['Teatro', 'Mimo', 'Circo', 'Performance art', 'Animación'],
  'Otro': []
};

const formations = [
  { value: 'solista', label: 'Solista' },
  { value: 'duo', label: 'Dúo' },
  { value: 'trio', label: 'Trío' },
  { value: 'banda', label: 'Banda (4+ miembros)' }
];

// Instrumentos comunes
const commonInstruments = [
  'Guitarra', 'Piano', 'Bajo', 'Batería', 'Violín', 'Saxofón', 'Trompeta', 'Flauta', 'Voz'
];

// Estilos de performance
const performanceStyles = {
  'Músico/Cantante': ['Acústico', 'Con banda', 'Karaoke', 'Covers', 'Composiciones propias'],
  'DJ': ['Sesión continua', 'Con micrófono', 'Karaoke DJ', 'DJ + Saxo', 'DJ + Percusión'],
  'Bailarín': ['Solo', 'En pareja', 'Grupo', 'Clases interactivas', 'Espectáculo'],
  'Mago': ['Mesa por mesa', 'Escenario', 'Interactivo', 'Para niños', 'Para adultos'],
  'Comediante': ['Monólogo', 'Interactivo', 'Improvisación', 'Con música', 'Temático'],
  'Performer': ['Teatral', 'Interactivo', 'Callejero', 'Corporativo', 'Infantil']
};

export const ArtisticProfileForm: React.FC<ArtisticProfileFormProps> = ({ data, onChange }) => {
  const [newGenre, setNewGenre] = React.useState('');
  const [newInstrument, setNewInstrument] = React.useState('');

  const currentGenres = genresByType[data.artist_type as keyof typeof genresByType] || [];
  const currentStyles = performanceStyles[data.artist_type as keyof typeof performanceStyles] || [];

  const addGenre = (genre: string) => {
    if (genre && !data.genres.includes(genre) && data.genres.length < 3) {
      onChange({ genres: [...data.genres, genre] });
    }
  };

  const removeGenre = (genreToRemove: string) => {
    onChange({ genres: data.genres.filter(genre => genre !== genreToRemove) });
  };

  const addInstrument = (instrument: string) => {
    const currentInstruments = data.instruments || [];
    if (instrument && !currentInstruments.includes(instrument)) {
      onChange({ instruments: [...currentInstruments, instrument] });
    }
  };

  const removeInstrument = (instrumentToRemove: string) => {
    const currentInstruments = data.instruments || [];
    onChange({ instruments: currentInstruments.filter(inst => inst !== instrumentToRemove) });
  };

  const renderArtistSpecificFields = () => {
    switch (data.artist_type) {
      case 'Músico/Cantante':
        return (
          <>
            <div className="space-y-2">
              <Label>Instrumentos que tocas</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {(data.instruments || []).map((instrument) => (
                  <Badge key={instrument} variant="secondary" className="flex items-center gap-1">
                    {instrument}
                    <X 
                      className="h-3 w-3 cursor-pointer hover:text-destructive" 
                      onClick={() => removeInstrument(instrument)}
                    />
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-3 gap-2">
                {commonInstruments.map((instrument) => (
                  <button
                    key={instrument}
                    type="button"
                    onClick={() => addInstrument(instrument)}
                    disabled={(data.instruments || []).includes(instrument)}
                    className="text-left p-2 text-sm border border-border rounded hover:bg-accent disabled:opacity-50"
                  >
                    {instrument}
                  </button>
                ))}
              </div>
              
              <div className="flex gap-2">
                <Input
                  value={newInstrument}
                  onChange={(e) => setNewInstrument(e.target.value)}
                  placeholder="Otro instrumento..."
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => {
                    addInstrument(newInstrument);
                    setNewInstrument('');
                  }}
                  disabled={!newInstrument}
                  className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
                >
                  +
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Tamaño aproximado de tu repertorio</Label>
              <Slider
                value={[data.repertoire_size || 50]}
                onValueChange={(value) => onChange({ repertoire_size: value[0] })}
                max={500}
                min={10}
                step={10}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10 canciones</span>
                <span className="font-medium">{data.repertoire_size || 50} canciones</span>
                <span>500+</span>
              </div>
            </div>
          </>
        );

      case 'DJ':
        return (
          <>
            <div className="space-y-2">
              <Label>Equipamiento que proporcionas</Label>
              <div className="space-y-2">
                {['Mesa de mezclas', 'Altavoces', 'Micrófono', 'Luces', 'Humo/efectos'].map((equipment) => (
                  <div key={equipment} className="flex items-center space-x-2">
                    <Checkbox
                      id={equipment}
                      checked={(data.equipment_needs || []).includes(equipment)}
                      onCheckedChange={(checked) => {
                        const current = data.equipment_needs || [];
                        if (checked) {
                          onChange({ equipment_needs: [...current, equipment] });
                        } else {
                          onChange({ equipment_needs: current.filter(item => item !== equipment) });
                        }
                      }}
                    />
                    <Label htmlFor={equipment} className="text-sm">{equipment}</Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'Bailarín':
        return (
          <>
            <div className="space-y-2">
              <Label>¿Ofreces clases durante el evento?</Label>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="offers_lessons"
                  checked={(data.special_skills || []).includes('Clases interactivas')}
                  onCheckedChange={(checked) => {
                    const current = data.special_skills || [];
                    if (checked) {
                      onChange({ special_skills: [...current, 'Clases interactivas'] });
                    } else {
                      onChange({ special_skills: current.filter(skill => skill !== 'Clases interactivas') });
                    }
                  }}
                />
                <Label htmlFor="offers_lessons" className="text-sm">Sí, enseño pasos básicos a los invitados</Label>
              </div>
            </div>
          </>
        );

      case 'Mago':
        return (
          <>
            <div className="space-y-2">
              <Label>Especialidades adicionales</Label>
              <div className="space-y-2">
                {['Globoflexia', 'Magia con niños', 'Mentalismo', 'Humor', 'Participación del público'].map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox
                      id={skill}
                      checked={(data.special_skills || []).includes(skill)}
                      onCheckedChange={(checked) => {
                        const current = data.special_skills || [];
                        if (checked) {
                          onChange({ special_skills: [...current, skill] });
                        } else {
                          onChange({ special_skills: current.filter(s => s !== skill) });
                        }
                      }}
                    />
                    <Label htmlFor={skill} className="text-sm">{skill}</Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      case 'Comediante':
        return (
          <>
            <div className="space-y-2">
              <Label>Duración típica del espectáculo (minutos)</Label>
              <Slider
                value={[data.repertoire_size || 30]}
                onValueChange={(value) => onChange({ repertoire_size: value[0] })}
                max={120}
                min={10}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>10 min</span>
                <span className="font-medium">{data.repertoire_size || 30} minutos</span>
                <span>2 horas</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Contenido</Label>
              <div className="space-y-2">
                {['Para todos los públicos', 'Humor adulto', 'Interactivo', 'Personalizable'].map((content) => (
                  <div key={content} className="flex items-center space-x-2">
                    <Checkbox
                      id={content}
                      checked={(data.special_skills || []).includes(content)}
                      onCheckedChange={(checked) => {
                        const current = data.special_skills || [];
                        if (checked) {
                          onChange({ special_skills: [...current, content] });
                        } else {
                          onChange({ special_skills: current.filter(s => s !== content) });
                        }
                      }}
                    />
                    <Label htmlFor={content} className="text-sm">{content}</Label>
                  </div>
                ))}
              </div>
            </div>
          </>
        );

      default:
        return null;
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

      {data.artist_type && currentGenres.length > 0 && (
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
            {currentGenres.slice(0, 8).map((genre) => (
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
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  addGenre(newGenre);
                  setNewGenre('');
                }
              }}
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
      )}

      {data.artist_type && currentStyles.length > 0 && (
        <div className="space-y-2">
          <Label>Estilo de performance</Label>
          <Select value={data.performance_style} onValueChange={(value) => onChange({ performance_style: value })}>
            <SelectTrigger>
              <SelectValue placeholder="¿Cómo es tu actuación?" />
            </SelectTrigger>
            <SelectContent>
              {currentStyles.map((style) => (
                <SelectItem key={style} value={style}>
                  {style}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {/* Campos específicos según el tipo de artista */}
      {data.artist_type && renderArtistSpecificFields()}

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
