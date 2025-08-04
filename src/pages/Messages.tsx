import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Navbar } from '@/components/layout/Navbar';
import { ConversationList } from '@/components/messages/ConversationList';
import { ChatWindow } from '@/components/messages/ChatWindow';
import { MessageSquare } from 'lucide-react';

interface Conversation {
  id: string;
  other_user: {
    id: string;
    full_name: string;
    avatar_url: string | null;
    user_type: string;
  };
  last_message: {
    content: string;
    created_at: string;
    sender_id: string;
  } | null;
  unread_count: number;
}

const Messages = () => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    
    fetchConversations();
    
    // Set up real-time subscription for new messages
    const channel = supabase
      .channel('messages-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages',
          filter: `or(sender_id.eq.${user.id},recipient_id.eq.${user.id})`
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  const fetchConversations = async () => {
    if (!user) return;

    try {
      // Get all unique conversation partners
      const { data: messages, error } = await supabase
        .from('messages')
        .select(`
          id,
          sender_id,
          recipient_id,
          content,
          created_at,
          read_at
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Group messages by conversation partner
      const conversationMap = new Map<string, any>();
      
      for (const message of messages || []) {
        const partnerId = message.sender_id === user.id ? message.recipient_id : message.sender_id;
        
        if (!conversationMap.has(partnerId)) {
          conversationMap.set(partnerId, {
            partnerId,
            messages: [],
            lastMessage: message,
            unreadCount: 0
          });
        }
        
        const conversation = conversationMap.get(partnerId);
        conversation.messages.push(message);
        
        // Count unread messages
        if (message.recipient_id === user.id && !message.read_at) {
          conversation.unreadCount++;
        }
      }

      // Fetch profile data for conversation partners
      const partnerIds = Array.from(conversationMap.keys());
      if (partnerIds.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const { data: profiles, error: profileError } = await supabase
        .from('profiles')
        .select('user_id, full_name, avatar_url, user_type')
        .in('user_id', partnerIds);

      if (profileError) throw profileError;

      // Build final conversations array
      const conversationsData: Conversation[] = [];
      
      for (const [partnerId, convData] of conversationMap) {
        const profile = profiles?.find(p => p.user_id === partnerId);
        if (profile) {
          conversationsData.push({
            id: partnerId,
            other_user: {
              id: partnerId,
              full_name: profile.full_name || 'Unknown User',
              avatar_url: profile.avatar_url,
              user_type: profile.user_type
            },
            last_message: convData.lastMessage ? {
              content: convData.lastMessage.content,
              created_at: convData.lastMessage.created_at,
              sender_id: convData.lastMessage.sender_id
            } : null,
            unread_count: convData.unreadCount
          });
        }
      }

      // Sort by last message time
      conversationsData.sort((a, b) => {
        if (!a.last_message) return 1;
        if (!b.last_message) return -1;
        return new Date(b.last_message.created_at).getTime() - new Date(a.last_message.created_at).getTime();
      });

      setConversations(conversationsData);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
            <p className="text-muted-foreground">Please log in to access your messages.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-6 h-[calc(100vh-200px)]">
          {/* Conversations Sidebar */}
          <div className="w-1/3 min-w-[300px]">
            <div className="bg-card rounded-lg border h-full flex flex-col">
              <div className="p-4 border-b">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <MessageSquare className="w-5 h-5" />
                  Messages
                </h2>
              </div>
              <ConversationList
                conversations={conversations}
                selectedConversation={selectedConversation}
                onSelectConversation={setSelectedConversation}
                loading={loading}
              />
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1">
            {selectedConversation ? (
              <ChatWindow
                conversationId={selectedConversation}
                currentUser={user}
                onUpdateConversations={fetchConversations}
              />
            ) : (
              <div className="bg-card rounded-lg border h-full flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">No conversation selected</p>
                  <p>Choose a conversation from the sidebar to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;