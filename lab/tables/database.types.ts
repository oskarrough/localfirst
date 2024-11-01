export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      accounts: {
        Row: {
          color_scheme: string | null
          created_at: string | null
          id: string
          theme: string | null
          updated_at: string | null
        }
        Insert: {
          color_scheme?: string | null
          created_at?: string | null
          id: string
          theme?: string | null
          updated_at?: string | null
        }
        Update: {
          color_scheme?: string | null
          created_at?: string | null
          id?: string
          theme?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "accounts_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      channel_track: {
        Row: {
          channel_id: string
          created_at: string | null
          track_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string | null
          track_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          created_at?: string | null
          track_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "channel_track_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_track_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "orphaned_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_track_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "channel_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_track_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "orphaned_tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_track_track_id_fkey"
            columns: ["track_id"]
            isOneToOne: false
            referencedRelation: "tracks"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "channel_track_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      channels: {
        Row: {
          coordinates: unknown | null
          created_at: string | null
          description: string | null
          favorites: string[] | null
          firebase_id: string | null
          followers: string[] | null
          fts: unknown | null
          id: string
          image: string | null
          latitude: number | null
          longitude: number | null
          name: string
          slug: string
          updated_at: string | null
          url: string | null
        }
        Insert: {
          coordinates?: unknown | null
          created_at?: string | null
          description?: string | null
          favorites?: string[] | null
          firebase_id?: string | null
          followers?: string[] | null
          fts?: unknown | null
          id?: string
          image?: string | null
          latitude?: number | null
          longitude?: number | null
          name: string
          slug: string
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          coordinates?: unknown | null
          created_at?: string | null
          description?: string | null
          favorites?: string[] | null
          firebase_id?: string | null
          followers?: string[] | null
          fts?: unknown | null
          id?: string
          image?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          slug?: string
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      followers: {
        Row: {
          channel_id: string
          created_at: string | null
          follower_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string | null
          follower_id: string
        }
        Update: {
          channel_id?: string
          created_at?: string | null
          follower_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "followers_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "orphaned_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "followers_follower_id_fkey"
            columns: ["follower_id"]
            isOneToOne: false
            referencedRelation: "orphaned_channels"
            referencedColumns: ["id"]
          },
        ]
      }
      tracks: {
        Row: {
          created_at: string | null
          description: string | null
          discogs_url: string | null
          fts: unknown | null
          id: string
          mentions: string[] | null
          tags: string[] | null
          title: string
          updated_at: string | null
          url: string
        }
        Insert: {
          created_at: string | null
          description?: string | null
          discogs_url?: string | null
          fts?: unknown | null
          id?: string
          mentions?: string[] | null
          tags?: string[] | null
          title: string
          updated_at: string | null
          url: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discogs_url?: string | null
          fts?: unknown | null
          id?: string
          mentions?: string[] | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: []
      }
      user_channel: {
        Row: {
          channel_id: string
          created_at: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          channel_id: string
          created_at?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          channel_id?: string
          created_at?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_channel_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_channel_channel_id_fkey"
            columns: ["channel_id"]
            isOneToOne: false
            referencedRelation: "orphaned_channels"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_channel_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      channel_tracks: {
        Row: {
          created_at: string | null
          description: string | null
          discogs_url: string | null
          fts: unknown | null
          id: string
          mentions: string[] | null
          slug: string | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          url: string | null
        }
        Relationships: []
      }
      orphaned_channels: {
        Row: {
          coordinates: unknown | null
          created_at: string | null
          description: string | null
          favorites: string[] | null
          firebase_id: string | null
          followers: string[] | null
          fts: unknown | null
          id: string
          image: string | null
          latitude: number | null
          longitude: number | null
          name: string | null
          slug: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          coordinates?: unknown | null
          created_at?: string | null
          description?: string | null
          favorites?: string[] | null
          firebase_id?: string | null
          followers?: string[] | null
          fts?: unknown | null
          id?: string | null
          image?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          slug?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          coordinates?: unknown | null
          created_at?: string | null
          description?: string | null
          favorites?: string[] | null
          firebase_id?: string | null
          followers?: string[] | null
          fts?: unknown | null
          id?: string | null
          image?: string | null
          latitude?: number | null
          longitude?: number | null
          name?: string | null
          slug?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
      orphaned_tracks: {
        Row: {
          created_at: string | null
          description: string | null
          discogs_url: string | null
          fts: unknown | null
          id: string | null
          mentions: string[] | null
          tags: string[] | null
          title: string | null
          updated_at: string | null
          url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          discogs_url?: string | null
          fts?: unknown | null
          id?: string | null
          mentions?: string[] | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          discogs_url?: string | null
          fts?: unknown | null
          id?: string | null
          mentions?: string[] | null
          tags?: string[] | null
          title?: string | null
          updated_at?: string | null
          url?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      delete_user: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      parse_tokens: {
        Args: {
          content: string
          prefix: string
        }
        Returns: string[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never
