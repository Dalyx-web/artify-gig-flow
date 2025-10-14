import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { useToast } from '@/hooks/use-toast';

interface RealtimeSubscriptionOptions<T> {
  table: string;
  event?: 'INSERT' | 'UPDATE' | 'DELETE' | '*';
  filter?: string;
  onInsert?: (payload: T) => void;
  onUpdate?: (payload: T) => void;
  onDelete?: (payload: { old: T }) => void;
  enabled?: boolean;
}

export function useRealtimeSubscription<T = any>({
  table,
  event = '*',
  filter,
  onInsert,
  onUpdate,
  onDelete,
  enabled = true
}: RealtimeSubscriptionOptions<T>) {
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (!enabled) return;

    const channelName = `realtime:${table}:${Date.now()}`;
    const realtimeChannel = supabase.channel(channelName);

    // Subscribe to changes
    const subscription = realtimeChannel
      .on(
        'postgres_changes' as any,
        {
          event: event,
          schema: 'public',
          table: table,
          filter: filter
        } as any,
        (payload) => {
          console.log(`[Realtime] ${table} ${payload.eventType}:`, payload);

          // Handle different event types
          switch (payload.eventType) {
            case 'INSERT':
              if (onInsert) {
                onInsert(payload.new as T);
                toast({
                  title: "Real-time Update",
                  description: `New ${table} record created`,
                  duration: 2000
                });
              }
              break;
            case 'UPDATE':
              if (onUpdate) {
                onUpdate(payload.new as T);
                toast({
                  title: "Real-time Update",
                  description: `${table} record updated`,
                  duration: 2000
                });
              }
              break;
            case 'DELETE':
              if (onDelete) {
                onDelete({ old: payload.old as T });
                toast({
                  title: "Real-time Update",
                  description: `${table} record deleted`,
                  duration: 2000
                });
              }
              break;
          }
        }
      )
      .subscribe((status) => {
        console.log(`[Realtime] Subscription status for ${table}:`, status);
      });

    setChannel(realtimeChannel);

    return () => {
      console.log(`[Realtime] Unsubscribing from ${table}`);
      supabase.removeChannel(realtimeChannel);
    };
  }, [table, event, filter, enabled]);

  return channel;
}