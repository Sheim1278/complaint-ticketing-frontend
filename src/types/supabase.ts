export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          username: string
          role: 'student' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          username: string
          role?: 'student' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          username?: string
          role?: 'student' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      complaints: {
        Row: {
          id: string
          title: string
          description: string
          category: 'academic' | 'technical' | 'facilities' | 'other'
          status: 'pending' | 'in-progress' | 'resolved'
          priority: 'low' | 'medium' | 'high'
          student_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          category: 'academic' | 'technical' | 'facilities' | 'other'
          status?: 'pending' | 'in-progress' | 'resolved'
          priority?: 'low' | 'medium' | 'high'
          student_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          category?: 'academic' | 'technical' | 'facilities' | 'other'
          status?: 'pending' | 'in-progress' | 'resolved'
          priority?: 'low' | 'medium' | 'high'
          student_id?: string
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}