
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { OnboardingStep } from '@/components/onboarding/OnboardingStep';
import { BasicInfoForm } from '@/components/onboarding/BasicInfoForm';
import { ArtisticProfileForm } from '@/components/onboarding/ArtisticProfileForm';
import { SocialLinksForm } from '@/components/onboarding/SocialLinksForm';
import { PricingForm } from '@/components/onboarding/PricingForm';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, ArrowRight, Check } from 'lucide-react';

interface FormData {
  // Basic Info
  artistic_name: string;
  bio: string;
  location: string;
  
  // Artistic Profile
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
  
  // Social Links
  youtube_url: string;
  spotify_url: string;
  instagram_url: string;
  facebook_url: string;
  website_url: string;
  
  // Pricing
  hourly_rate: number;
  minimum_fee: number;
  equipment_provided: boolean;
  travel_distance: string;
}

const steps = [
  { id: 1, title: 'Información Básica', description: 'Cuéntanos sobre ti' },
  { id: 2, title: 'Perfil Artístico', description: 'Tu especialidad y experiencia' },
  { id: 3, title: 'Redes Sociales', description: 'Conecta tus perfiles' },
  { id: 4, title: 'Precios', description: 'Define tus tarifas' }
];

const ArtistOnboarding = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState<FormData>({
    artistic_name: '',
    bio: '',
    location: '',
    artist_type: '',
    genres: [],
    experience_years: 0,
    formation: 'solista',
    instruments: [],
    performance_style: '',
    repertoire_size: 50,
    equipment_needs: [],
    special_skills: [],
    youtube_url: '',
    spotify_url: '',
    instagram_url: '',
    facebook_url: '',
    website_url: '',
    hourly_rate: 0,
    minimum_fee: 0,
    equipment_provided: false,
    travel_distance: 'local'
  });

  if (!user) {
    navigate('/login');
    return null;
  }

  const updateFormData = (newData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Preparar datos adicionales específicos del artista
      const additionalData = {
        instruments: formData.instruments || [],
        performance_style: formData.performance_style || '',
        repertoire_size: formData.repertoire_size || 0,
        equipment_needs: formData.equipment_needs || [],
        special_skills: formData.special_skills || []
      };

      // Create artist profile
      const { data: artistProfile, error: profileError } = await supabase
        .from('artist_profiles')
        .insert({
          user_id: user.id,
          artistic_name: formData.artistic_name,
          bio: `${formData.bio}\n\nDatos adicionales: ${JSON.stringify(additionalData)}`,
          location: formData.location,
          experience_years: formData.experience_years,
          hourly_rate: formData.hourly_rate,
          availability_status: 'available'
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // Create social links
      const socialLinks = [
        { platform: 'youtube', url: formData.youtube_url },
        { platform: 'spotify', url: formData.spotify_url },
        { platform: 'instagram', url: formData.instagram_url },
        { platform: 'facebook', url: formData.facebook_url },
        { platform: 'website', url: formData.website_url }
      ].filter(link => link.url.trim() !== '');

      if (socialLinks.length > 0) {
        const { error: socialError } = await supabase
          .from('social_links')
          .insert(
            socialLinks.map(link => ({
              artist_profile_id: artistProfile.id,
              platform: link.platform,
              url: link.url
            }))
          );

        if (socialError) throw socialError;
      }

      // Update user profile to artist type
      const { error: userError } = await supabase
        .from('profiles')
        .update({ user_type: 'artist' })
        .eq('user_id', user.id);

      if (userError) throw userError;

      toast({
        title: "¡Perfil creado exitosamente!",
        description: "Tu perfil de artista ha sido configurado correctamente.",
      });

      navigate('/dashboard');
    } catch (error: any) {
      console.error('Error creating artist profile:', error);
      toast({
        title: "Error al crear perfil",
        description: error.message || "Ha ocurrido un error inesperado",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = (currentStep / steps.length) * 100;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <BasicInfoForm
            data={formData}
            onChange={updateFormData}
          />
        );
      case 2:
        return (
          <ArtisticProfileForm
            data={formData}
            onChange={updateFormData}
          />
        );
      case 3:
        return (
          <SocialLinksForm
            data={formData}
            onChange={updateFormData}
          />
        );
      case 4:
        return (
          <PricingForm
            data={formData}
            onChange={updateFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/20">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent mb-2">
            Crea tu Perfil de Artista
          </h1>
          <p className="text-muted-foreground text-lg">
            Configura tu perfil profesional en pocos pasos
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8">
          <Progress value={progress} className="h-2 mb-4" />
          <div className="flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex flex-col items-center ${
                  step.id <= currentStep ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 mb-2 ${
                  step.id < currentStep 
                    ? 'bg-primary border-primary text-primary-foreground' 
                    : step.id === currentStep
                    ? 'border-primary bg-primary/10'
                    : 'border-muted bg-background'
                }`}>
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-medium">{step.id}</span>
                  )}
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">{step.title}</p>
                  <p className="text-xs">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Content */}
        <Card className="p-8 mb-8">
          <OnboardingStep
            step={currentStep}
            title={steps[currentStep - 1].title}
            description={steps[currentStep - 1].description}
          >
            {renderStepContent()}
          </OnboardingStep>
        </Card>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Anterior
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={nextStep} className="flex items-center gap-2">
              Siguiente
              <ArrowRight className="w-4 h-4" />
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="flex items-center gap-2"
            >
              {isSubmitting ? 'Creando perfil...' : 'Finalizar'}
              <Check className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ArtistOnboarding;
