import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

/**
 * Supabase admin client for server-side usage only
 * - Uses service_role key (bypasses RLS)
 * - NEVER expose this client to client-side code
 * - Use in API routes, Server Components, Server Actions
 */
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey)
