import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Youtube, Music, Instagram, Facebook, Globe } from 'lucide-react';

interface SocialLinksFormProps {
  data: {
    youtube_url: string;
    spotify_url: string;
    instagram_url: string;
    facebook_url: string;
    website_url: string;
  };
  onChange: (data: Partial<any>) => void;
}

const socialPlatforms = [
  {
    key: 'youtube_url',
    label: 'YouTube',
    icon: Youtube,
    placeholder: 'https://youtube.com/@tucanal',
    description: 'Comparte videos de tus actuaciones'
  },
  {
    key: 'spotify_url',
    label: 'Spotify',
    icon: Music,
    placeholder: 'https://open.spotify.com/artist/...',
    description: 'Tu música en Spotify'
  },
  {
    key: 'instagram_url',
    label: 'Instagram',
    icon: Instagram,
    placeholder: 'https://instagram.com/tuperfil',
    description: 'Comparte tu día a día artístico'
  },
  {
    key: 'facebook_url',
    label: 'Facebook',
    icon: Facebook,
    placeholder: 'https://facebook.com/tupagina',
    description: 'Tu página de Facebook'
  },
  {
    key: 'website_url',
    label: 'Página Web',
    icon: Globe,
    placeholder: 'https://tuweb.com',
    description: 'Tu sitio web personal'
  }
];

export const SocialLinksForm: React.FC<SocialLinksFormProps> = ({ data, onChange }) => {
  const handleInputChange = (key: string, value: string) => {
    onChange({ [key]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center p-4 bg-accent/50 rounded-lg">
        <h3 className="font-medium mb-2">💡 ¿Por qué conectar tus redes sociales?</h3>
        <p className="text-sm text-muted-foreground">
          Los artistas con enlaces a redes sociales reciben <strong>5x más contrataciones</strong>. 
          Permite que los clientes vean tu trabajo y confíen en tu profesionalidad.
        </p>
      </div>

      <div className="space-y-4">
        {socialPlatforms.map((platform) => {
          const IconComponent = platform.icon;
          return (
            <div key={platform.key} className="space-y-2">
              <Label htmlFor={platform.key} className="flex items-center gap-2">
                <IconComponent className="h-4 w-4" />
                {platform.label}
              </Label>
              <Input
                id={platform.key}
                value={data[platform.key as keyof typeof data]}
                onChange={(e) => handleInputChange(platform.key, e.target.value)}
                placeholder={platform.placeholder}
                type="url"
              />
              <p className="text-sm text-muted-foreground">
                {platform.description}
              </p>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 border border-border rounded-lg bg-card">
        <h4 className="font-medium mb-2 flex items-center gap-2">
          <Youtube className="h-4 w-4 text-red-500" />
          Consejo para YouTube
        </h4>
        <p className="text-sm text-muted-foreground">
          Sube videos de tus actuaciones en vivo, no solo audio. Los clientes quieren ver 
          tu presencia escénica y cómo conectas con la audiencia.
        </p>
      </div>
    </div>
  );
};