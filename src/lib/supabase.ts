import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'http://localhost:54321'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'dummy-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  full_name: string | null
  roll_no: string | null
  timezone: string
  created_at: string
  updated_at: string
}

export interface Course {
  id: string
  owner: string
  title: string
  created_at: string
  updated_at: string
}

export interface Session {
  id: string
  course_id: string
  date: string
  status: 'present' | 'late' | 'absent' | 'excused'
  created_at: string
  updated_at: string
}

export interface DutyLeave {
  id: string
  user_id: string
  from_date: string
  to_date: string
  reason: string | null
  file_path: string | null
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
  updated_at: string
}
