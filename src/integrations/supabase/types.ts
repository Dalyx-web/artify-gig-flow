export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      archetype_field_visibility: {
        Row: {
          archetype_id: string
          created_at: string | null
          field_id: string
          id: string
          is_required_override: boolean | null
        }
        Insert: {
          archetype_id: string
          created_at?: string | null
          field_id: string
          id?: string
          is_required_override?: boolean | null
        }
        Update: {
          archetype_id?: string
          created_at?: string | null
          field_id?: string
          id?: string
          is_required_override?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "archetype_field_visibility_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "artist_archetypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "archetype_field_visibility_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "form_fields"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_archetypes: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          description_ar: string | null
          display_order: number | null
          icon: string | null
          id: string
          is_active: boolean | null
          name: string
          name_ar: string | null
          parent_archetype_id: string | null
          updated_at: string | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          name_ar?: string | null
          parent_archetype_id?: string | null
          updated_at?: string | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          description_ar?: string | null
          display_order?: number | null
          icon?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          name_ar?: string | null
          parent_archetype_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_archetypes_parent_archetype_id_fkey"
            columns: ["parent_archetype_id"]
            isOneToOne: false
            referencedRelation: "artist_archetypes"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_availability_slots: {
        Row: {
          artist_profile_id: string
          created_at: string | null
          day_of_week: number
          end_time: string
          id: string
          is_available: boolean | null
          start_time: string
          timezone: string | null
          updated_at: string | null
        }
        Insert: {
          artist_profile_id: string
          created_at?: string | null
          day_of_week: number
          end_time: string
          id?: string
          is_available?: boolean | null
          start_time: string
          timezone?: string | null
          updated_at?: string | null
        }
        Update: {
          artist_profile_id?: string
          created_at?: string | null
          day_of_week?: number
          end_time?: string
          id?: string
          is_available?: boolean | null
          start_time?: string
          timezone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_availability_slots_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_pricing_packages: {
        Row: {
          artist_profile_id: string
          created_at: string | null
          currency: string | null
          description: string | null
          description_ar: string | null
          display_order: number | null
          duration_hours: number | null
          id: string
          includes: Json | null
          includes_ar: Json | null
          is_active: boolean | null
          is_featured: boolean | null
          package_name: string
          package_name_ar: string | null
          price_amount: number
          updated_at: string | null
        }
        Insert: {
          artist_profile_id: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          description_ar?: string | null
          display_order?: number | null
          duration_hours?: number | null
          id?: string
          includes?: Json | null
          includes_ar?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          package_name: string
          package_name_ar?: string | null
          price_amount: number
          updated_at?: string | null
        }
        Update: {
          artist_profile_id?: string
          created_at?: string | null
          currency?: string | null
          description?: string | null
          description_ar?: string | null
          display_order?: number | null
          duration_hours?: number | null
          id?: string
          includes?: Json | null
          includes_ar?: Json | null
          is_active?: boolean | null
          is_featured?: boolean | null
          package_name?: string
          package_name_ar?: string | null
          price_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_pricing_packages_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_profile_tags: {
        Row: {
          artist_profile_id: string
          created_at: string | null
          id: string
          tag_id: string
        }
        Insert: {
          artist_profile_id: string
          created_at?: string | null
          id?: string
          tag_id: string
        }
        Update: {
          artist_profile_id?: string
          created_at?: string | null
          id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_profile_tags_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_profile_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "artist_tags"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_profiles: {
        Row: {
          archetype_id: string | null
          artistic_name: string | null
          availability_status: string | null
          bio: string | null
          created_at: string
          currency: string | null
          experience_years: number | null
          featured: boolean | null
          hourly_rate: number | null
          id: string
          is_published: boolean | null
          location: string | null
          portfolio_url: string | null
          preferred_language: string | null
          profile_score: number | null
          rating: number | null
          response_time_hours: number | null
          schema_version: number | null
          timezone: string | null
          total_bookings: number | null
          total_reviews: number | null
          updated_at: string
          user_id: string
          verified: boolean | null
        }
        Insert: {
          archetype_id?: string | null
          artistic_name?: string | null
          availability_status?: string | null
          bio?: string | null
          created_at?: string
          currency?: string | null
          experience_years?: number | null
          featured?: boolean | null
          hourly_rate?: number | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          portfolio_url?: string | null
          preferred_language?: string | null
          profile_score?: number | null
          rating?: number | null
          response_time_hours?: number | null
          schema_version?: number | null
          timezone?: string | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id: string
          verified?: boolean | null
        }
        Update: {
          archetype_id?: string | null
          artistic_name?: string | null
          availability_status?: string | null
          bio?: string | null
          created_at?: string
          currency?: string | null
          experience_years?: number | null
          featured?: boolean | null
          hourly_rate?: number | null
          id?: string
          is_published?: boolean | null
          location?: string | null
          portfolio_url?: string | null
          preferred_language?: string | null
          profile_score?: number | null
          rating?: number | null
          response_time_hours?: number | null
          schema_version?: number | null
          timezone?: string | null
          total_bookings?: number | null
          total_reviews?: number | null
          updated_at?: string
          user_id?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_profiles_archetype_id_fkey"
            columns: ["archetype_id"]
            isOneToOne: false
            referencedRelation: "artist_archetypes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_skills: {
        Row: {
          artist_profile_id: string
          created_at: string
          id: string
          proficiency_level: string | null
          skill_id: string
        }
        Insert: {
          artist_profile_id: string
          created_at?: string
          id?: string
          proficiency_level?: string | null
          skill_id: string
        }
        Update: {
          artist_profile_id?: string
          created_at?: string
          id?: string
          proficiency_level?: string | null
          skill_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artist_skills_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "artist_skills_skill_id_fkey"
            columns: ["skill_id"]
            isOneToOne: false
            referencedRelation: "skills"
            referencedColumns: ["id"]
          },
        ]
      }
      artist_tags: {
        Row: {
          category: string | null
          created_at: string | null
          id: string
          is_approved: boolean | null
          tag_name: string
          tag_name_ar: string | null
          usage_count: number | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          tag_name: string
          tag_name_ar?: string | null
          usage_count?: number | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          id?: string
          is_approved?: boolean | null
          tag_name?: string
          tag_name_ar?: string | null
          usage_count?: number | null
        }
        Relationships: []
      }
      artist_technical_rider: {
        Row: {
          artist_profile_id: string
          breakdown_time_minutes: number | null
          created_at: string | null
          equipment_needed: Json | null
          equipment_provided: Json | null
          id: string
          lighting_requirements: string | null
          setup_time_minutes: number | null
          sound_requirements: string | null
          special_requirements: string | null
          stage_requirements: string | null
          updated_at: string | null
        }
        Insert: {
          artist_profile_id: string
          breakdown_time_minutes?: number | null
          created_at?: string | null
          equipment_needed?: Json | null
          equipment_provided?: Json | null
          id?: string
          lighting_requirements?: string | null
          setup_time_minutes?: number | null
          sound_requirements?: string | null
          special_requirements?: string | null
          stage_requirements?: string | null
          updated_at?: string | null
        }
        Update: {
          artist_profile_id?: string
          breakdown_time_minutes?: number | null
          created_at?: string | null
          equipment_needed?: Json | null
          equipment_provided?: Json | null
          id?: string
          lighting_requirements?: string | null
          setup_time_minutes?: number | null
          sound_requirements?: string | null
          special_requirements?: string | null
          stage_requirements?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "artist_technical_rider_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: true
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      bookings: {
        Row: {
          artist_profile_id: string
          cancellation_reason: string | null
          client_id: string
          created_at: string
          deposit_amount: number | null
          duration_hours: number | null
          event_date: string
          event_description: string | null
          event_title: string
          id: string
          location: string | null
          package_id: string | null
          payment_status: string | null
          special_requests: string | null
          status: string | null
          total_amount: number
          updated_at: string
        }
        Insert: {
          artist_profile_id: string
          cancellation_reason?: string | null
          client_id: string
          created_at?: string
          deposit_amount?: number | null
          duration_hours?: number | null
          event_date: string
          event_description?: string | null
          event_title: string
          id?: string
          location?: string | null
          package_id?: string | null
          payment_status?: string | null
          special_requests?: string | null
          status?: string | null
          total_amount: number
          updated_at?: string
        }
        Update: {
          artist_profile_id?: string
          cancellation_reason?: string | null
          client_id?: string
          created_at?: string
          deposit_amount?: number | null
          duration_hours?: number | null
          event_date?: string
          event_description?: string | null
          event_title?: string
          id?: string
          location?: string | null
          package_id?: string | null
          payment_status?: string | null
          special_requests?: string | null
          status?: string | null
          total_amount?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "pricing_packages"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          color: string | null
          created_at: string
          description: string | null
          icon: string | null
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          color?: string | null
          created_at?: string
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          artist_profile_id: string
          created_at: string
          id: string
          user_id: string
        }
        Insert: {
          artist_profile_id: string
          created_at?: string
          id?: string
          user_id: string
        }
        Update: {
          artist_profile_id?: string
          created_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      form_fields: {
        Row: {
          created_at: string | null
          display_order: number | null
          field_key: string
          field_options: Json | null
          field_type: string
          help_text: string | null
          help_text_ar: string | null
          id: string
          is_required: boolean | null
          label: string
          label_ar: string | null
          placeholder: string | null
          placeholder_ar: string | null
          section: string
          updated_at: string | null
          validation_rules: Json | null
          weight_for_completeness: number | null
        }
        Insert: {
          created_at?: string | null
          display_order?: number | null
          field_key: string
          field_options?: Json | null
          field_type: string
          help_text?: string | null
          help_text_ar?: string | null
          id?: string
          is_required?: boolean | null
          label: string
          label_ar?: string | null
          placeholder?: string | null
          placeholder_ar?: string | null
          section: string
          updated_at?: string | null
          validation_rules?: Json | null
          weight_for_completeness?: number | null
        }
        Update: {
          created_at?: string | null
          display_order?: number | null
          field_key?: string
          field_options?: Json | null
          field_type?: string
          help_text?: string | null
          help_text_ar?: string | null
          id?: string
          is_required?: boolean | null
          label?: string
          label_ar?: string | null
          placeholder?: string | null
          placeholder_ar?: string | null
          section?: string
          updated_at?: string | null
          validation_rules?: Json | null
          weight_for_completeness?: number | null
        }
        Relationships: []
      }
      message_infractions: {
        Row: {
          blocked_at: string
          conversation_id: string
          detected_patterns: Json
          id: string
          infraction_type: string
          message_content: string
          review_status: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          severity: string
          user_id: string
        }
        Insert: {
          blocked_at?: string
          conversation_id: string
          detected_patterns?: Json
          id?: string
          infraction_type: string
          message_content: string
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string
          user_id: string
        }
        Update: {
          blocked_at?: string
          conversation_id?: string
          detected_patterns?: Json
          id?: string
          infraction_type?: string
          message_content?: string
          review_status?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          severity?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "message_infractions_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "message_infractions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      messages: {
        Row: {
          booking_id: string | null
          content: string
          created_at: string
          id: string
          message_type: string | null
          read_at: string | null
          recipient_id: string
          sender_id: string
        }
        Insert: {
          booking_id?: string | null
          content: string
          created_at?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id: string
          sender_id: string
        }
        Update: {
          booking_id?: string | null
          content?: string
          created_at?: string
          id?: string
          message_type?: string | null
          read_at?: string | null
          recipient_id?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: false
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      portfolio_items: {
        Row: {
          artist_profile_id: string
          created_at: string
          description: string | null
          id: string
          is_featured: boolean | null
          media_type: string
          media_url: string
          order_index: number | null
          thumbnail_url: string | null
          title: string
          updated_at: string
        }
        Insert: {
          artist_profile_id: string
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          media_type: string
          media_url: string
          order_index?: number | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          artist_profile_id?: string
          created_at?: string
          description?: string | null
          id?: string
          is_featured?: boolean | null
          media_type?: string
          media_url?: string
          order_index?: number | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "portfolio_items_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      pricing_packages: {
        Row: {
          active: boolean | null
          artist_profile_id: string
          created_at: string
          description: string | null
          duration_hours: number | null
          id: string
          includes: string[] | null
          is_featured: boolean | null
          name: string
          price: number
          updated_at: string
        }
        Insert: {
          active?: boolean | null
          artist_profile_id: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          includes?: string[] | null
          is_featured?: boolean | null
          name: string
          price: number
          updated_at?: string
        }
        Update: {
          active?: boolean | null
          artist_profile_id?: string
          created_at?: string
          description?: string | null
          duration_hours?: number | null
          id?: string
          includes?: string[] | null
          is_featured?: boolean | null
          name?: string
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pricing_packages_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          email: string
          full_name: string | null
          id: string
          location: string | null
          phone: string | null
          updated_at: string
          user_id: string
          user_type: string
          username: string | null
          website: string | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id: string
          user_type?: string
          username?: string | null
          website?: string | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string
          full_name?: string | null
          id?: string
          location?: string | null
          phone?: string | null
          updated_at?: string
          user_id?: string
          user_type?: string
          username?: string | null
          website?: string | null
        }
        Relationships: []
      }
      reviews: {
        Row: {
          artist_profile_id: string
          booking_id: string
          comment: string | null
          created_at: string
          id: string
          is_public: boolean | null
          rating: number
          reviewer_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          artist_profile_id: string
          booking_id: string
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          rating: number
          reviewer_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          artist_profile_id?: string
          booking_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          is_public?: boolean | null
          rating?: number
          reviewer_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_booking_id_fkey"
            columns: ["booking_id"]
            isOneToOne: true
            referencedRelation: "bookings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      skills: {
        Row: {
          category_id: string | null
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "skills_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
        ]
      }
      social_links: {
        Row: {
          artist_profile_id: string
          created_at: string
          display_name: string | null
          id: string
          platform: string
          url: string
          verified: boolean | null
        }
        Insert: {
          artist_profile_id: string
          created_at?: string
          display_name?: string | null
          id?: string
          platform: string
          url: string
          verified?: boolean | null
        }
        Update: {
          artist_profile_id?: string
          created_at?: string
          display_name?: string | null
          id?: string
          platform?: string
          url?: string
          verified?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "social_links_artist_profile_id_fkey"
            columns: ["artist_profile_id"]
            isOneToOne: false
            referencedRelation: "artist_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_strikes: {
        Row: {
          created_at: string
          last_strike_at: string | null
          strike_count: number
          suspension_until: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          last_strike_at?: string | null
          strike_count?: number
          suspension_until?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          last_strike_at?: string | null
          strike_count?: number
          suspension_until?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_strikes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
      whitelisted_domains: {
        Row: {
          category: string | null
          created_at: string
          created_by: string | null
          description: string | null
          domain: string
          id: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          domain: string
          id?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          created_by?: string | null
          description?: string | null
          domain?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "whitelisted_domains_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_profile_score: {
        Args: { profile_id: string }
        Returns: number
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_user_strikes: {
        Args: { target_user_id: string }
        Returns: undefined
      }
      promote_user_to_admin: {
        Args: { user_email: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "admin" | "artist" | "client"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "artist", "client"],
    },
  },
} as const
