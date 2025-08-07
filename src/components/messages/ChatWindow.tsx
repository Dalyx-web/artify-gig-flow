import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Send, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import type { AppUser } from '@/contexts/AuthContext';

interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  created_at: string;
  read_at: string | null;
}

interface ChatWindowProps {
  conversationId: string;
  currentUser: AppUser;
  onUpdateConversations: () => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversationId,
  currentUser,
  onUpdateConversations
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
    fetchOtherUserProfile();
    markMessagesAsRead();

    // Set up real-time subscription for this conversation
    const channel = supabase
      .channel(`conversation-${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `or(and(sender_id.eq.${currentUser.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${currentUser.id}))`
        },
        (payload) => {
          setMessages(prev => [...prev, payload.new as Message]);
          onUpdateConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, currentUser.id]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .or(`and(sender_id.eq.${currentUser.id},recipient_id.eq.${conversationId}),and(sender_id.eq.${conversationId},recipient_id.eq.${currentUser.id})`)
        .order('created_at', { ascending: true });

      if (error) throw error;

      setMessages(data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los mensajes",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchOtherUserProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', conversationId)
        .single();

      if (error) throw error;

      setOtherUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const markMessagesAsRead = async () => {
    try {
      await supabase
        .from('messages')
        .update({ read_at: new Date().toISOString() })
        .eq('recipient_id', currentUser.id)
        .eq('sender_id', conversationId)
        .is('read_at', null);
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || sending) return;

    setSending(true);

    try {
      // 1. Llamar al sistema de moderación ANTES de enviar
      console.log('Moderating message before sending...');
      const { data: moderationResult, error: moderationError } = await supabase.functions.invoke(
        'moderate-message', 
        {
          body: { 
            content: newMessage.trim(), 
            userId: currentUser.id,
            conversationId: conversationId
          }
        }
      );

      if (moderationError) {
        console.error('Moderation error:', moderationError);
        throw new Error('Error en el sistema de moderación');
      }

      console.log('Moderation result:', moderationResult);

      // 2. Si el mensaje está bloqueado, mostrar advertencia específica
      if (moderationResult?.isBlocked) {
        const warningMessage = getWarningMessage(moderationResult.infractions[0]?.type, moderationResult.severity);
        
        toast({
          title: "Mensaje bloqueado",
          description: warningMessage,
          variant: "destructive",
          duration: 8000, // Mostrar más tiempo para que lean la advertencia
        });
        
        setNewMessage('');
        setSending(false);
        return;
      }

      // 3. Si pasa la moderación, enviar el mensaje normalmente
      const { error } = await supabase
        .from('messages')
        .insert({
          content: newMessage.trim(),
          sender_id: currentUser.id,
          recipient_id: conversationId,
          message_type: 'text'
        });

      if (error) throw error;

      setNewMessage('');
      onUpdateConversations();
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar el mensaje",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const getWarningMessage = (type: string, severity: string) => {
    const warnings = {
      email: {
        warning: "Tu mensaje contiene una dirección de email. Para tu seguridad, mantén toda la comunicación en la plataforma.",
        severe: "Se detectó información de contacto por email. Esto está prohibido para proteger a todos los usuarios.",
        critical: "Violación grave: Intento de compartir información de contacto. Revisa nuestras políticas."
      },
      phone: {
        warning: "Detectamos un posible número de teléfono. Evita compartir información de contacto personal.",
        severe: "Se bloqueó un número de teléfono. Para tu seguridad, no compartas datos personales.",
        critical: "Violación grave: Intento de compartir número telefónico. Tu cuenta puede ser suspendida."
      },
      social: {
        warning: "Tu mensaje menciona redes sociales. Mantén todas las negociaciones en nuestra plataforma.",
        severe: "Se detectó intento de redirección a redes sociales. Usa solo nuestros canales oficiales.",
        critical: "Violación grave: Intento de llevar la conversación fuera de la plataforma."
      },
      payment: {
        warning: "Se mencionó un método de pago externo. Usa nuestro sistema de pagos seguro.",
        severe: "Intento de pago fuera de la plataforma detectado. Esto está estrictamente prohibido.",
        critical: "Violación crítica: Intento de evasión del sistema de pagos. Riesgo de suspensión inmediata."
      },
      external_link: {
        warning: "Tu mensaje contiene un enlace externo. Solo se permiten enlaces a portfolios aprobados.",
        severe: "Enlace externo bloqueado. Usa solo enlaces de la lista de sitios permitidos.",
        critical: "Violación grave: Enlace no autorizado detectado."
      },
      suspension: "Tu cuenta está temporalmente suspendida debido a infracciones previas. Revisa nuestras políticas de uso."
    };

    const typeWarnings = warnings[type as keyof typeof warnings];
    if (!typeWarnings) return "Tu mensaje fue bloqueado por políticas de seguridad.";
    
    if (typeof typeWarnings === 'object') {
      return (typeWarnings as any)[severity] || (typeWarnings as any).warning || "Tu mensaje fue bloqueado por políticas de seguridad.";
    }
    
    return typeWarnings;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border h-full flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border h-full flex flex-col">
      {/* Header */}
      {otherUser && (
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={otherUser.avatar_url || undefined} />
              <AvatarFallback>
                {otherUser.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">{otherUser.full_name}</h3>
              <div className="flex items-center space-x-2">
                <Badge variant="outline" className="text-xs">
                  {otherUser.user_type === 'artist' ? 'Artista' : 'Cliente'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <p>No hay mensajes aún</p>
            <p className="text-sm mt-1">Envía el primer mensaje para iniciar la conversación</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isOwn = message.sender_id === currentUser.id;
            const showDate = index === 0 || 
              new Date(message.created_at).toDateString() !== 
              new Date(messages[index - 1].created_at).toDateString();

            return (
              <div key={message.id}>
                {showDate && (
                  <div className="flex items-center justify-center my-4">
                    <Separator className="flex-1" />
                    <span className="px-3 text-xs text-muted-foreground bg-background">
                      {new Date(message.created_at).toLocaleDateString('es-ES', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                    <Separator className="flex-1" />
                  </div>
                )}
                
                <div className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`
                      max-w-[70%] rounded-lg px-3 py-2 
                      ${isOwn 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-muted text-muted-foreground'
                      }
                    `}
                  >
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                    <p className={`text-xs mt-1 ${isOwn ? 'text-primary-foreground/70' : 'text-muted-foreground/70'}`}>
                      {formatDistanceToNow(new Date(message.created_at), {
                        addSuffix: true,
                        locale: es
                      })}
                      {isOwn && message.read_at && (
                        <span className="ml-2">• Leído</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Escribe tu mensaje..."
            className="flex-1 min-h-[40px] max-h-[120px] resize-none"
            disabled={sending}
          />
          <Button
            onClick={sendMessage}
            disabled={!newMessage.trim() || sending}
            size="sm"
            className="px-3"
          >
            {sending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};