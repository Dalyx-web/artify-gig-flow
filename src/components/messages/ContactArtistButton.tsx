import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ContactArtistButtonProps {
  artistUserId: string;
  artistName?: string;
  className?: string;
  iconOnly?: boolean;
}

export const ContactArtistButton: React.FC<ContactArtistButtonProps> = ({
  artistUserId,
  artistName,
  className = '',
  iconOnly = false
}) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleContact = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.id === artistUserId) {
      toast({
        title: "Error",
        description: "No puedes enviarte mensajes a ti mismo",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Check if conversation already exists
      const { data: existingMessages } = await supabase
        .from('messages')
        .select('id')
        .or(`and(sender_id.eq.${user.id},recipient_id.eq.${artistUserId}),and(sender_id.eq.${artistUserId},recipient_id.eq.${user.id})`)
        .limit(1);

      if (existingMessages && existingMessages.length > 0) {
        // Conversation exists, navigate to messages page
        navigate(`/messages`);
      } else {
        // Create initial message to start conversation
        const initialMessage = `¡Hola${artistName ? ` ${artistName}` : ''}! Me interesa conocer más sobre tus servicios.`;
        
        const { error } = await supabase
          .from('messages')
          .insert({
            content: initialMessage,
            sender_id: user.id,
            recipient_id: artistUserId,
            message_type: 'text'
          });

        if (error) throw error;

        toast({
          title: "Conversación iniciada",
          description: "Se ha enviado tu mensaje inicial"
        });

        navigate('/messages');
      }
    } catch (error) {
      console.error('Error starting conversation:', error);
      toast({
        title: "Error",
        description: "No se pudo iniciar la conversación",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button 
      onClick={handleContact}
      disabled={loading}
      variant={iconOnly ? "outline" : "default"}
      className={`${iconOnly ? 'flex items-center justify-center' : 'flex items-center gap-2'} ${className}`}
    >
      {loading ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <MessageSquare className="w-4 h-4" />
      )}
      {!iconOnly && (loading ? 'Conectando...' : 'Contactar')}
    </Button>
  );
};