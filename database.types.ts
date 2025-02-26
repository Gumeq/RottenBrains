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
      comments: {
        Row: {
          content: string
          created_at: string | null
          id: string
          parent_id: string | null
          post_id: string | null
          total_likes: number
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string | null
          total_likes?: number
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          parent_id?: string | null
          post_id?: string | null
          total_likes?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comments_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      dev_blog: {
        Row: {
          author_id: string | null
          content: string
          created_at: string | null
          features: string[] | null
          id: string
          images: string[] | null
          slug: string
          tags: string[] | null
          thumbnail: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id?: string | null
          content: string
          created_at?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          slug: string
          tags?: string[] | null
          thumbnail?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string | null
          content?: string
          created_at?: string | null
          features?: string[] | null
          id?: string
          images?: string[] | null
          slug?: string
          tags?: string[] | null
          thumbnail?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      follows: {
        Row: {
          created_at: string | null
          following_id: string | null
          id: string
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          following_id?: string | null
          id?: string
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          following_id?: string | null
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "follows_following_id_fkey"
            columns: ["following_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "follows_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      likes: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "likes_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      movie_genre_stats: {
        Row: {
          "10402": number
          "10749": number
          "10751": number
          "10752": number
          "10770": number
          "12": number
          "14": number
          "16": number
          "18": number
          "27": number
          "28": number
          "35": number
          "36": number
          "37": number
          "53": number
          "80": number
          "878": number
          "9648": number
          "99": number
          id: string
          user_id: string
        }
        Insert: {
          "10402"?: number
          "10749"?: number
          "10751"?: number
          "10752"?: number
          "10770"?: number
          "12"?: number
          "14"?: number
          "16"?: number
          "18"?: number
          "27"?: number
          "28"?: number
          "35"?: number
          "36"?: number
          "37"?: number
          "53"?: number
          "80"?: number
          "878"?: number
          "9648"?: number
          "99"?: number
          id?: string
          user_id: string
        }
        Update: {
          "10402"?: number
          "10749"?: number
          "10751"?: number
          "10752"?: number
          "10770"?: number
          "12"?: number
          "14"?: number
          "16"?: number
          "18"?: number
          "27"?: number
          "28"?: number
          "35"?: number
          "36"?: number
          "37"?: number
          "53"?: number
          "80"?: number
          "878"?: number
          "9648"?: number
          "99"?: number
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "movie_genre_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      new_episodes: {
        Row: {
          created_at: string
          episode_number: number | null
          id: string
          last_air_date: string | null
          season_number: number | null
          tv_id: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          episode_number?: number | null
          id?: string
          last_air_date?: string | null
          season_number?: number | null
          tv_id?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          episode_number?: number | null
          id?: string
          last_air_date?: string | null
          season_number?: number | null
          tv_id?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          comment_id: string | null
          created_at: string | null
          from_user_id: string | null
          id: string
          post_id: string | null
          read: boolean | null
          type: string | null
          user_id: string | null
        }
        Insert: {
          comment_id?: string | null
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          post_id?: string | null
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Update: {
          comment_id?: string | null
          created_at?: string | null
          from_user_id?: string | null
          id?: string
          post_id?: string | null
          read?: boolean | null
          type?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "notifications_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_from_user_id_fkey"
            columns: ["from_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      posts: {
        Row: {
          created_at: string | null
          creatorid: string | null
          id: string
          media_id: number | null
          media_type: string | null
          review_user: string | null
          total_comments: number
          total_likes: number | null
          vote_user: number | null
        }
        Insert: {
          created_at?: string | null
          creatorid?: string | null
          id?: string
          media_id?: number | null
          media_type?: string | null
          review_user?: string | null
          total_comments?: number
          total_likes?: number | null
          vote_user?: number | null
        }
        Update: {
          created_at?: string | null
          creatorid?: string | null
          id?: string
          media_id?: number | null
          media_type?: string | null
          review_user?: string | null
          total_comments?: number
          total_likes?: number | null
          vote_user?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "posts_creatorid_fkey"
            columns: ["creatorid"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      saves: {
        Row: {
          created_at: string | null
          id: string
          post_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          post_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "saves_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "saves_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      tv_genre_stats: {
        Row: {
          "10751": number
          "10759": number
          "10762": number
          "10763": number
          "10764": number
          "10765": number
          "10766": number
          "10767": number
          "10768": number
          "16": number
          "18": number
          "35": number
          "37": number
          "80": number
          "9648": number
          "99": number
          id: string
          user_id: string | null
        }
        Insert: {
          "10751"?: number
          "10759"?: number
          "10762"?: number
          "10763"?: number
          "10764"?: number
          "10765"?: number
          "10766"?: number
          "10767"?: number
          "10768"?: number
          "16"?: number
          "18"?: number
          "35"?: number
          "37"?: number
          "80"?: number
          "9648"?: number
          "99"?: number
          id?: string
          user_id?: string | null
        }
        Update: {
          "10751"?: number
          "10759"?: number
          "10762"?: number
          "10763"?: number
          "10764"?: number
          "10765"?: number
          "10766"?: number
          "10767"?: number
          "10768"?: number
          "16"?: number
          "18"?: number
          "35"?: number
          "37"?: number
          "80"?: number
          "9648"?: number
          "99"?: number
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tv_genre_stats_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          backdrop_url: string | null
          bio: string | null
          created_at: string
          email: string | null
          feed_genres: Json[] | null
          id: string
          image_url: string | null
          name: string | null
          premium: boolean
          tmdb_id: string | null
          username: string | null
        }
        Insert: {
          backdrop_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          feed_genres?: Json[] | null
          id: string
          image_url?: string | null
          name?: string | null
          premium?: boolean
          tmdb_id?: string | null
          username?: string | null
        }
        Update: {
          backdrop_url?: string | null
          bio?: string | null
          created_at?: string
          email?: string | null
          feed_genres?: Json[] | null
          id?: string
          image_url?: string | null
          name?: string | null
          premium?: boolean
          tmdb_id?: string | null
          username?: string | null
        }
        Relationships: []
      }
      watch_history: {
        Row: {
          created_at: string | null
          episode_number: number | null
          id: string
          media_id: number
          media_type: string
          percentage_watched: string | null
          season_number: number | null
          time_spent: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          episode_number?: number | null
          id?: string
          media_id: number
          media_type: string
          percentage_watched?: string | null
          season_number?: number | null
          time_spent?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          episode_number?: number | null
          id?: string
          media_id?: number
          media_type?: string
          percentage_watched?: string | null
          season_number?: number | null
          time_spent?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "watch_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      watch_list: {
        Row: {
          created_at: string
          id: string
          media_id: number | null
          media_type: string | null
          user_id: string | null
          watch_list_type: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          media_id?: number | null
          media_type?: string | null
          user_id?: string | null
          watch_list_type?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          media_id?: number | null
          media_type?: string | null
          user_id?: string | null
          watch_list_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "watch_list_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_to_watch_list: {
        Args: {
          p_user_id: string
          p_media_type: string
          p_media_id: number
          p_watch_list_type: string
        }
        Returns: string
      }
      check_watch_history_exists: {
        Args: {
          p_user_id: string
          p_media_type: string
          p_media_id: number
          p_season_number?: number
          p_episode_number?: number
        }
        Returns: boolean
      }
      decrement_comments: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      decrement_likes: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      fetch_posts_by_media: {
        Args: {
          current_user_id: string
          media_type_param: string
          media_id_param: number
          result_limit: number
          result_offset: number
        }
        Returns: {
          post_id: string
          creatorid: string
          creator_username: string
          creator_name: string
          creator_email: string
          creator_image_url: string
          creator_tmdb_id: string
          review_user: string
          vote_user: number
          created_at: string
          media_id: number
          media_type: string
          total_likes: number
          total_comments: number
          has_liked: boolean
          has_saved: boolean
        }[]
      }
      fetch_posts_from_followed_users: {
        Args: {
          current_user_id: string
          result_limit: number
          result_offset: number
        }
        Returns: {
          post_id: string
          creatorid: string
          creator_username: string
          creator_name: string
          creator_email: string
          creator_image_url: string
          creator_tmdb_id: string
          review_user: string
          vote_user: number
          created_at: string
          media_id: number
          media_type: string
          total_likes: number
          total_comments: number
          has_liked: boolean
          has_saved: boolean
        }[]
      }
      fetch_user_liked_posts:
        | {
            Args: {
              creator_id: string
              current_user_id: string
              result_limit: number
              result_offset: number
            }
            Returns: {
              post_id: string
              creatorid: string
              creator_username: string
              creator_name: string
              creator_email: string
              creator_image_url: string
              creator_tmdb_id: string
              review_user: string
              vote_user: number
              created_at: string
              media_id: number
              media_type: string
              total_likes: number
              total_comments: number
              has_liked: boolean
              has_saved: boolean
            }[]
          }
        | {
            Args: {
              current_user_id: string
              result_limit: number
              result_offset: number
            }
            Returns: {
              post_id: string
              creatorid: string
              creator_username: string
              creator_name: string
              creator_email: string
              creator_image_url: string
              creator_tmdb_id: string
              review_user: string
              vote_user: number
              created_at: string
              mediaid: number
              media_type: string
              total_likes: number
              total_comments: number
              has_saved: boolean
            }[]
          }
      fetch_user_posts: {
        Args: {
          creator_id: string
          current_user_id?: string
          result_limit?: number
          result_offset?: number
        }
        Returns: {
          post_id: string
          creatorid: string
          creator_username: string
          creator_name: string
          creator_email: string
          creator_image_url: string
          creator_tmdb_id: string
          review_user: string
          vote_user: number
          created_at: string
          media_id: number
          media_type: string
          total_likes: number
          total_comments: number
          has_liked: boolean
          has_saved: boolean
        }[]
      }
      fetch_user_posts_type:
        | {
            Args: {
              creator_id: string
              current_user_id?: string
              media_type_filter?: string
              result_limit?: number
              result_offset?: number
            }
            Returns: {
              post_id: string
              creatorid: string
              creator_username: string
              creator_name: string
              creator_email: string
              creator_image_url: string
              creator_tmdb_id: string
              review_user: string
              vote_user: number
              created_at: string
              media_id: number
              media_type: string
              total_likes: number
              total_comments: number
              has_liked: boolean
              has_saved: boolean
            }[]
          }
        | {
            Args: {
              creator_id: string
              current_user_id?: string
              result_limit?: number
              result_offset?: number
            }
            Returns: {
              post_id: string
              creatorid: string
              creator_username: string
              creator_name: string
              creator_email: string
              creator_image_url: string
              creator_tmdb_id: string
              review_user: string
              vote_user: number
              created_at: string
              media_id: number
              media_type: string
              total_likes: number
              total_comments: number
              has_liked: boolean
              has_saved: boolean
            }[]
          }
      fetch_user_saved_posts: {
        Args: {
          creator_id: string
          current_user_id: string
          result_limit: number
          result_offset: number
        }
        Returns: {
          post_id: string
          creatorid: string
          creator_username: string
          creator_name: string
          creator_email: string
          creator_image_url: string
          creator_tmdb_id: string
          review_user: string
          vote_user: number
          created_at: string
          media_id: number
          media_type: string
          total_likes: number
          total_comments: number
          has_liked: boolean
          has_saved: boolean
        }[]
      }
      get_batch_watched_items: {
        Args: {
          input_user_id: string
          input_items: Json
        }
        Returns: {
          media_type: string
          media_id: number
        }[]
      }
      get_next_episodes: {
        Args: {
          user_id_input: string
        }
        Returns: {
          media_id: number
          media_type: string
          season_number: number
          episode_number: number
          next_episode: boolean
        }[]
      }
      get_percentage_watched: {
        Args: {
          p_user_id: string
          p_media_type: string
          p_media_id: number
          p_season_number?: number
          p_episode_number?: number
        }
        Returns: string
      }
      get_top_movie_genres_for_user: {
        Args: {
          p_user_id: string
        }
        Returns: {
          genre_code: string
          value: number
        }[]
      }
      get_top_tv_genres_for_user: {
        Args: {
          p_user_id: string
        }
        Returns: {
          genre_code: string
          value: number
        }[]
      }
      get_watch_history_for_user:
        | {
            Args: {
              p_user_id: string
            }
            Returns: {
              user_id: string
              media_type: string
              media_id: number
              season_id: number
              episode_number: number
              created_at: string
            }[]
          }
        | {
            Args: {
              p_user_id: string
              p_limit: number
              p_offset: number
            }
            Returns: {
              user_id: string
              media_type: string
              media_id: number
              season_number: number
              episode_number: number
              time_spent: number
              percentage_watched: string
              created_at: string
            }[]
          }
      get_watch_later:
        | {
            Args: {
              p_user_id: string
              p_limit: number
              p_offset: number
            }
            Returns: {
              id: string
              user_id: string
              media_type: string
              media_id: number
              watch_list_type: string
              created_at: string
            }[]
          }
        | {
            Args: {
              user_id_input: string
            }
            Returns: {
              id: number
              user_id: string
              media_type: string
              media_id: number
              watch_list_type: string
              created_at: string
            }[]
          }
      get_watch_later_entries: {
        Args: {
          p_user_id: string
          p_media_type: string
          p_media_id: number
        }
        Returns: {
          id: string
          user_id: string
          media_type: string
          media_id: number
          watch_list_type: string
          created_at: string
        }[]
      }
      get_watch_list_full: {
        Args: {
          p_user_id: string
          p_limit: number
          p_offset: number
        }
        Returns: {
          id: string
          user_id: string
          media_type: string
          media_id: number
          watch_list_type: string
          created_at: string
        }[]
      }
      get_watch_list_specific: {
        Args: {
          p_user_id: string
          p_limit: number
          p_offset: number
          p_watch_list_type: string
        }
        Returns: {
          id: string
          user_id: string
          media_type: string
          media_id: number
          watch_list_type: string
          created_at: string
        }[]
      }
      get_watched_items: {
        Args: {
          input_user_id: string
          input_movies: number[]
          input_tvshows: number[]
        }
        Returns: {
          media_type: string
          media_id: number
        }[]
      }
      increment_comments: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      increment_likes: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      is_item_watched: {
        Args: {
          input_user_id: string
          input_media_type: string
          input_media_id: number
        }
        Returns: boolean
      }
      remove_movie_duplicates: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      update_genre_stats: {
        Args: {
          genre_ids: number[]
          media_type: string
          user_id: string
        }
        Returns: undefined
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

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
