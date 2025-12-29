import { createAuthClient } from 'better-auth/react'

/**
 * Better Auth client for client-side usage
 * - Sign in/out methods
 * - Session management
 * - React hooks
 */
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
})

export const { signIn, signOut, useSession } = authClient
