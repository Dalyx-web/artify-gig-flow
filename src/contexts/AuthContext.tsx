import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';

// User roles for the platform
export type UserRole = 'artist' | 'client' | 'admin';

// Extended user type with role and profile info
export interface AppUser extends User {
  role?: UserRole;
  profile?: {
    full_name?: string;
    artistic_name?: string;
    is_premium?: boolean;
    subscription_tier?: string;
    subscription_end?: string;
    user_type?: string;
  };
}

interface AuthContextType {
  user: AppUser | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<any>;
  signUp: (email: string, password: string, userData: any) => Promise<any>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AppUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      console.log('🔄 Getting initial session...');
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      if (session?.user) {
        console.log('👤 Initial user found:', session.user.email);
        await fetchUserProfile(session.user);
      }
      setLoading(false);
    };

    getInitialSession();

    // Listen for auth changes - NEVER use async in the callback
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔔 Auth state change:', event, session?.user?.email);
        setSession(session);
        setLoading(false);
        
        // Defer Supabase calls with setTimeout to prevent deadlocks
        if (session?.user) {
          setTimeout(() => {
            fetchUserProfile(session.user);
          }, 0);
        } else {
          setUser(null);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (authUser: User) => {
    try {
      console.log('🔍 Fetching profile for user:', authUser.id, authUser.email);
      
      // Fetch user profile from profiles table
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', authUser.id)
        .single();

      console.log('📋 Profile query result:', { profile, error });

      if (error && error.code !== 'PGRST116') {
        console.error('❌ Error fetching profile:', error);
        return;
      }

      // Create extended user object
      const appUser: AppUser = {
        ...authUser,
        role: (profile?.user_type as UserRole) || 'client',
        profile: profile || {}
      };

      console.log('✅ Setting user with role:', appUser.role, 'Profile:', appUser.profile);
      setUser(appUser);
    } catch (error) {
      console.error('💥 Error in fetchUserProfile:', error);
      setUser({ ...authUser, role: 'client' });
    }
  };

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            ...userData,
            user_type: userData.role
          },
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      });
      return { data, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    if (session?.user) {
      await fetchUserProfile(session.user);
    }
  };

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}