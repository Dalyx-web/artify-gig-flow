import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ArtistArchetype {
  id: string;
  name: string;
  name_ar: string | null;
  description: string | null;
  description_ar: string | null;
  icon: string | null;
  color: string;
  display_order: number;
}

export function useArtistArchetypes() {
  const [archetypes, setArchetypes] = useState<ArtistArchetype[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchArchetypes();
  }, []);

  const fetchArchetypes = async () => {
    try {
      const { data, error } = await supabase
        .from('artist_archetypes')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error) throw error;
      setArchetypes(data || []);
    } catch (error) {
      console.error('Error fetching archetypes:', error);
      toast({
        title: "Error",
        description: "Failed to load artist types",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return { archetypes, loading, refetch: fetchArchetypes };
}