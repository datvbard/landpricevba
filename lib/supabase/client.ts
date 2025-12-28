import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

/**
 * Supabase client for client-side usage
 * - Uses anon key (respects RLS policies)
 * - Safe to use in React components
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
