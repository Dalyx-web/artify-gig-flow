import { createClient } from '@supabase/supabase-js';

// These would normally come from environment variables
// For now using placeholder values - replace with actual Supabase credentials
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types for TypeScript
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          role: 'artist' | 'client' | 'admin';
          full_name?: string;
          artistic_name?: string;
          bio?: string;
          city?: string;
          country?: string;
          languages?: string[];
          category?: string;
          hourly_rate?: number;
          set_rate?: number;
          event_rate?: number;
          is_premium?: boolean;
          subscription_tier?: string;
          subscription_end?: string;
          quick_quote_enabled?: boolean;
          booking_types?: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          role: 'artist' | 'client' | 'admin';
          full_name?: string;
          artistic_name?: string;
          bio?: string;
          city?: string;
          country?: string;
          languages?: string[];
          category?: string;
          hourly_rate?: number;
          set_rate?: number;
          event_rate?: number;
          is_premium?: boolean;
          subscription_tier?: string;
          subscription_end?: string;
          quick_quote_enabled?: boolean;
          booking_types?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'artist' | 'client' | 'admin';
          full_name?: string;
          artistic_name?: string;
          bio?: string;
          city?: string;
          country?: string;
          languages?: string[];
          category?: string;
          hourly_rate?: number;
          set_rate?: number;
          event_rate?: number;
          is_premium?: boolean;
          subscription_tier?: string;
          subscription_end?: string;
          quick_quote_enabled?: boolean;
          booking_types?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      bookings: {
        Row: {
          id: string;
          client_id: string;
          artist_id: string;
          booking_type: 'unique' | 'recurring' | 'fixed';
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          event_date: string;
          duration_hours?: number;
          venue_name?: string;
          venue_address?: string;
          amount: number;
          platform_fee: number;
          artist_payout: number;
          description?: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          client_id: string;
          artist_id: string;
          booking_type: 'unique' | 'recurring' | 'fixed';
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          event_date: string;
          duration_hours?: number;
          venue_name?: string;
          venue_address?: string;
          amount: number;
          platform_fee: number;
          artist_payout: number;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          client_id?: string;
          artist_id?: string;
          booking_type?: 'unique' | 'recurring' | 'fixed';
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          event_date?: string;
          duration_hours?: number;
          venue_name?: string;
          venue_address?: string;
          amount?: number;
          platform_fee?: number;
          artist_payout?: number;
          description?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}