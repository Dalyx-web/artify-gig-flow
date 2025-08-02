import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

interface BasicInfoFormProps {
  data: {
    artistic_name: string;
    bio: string;
    location: string;
  };
  onChange: (data: Partial<any>) => void;
}

export const BasicInfoForm: React.FC<BasicInfoFormProps> = ({ data, onChange }) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="artistic_name">Nombre Artístico *</Label>
          <Input
            id="artistic_name"
            value={data.artistic_name}
            onChange={(e) => onChange({ artistic_name: e.target.value })}
            placeholder="Ej: María Acoustic, Los Rockeros, DJ Luna"
            required
          />
          <p className="text-sm text-muted-foreground">
            El nombre con el que te conocen profesionalmente
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Ubicación *</Label>
          <Input
            id="location"
            value={data.location}
            onChange={(e) => onChange({ location: e.target.value })}
            placeholder="Ej: Madrid, España"
            required
          />
          <p className="text-sm text-muted-foreground">
            Ciudad y país donde te ubicas
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="bio">Descripción de tu propuesta *</Label>
        <Textarea
          id="bio"
          value={data.bio}
          onChange={(e) => onChange({ bio: e.target.value })}
          placeholder="Describe tu estilo musical, experiencia y lo que te hace único. Ej: Música acústica con covers de pop y rock, ideal para bodas y eventos íntimos..."
          className="min-h-[120px]"
          maxLength={500}
          required
        />
        <p className="text-sm text-muted-foreground">
          {data.bio.length}/500 caracteres. Cuenta a los clientes qué pueden esperar de tu actuación.
        </p>
      </div>
    </div>
  );
};