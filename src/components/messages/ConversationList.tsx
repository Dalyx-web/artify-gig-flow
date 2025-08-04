import React from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

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

interface ConversationListProps {
  conversations: Conversation[];
  selectedConversation: string | null;
  onSelectConversation: (id: string) => void;
  loading: boolean;
}

export const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  selectedConversation,
  onSelectConversation,
  loading
}) => {
  if (loading) {
    return (
      <div className="flex-1 p-4 space-y-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3">
            <Skeleton className="w-10 h-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center text-muted-foreground">
          <p className="text-sm">No conversations yet</p>
          <p className="text-xs mt-1">Start messaging with artists or clients</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto">
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => onSelectConversation(conversation.id)}
          className={`
            p-4 border-b border-border cursor-pointer hover:bg-muted/50 transition-colors
            ${selectedConversation === conversation.id ? 'bg-muted' : ''}
          `}
        >
          <div className="flex items-start space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={conversation.other_user.avatar_url || undefined} />
              <AvatarFallback>
                {conversation.other_user.full_name.split(' ').map(n => n[0]).join('').toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-medium text-sm truncate">
                  {conversation.other_user.full_name}
                </h3>
                <div className="flex items-center space-x-2">
                  {conversation.unread_count > 0 && (
                    <Badge variant="secondary" className="px-2 py-1 text-xs">
                      {conversation.unread_count}
                    </Badge>
                  )}
                  {conversation.last_message && (
                    <span className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(conversation.last_message.created_at), {
                        addSuffix: true,
                        locale: es
                      })}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <p className="text-xs text-muted-foreground truncate flex-1">
                  {conversation.last_message ? conversation.last_message.content : 'No messages yet'}
                </p>
                <Badge variant="outline" className="ml-2 text-xs">
                  {conversation.other_user.user_type === 'artist' ? 'Artista' : 'Cliente'}
                </Badge>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};