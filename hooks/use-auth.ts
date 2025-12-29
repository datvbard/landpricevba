'use client'

import { useSession } from '@/lib/auth/auth-client'

// Extended user type with custom fields
type UserWithRole = {
  id: string
  name: string
  email: string
  role?: 'admin' | 'user'
  phone?: string
  full_name?: string
  is_active?: boolean
}

/**
 * Custom hook for authentication
 * Wraps Better Auth's useSession with additional helpers
 */
export function useAuth() {
  const { data: session, isPending, error } = useSession()

  // Cast user to include custom fields
  const user = session?.user as UserWithRole | null

  return {
    user,
    session,
    isLoading: isPending,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    error,
  }
}

export type AuthUser = UserWithRole
