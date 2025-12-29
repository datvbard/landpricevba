import { createAuthClient } from 'better-auth/react'

/**
 * Better Auth client for client-side usage
 * - Sign in/out methods
 * - Session management
 * - React hooks
 */
export const authClient = createAuthClient({
  // Use current origin for dev (handles dynamic port) or env var for production
  baseURL: typeof window !== 'undefined'
    ? window.location.origin
    : process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
})

export const { signIn, signOut, useSession } = authClient
