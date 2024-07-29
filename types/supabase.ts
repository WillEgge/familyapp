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
      house: {
        Row: {
          house_id: string
          house_name: string | null
        }
        Insert: {
          house_id: string
          house_name?: string | null
        }
        Update: {
          house_id?: string
          house_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "house_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      member: {
        Row: {
          birth_date: string | null
          created_at: string
          email: string | null
          first_name: string
          house_id: string
          is_parent: boolean
          is_primary: boolean
          last_name: string | null
          member_id: number
          mobile_phone: string | null
        }
        Insert: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          house_id: string
          is_parent?: boolean
          is_primary?: boolean
          last_name?: string | null
          member_id?: number
          mobile_phone?: string | null
        }
        Update: {
          birth_date?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          house_id?: string
          is_parent?: boolean
          is_primary?: boolean
          last_name?: string | null
          member_id?: number
          mobile_phone?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "member_house_id_fkey"
            columns: ["house_id"]
            isOneToOne: false
            referencedRelation: "house"
            referencedColumns: ["house_id"]
          },
        ]
      }
      task: {
        Row: {
          assignee_id: number
          created_at: string
          due_date: string | null
          is_open: boolean
          is_visible: boolean
          priority: number
          task_description: string
          task_id: number
        }
        Insert: {
          assignee_id: number
          created_at?: string
          due_date?: string | null
          is_open?: boolean
          is_visible?: boolean
          priority?: number
          task_description: string
          task_id?: number
        }
        Update: {
          assignee_id?: number
          created_at?: string
          due_date?: string | null
          is_open?: boolean
          is_visible?: boolean
          priority?: number
          task_description?: string
          task_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "task_assignee_id_fkey"
            columns: ["assignee_id"]
            isOneToOne: false
            referencedRelation: "member"
            referencedColumns: ["member_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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
