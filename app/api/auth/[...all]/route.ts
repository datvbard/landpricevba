import { auth } from '@/lib/auth/auth'
import { toNextJsHandler } from 'better-auth/next-js'

/**
 * Better Auth API route handler
 * Handles all auth endpoints: /api/auth/*
 * - POST /api/auth/sign-in/email
 * - POST /api/auth/sign-out
 * - GET /api/auth/session
 */
export const { GET, POST } = toNextJsHandler(auth)
