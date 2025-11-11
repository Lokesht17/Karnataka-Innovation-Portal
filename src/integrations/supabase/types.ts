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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      collaborations: {
        Row: {
          created_at: string
          id: string
          message: string | null
          project_id: string | null
          receiver_id: string
          requester_id: string
          status: Database["public"]["Enums"]["collab_status"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string | null
          receiver_id: string
          requester_id: string
          status?: Database["public"]["Enums"]["collab_status"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string | null
          project_id?: string | null
          receiver_id?: string
          requester_id?: string
          status?: Database["public"]["Enums"]["collab_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collaborations_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "research_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      investor_interest: {
        Row: {
          amount: number | null
          created_at: string
          id: string
          investor_id: string
          message: string | null
          target_id: string
          target_type: string
        }
        Insert: {
          amount?: number | null
          created_at?: string
          id?: string
          investor_id: string
          message?: string | null
          target_id: string
          target_type: string
        }
        Update: {
          amount?: number | null
          created_at?: string
          id?: string
          investor_id?: string
          message?: string | null
          target_id?: string
          target_type?: string
        }
        Relationships: []
      }
      patents: {
        Row: {
          application_number: string | null
          created_at: string
          created_by: string
          description: string | null
          document_path: string | null
          filed_date: string
          id: string
          institution: string
          inventor: string
          status: Database["public"]["Enums"]["patent_status"]
          title: string
          updated_at: string
        }
        Insert: {
          application_number?: string | null
          created_at?: string
          created_by: string
          description?: string | null
          document_path?: string | null
          filed_date: string
          id?: string
          institution: string
          inventor: string
          status?: Database["public"]["Enums"]["patent_status"]
          title: string
          updated_at?: string
        }
        Update: {
          application_number?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          document_path?: string | null
          filed_date?: string
          id?: string
          institution?: string
          inventor?: string
          status?: Database["public"]["Enums"]["patent_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          institution_or_startup: string | null
          name: string
          phone: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          email: string
          id: string
          institution_or_startup?: string | null
          name: string
          phone?: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          institution_or_startup?: string | null
          name?: string
          phone?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
        }
        Relationships: []
      }
      research_projects: {
        Row: {
          abstract: string
          approved_by: string | null
          created_at: string
          created_by: string
          document_path: string | null
          duration_months: number | null
          funding_amount: number | null
          id: string
          institution: string
          principal_investigator: string
          review_comment: string | null
          status: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at: string
        }
        Insert: {
          abstract: string
          approved_by?: string | null
          created_at?: string
          created_by: string
          document_path?: string | null
          duration_months?: number | null
          funding_amount?: number | null
          id?: string
          institution: string
          principal_investigator: string
          review_comment?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title: string
          updated_at?: string
        }
        Update: {
          abstract?: string
          approved_by?: string | null
          created_at?: string
          created_by?: string
          document_path?: string | null
          duration_months?: number | null
          funding_amount?: number | null
          id?: string
          institution?: string
          principal_investigator?: string
          review_comment?: string | null
          status?: Database["public"]["Enums"]["project_status"]
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      startups: {
        Row: {
          company_name: string
          created_at: string
          created_by: string
          description: string | null
          document_path: string | null
          founder_name: string
          funding_received: number | null
          id: string
          is_verified: boolean | null
          logo_url: string | null
          recognition_id: string | null
          sector: string
          stage: Database["public"]["Enums"]["startup_stage"]
          updated_at: string
        }
        Insert: {
          company_name: string
          created_at?: string
          created_by: string
          description?: string | null
          document_path?: string | null
          founder_name: string
          funding_received?: number | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          recognition_id?: string | null
          sector: string
          stage: Database["public"]["Enums"]["startup_stage"]
          updated_at?: string
        }
        Update: {
          company_name?: string
          created_at?: string
          created_by?: string
          description?: string | null
          document_path?: string | null
          founder_name?: string
          funding_received?: number | null
          id?: string
          is_verified?: boolean | null
          logo_url?: string | null
          recognition_id?: string | null
          sector?: string
          stage?: Database["public"]["Enums"]["startup_stage"]
          updated_at?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["user_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["user_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["user_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      collab_status: "pending" | "accepted" | "rejected"
      patent_status: "filed" | "under_review" | "approved" | "rejected"
      project_status: "submitted" | "under_review" | "approved" | "rejected"
      startup_stage: "ideation" | "prototype" | "mvp" | "growth" | "scaling"
      user_role: "admin" | "researcher" | "startup" | "investor"
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
      collab_status: ["pending", "accepted", "rejected"],
      patent_status: ["filed", "under_review", "approved", "rejected"],
      project_status: ["submitted", "under_review", "approved", "rejected"],
      startup_stage: ["ideation", "prototype", "mvp", "growth", "scaling"],
      user_role: ["admin", "researcher", "startup", "investor"],
    },
  },
} as const
