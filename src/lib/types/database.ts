export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          position: string | null
          department_id: string | null
          role: 'admin' | 'head' | 'employee' | 'guest'
          phone: string | null
          bio: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          position?: string | null
          department_id?: string | null
          role?: 'admin' | 'head' | 'employee' | 'guest'
          phone?: string | null
          bio?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          position?: string | null
          department_id?: string | null
          role?: 'admin' | 'head' | 'employee' | 'guest'
          phone?: string | null
          bio?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      departments: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          head_id: string | null
          icon: string | null
          sort_order: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          head_id?: string | null
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          head_id?: string | null
          icon?: string | null
          sort_order?: number
          created_at?: string
        }
      }
      sections: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          parent_id: string | null
          section_type: 'company' | 'products' | 'department' | 'general'
          department_id: string | null
          icon: string | null
          sort_order: number
          is_public: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          parent_id?: string | null
          section_type: 'company' | 'products' | 'department' | 'general'
          department_id?: string | null
          icon?: string | null
          sort_order?: number
          is_public?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          parent_id?: string | null
          section_type?: 'company' | 'products' | 'department' | 'general'
          department_id?: string | null
          icon?: string | null
          sort_order?: number
          is_public?: boolean
          created_at?: string
        }
      }
      documents: {
        Row: {
          id: string
          title: string
          slug: string
          content: Record<string, unknown>
          section_id: string
          author_id: string
          status: 'draft' | 'published' | 'archived'
          is_template: boolean
          share_token: string | null
          share_enabled: boolean
          version: number
          pinned: boolean
          tags: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: Record<string, unknown>
          section_id: string
          author_id: string
          status?: 'draft' | 'published' | 'archived'
          is_template?: boolean
          share_token?: string | null
          share_enabled?: boolean
          version?: number
          pinned?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: Record<string, unknown>
          section_id?: string
          author_id?: string
          status?: 'draft' | 'published' | 'archived'
          is_template?: boolean
          share_token?: string | null
          share_enabled?: boolean
          version?: number
          pinned?: boolean
          tags?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      document_versions: {
        Row: {
          id: string
          document_id: string
          content: Record<string, unknown>
          version: number
          author_id: string
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          content: Record<string, unknown>
          version: number
          author_id: string
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          content?: Record<string, unknown>
          version?: number
          author_id?: string
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          slug: string
          description: string | null
          product_type: 'paid' | 'free'
          category: string | null
          status: 'draft' | 'active' | 'archived'
          responsible_id: string | null
          department_id: string | null
          cover_url: string | null
          metadata: Record<string, unknown>
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          description?: string | null
          product_type: 'paid' | 'free'
          category?: string | null
          status?: 'draft' | 'active' | 'archived'
          responsible_id?: string | null
          department_id?: string | null
          cover_url?: string | null
          metadata?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          description?: string | null
          product_type?: 'paid' | 'free'
          category?: string | null
          status?: 'draft' | 'active' | 'archived'
          responsible_id?: string | null
          department_id?: string | null
          cover_url?: string | null
          metadata?: Record<string, unknown>
          created_at?: string
          updated_at?: string
        }
      }
      news: {
        Row: {
          id: string
          title: string
          content: Record<string, unknown>
          category: string | null
          author_id: string
          is_published: boolean
          published_at: string | null
          email_sent: boolean
          target_departments: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          content: Record<string, unknown>
          category?: string | null
          author_id: string
          is_published?: boolean
          published_at?: string | null
          email_sent?: boolean
          target_departments?: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          content?: Record<string, unknown>
          category?: string | null
          author_id?: string
          is_published?: boolean
          published_at?: string | null
          email_sent?: boolean
          target_departments?: string[]
          created_at?: string
        }
      }
      news_reads: {
        Row: {
          id: string
          news_id: string
          user_id: string
          read_at: string
        }
        Insert: {
          id?: string
          news_id: string
          user_id: string
          read_at?: string
        }
        Update: {
          id?: string
          news_id?: string
          user_id?: string
          read_at?: string
        }
      }
      section_permissions: {
        Row: {
          id: string
          section_id: string
          role: string | null
          department_id: string | null
          user_id: string | null
          permission: 'read' | 'write' | 'admin'
          created_at: string
        }
        Insert: {
          id?: string
          section_id: string
          role?: string | null
          department_id?: string | null
          user_id?: string | null
          permission: 'read' | 'write' | 'admin'
          created_at?: string
        }
        Update: {
          id?: string
          section_id?: string
          role?: string | null
          department_id?: string | null
          user_id?: string | null
          permission?: 'read' | 'write' | 'admin'
          created_at?: string
        }
      }
      onboarding_videos: {
        Row: {
          id: string
          title: string
          description: string | null
          video_url: string
          thumbnail_url: string | null
          sort_order: number
          target_departments: string[]
          duration_seconds: number
          is_required: boolean
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          video_url: string
          thumbnail_url?: string | null
          sort_order?: number
          target_departments?: string[]
          duration_seconds?: number
          is_required?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          video_url?: string
          thumbnail_url?: string | null
          sort_order?: number
          target_departments?: string[]
          duration_seconds?: number
          is_required?: boolean
          created_at?: string
        }
      }
      onboarding_progress: {
        Row: {
          id: string
          user_id: string
          video_id: string
          watched: boolean
          watched_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          video_id: string
          watched?: boolean
          watched_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          video_id?: string
          watched?: boolean
          watched_at?: string | null
        }
      }
      media: {
        Row: {
          id: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          uploaded_by: string
          created_at: string
        }
        Insert: {
          id?: string
          file_name: string
          file_path: string
          file_type: string
          file_size: number
          uploaded_by: string
          created_at?: string
        }
        Update: {
          id?: string
          file_name?: string
          file_path?: string
          file_type?: string
          file_size?: number
          uploaded_by?: string
          created_at?: string
        }
      }
    }
    Enums: {
      user_role: 'admin' | 'head' | 'employee' | 'guest'
      document_status: 'draft' | 'published' | 'archived'
      product_type: 'paid' | 'free'
      product_status: 'draft' | 'active' | 'archived'
      section_type: 'company' | 'products' | 'department' | 'general'
      permission_type: 'read' | 'write' | 'admin'
    }
  }
}
