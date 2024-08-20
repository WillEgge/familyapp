export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      house: {
        Row: {
          house_id: string;
          house_name: string | null;
        };
        Insert: {
          house_id: string;
          house_name?: string | null;
        };
        Update: {
          house_id?: string;
          house_name?: string | null;
        };
      };
      member: {
        Row: {
          birth_date: string | null;
          created_at: string;
          email: string | null;
          first_name: string;
          house_id: string;
          is_parent: boolean;
          is_primary: boolean;
          last_name: string | null;
          member_id: number;
          mobile_phone: string | null;
          avatar_color: string | null;
          active: boolean;
        };
        Insert: {
          birth_date?: string | null;
          created_at?: string;
          email?: string | null;
          first_name: string;
          house_id: string;
          is_parent?: boolean;
          is_primary?: boolean;
          last_name?: string | null;
          member_id?: number;
          mobile_phone?: string | null;
          avatar_color?: string | null;
          active?: boolean;
        };
        Update: {
          birth_date?: string | null;
          created_at?: string;
          email?: string | null;
          first_name?: string;
          house_id?: string;
          is_parent?: boolean;
          is_primary?: boolean;
          last_name?: string | null;
          member_id?: number;
          mobile_phone?: string | null;
          avatar_color?: string | null;
          active?: boolean;
        };
      };
      task: {
        Row: {
          assignee_id: number;
          created_at: string;
          due_date: string | null;
          is_open: boolean;
          is_visible: boolean;
          priority: number;
          title: string;
          task_id: number;
          description: string | null;
          order: number;
          recurrence: "none" | "daily" | "weekly" | "monthly" | "yearly" | null;
          parent_task_id: number | null;
        };
        Insert: {
          assignee_id: number;
          created_at?: string;
          due_date?: string | null;
          is_open?: boolean;
          is_visible?: boolean;
          priority?: number;
          title: string;
          task_id?: number;
          description?: string | null;
          order?: number;
          recurrence?:
            | "none"
            | "daily"
            | "weekly"
            | "monthly"
            | "yearly"
            | null;
          parent_task_id?: number | null;
        };
        Update: {
          assignee_id?: number;
          created_at?: string;
          due_date?: string | null;
          is_open?: boolean;
          is_visible?: boolean;
          priority?: number;
          title?: string;
          task_id?: number;
          description?: string | null;
          order?: number;
          recurrence?:
            | "none"
            | "daily"
            | "weekly"
            | "monthly"
            | "yearly"
            | null;
          parent_task_id?: number | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
