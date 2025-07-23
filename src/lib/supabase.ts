import { createBrowserClient, createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

// Configuración del cliente Supabase para el navegador
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

// Configuración del cliente Supabase para el servidor
export function createServerSupabaseClient() {
  const cookieStore = cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // El método set puede fallar en middleware o durante el renderizado del servidor
          }
        },
        remove(name: string, options: any) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // El método remove puede fallar en middleware o durante el renderizado del servidor
          }
        },
      },
    }
  )
}

// Tipos TypeScript para la base de datos
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          full_name: string | null
          avatar_url: string | null
          role: 'cliente' | 'artista'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'cliente' | 'artista'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          full_name?: string | null
          avatar_url?: string | null
          role?: 'cliente' | 'artista'
          created_at?: string
          updated_at?: string
        }
      }
      artist_details: {
        Row: {
          id: string
          bio: string | null
          location: string | null
          availability_status: string
          base_rate: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          bio?: string | null
          location?: string | null
          availability_status?: string
          base_rate?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          bio?: string | null
          location?: string | null
          availability_status?: string
          base_rate?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}