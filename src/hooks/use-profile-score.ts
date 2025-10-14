import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

export function useProfileScore(artistProfileId: string | undefined) {
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!artistProfileId) {
      setLoading(false);
      return;
    }

    calculateScore();
  }, [artistProfileId]);

  const calculateScore = async () => {
    if (!artistProfileId) return;

    try {
      const { data, error } = await supabase
        .rpc('calculate_profile_score', { profile_id: artistProfileId });

      if (error) throw error;
      setScore(data || 0);
    } catch (error) {
      console.error('Error calculating profile score:', error);
      setScore(0);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionStatus = () => {
    if (score >= 80) return { status: 'excellent', color: 'text-green-500', message: 'Profile is excellent!' };
    if (score >= 60) return { status: 'good', color: 'text-blue-500', message: 'Profile is good' };
    if (score >= 40) return { status: 'fair', color: 'text-yellow-500', message: 'Profile needs improvement' };
    return { status: 'poor', color: 'text-red-500', message: 'Profile is incomplete' };
  };

  return { score, loading, refetch: calculateScore, getCompletionStatus };
}