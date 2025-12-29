import { betterAuth } from 'better-auth'
import { Pool } from 'pg'
import { nextCookies } from 'better-auth/next-js'

/**
 * Better Auth configuration for Land Price App
 * - Uses PostgreSQL (Supabase) as database
 * - Email/password authentication
 * - Role-based access (admin/user)
 */
export const auth = betterAuth({
  database: new Pool({
    connectionString: process.env.DATABASE_URL,
  }),
  emailAndPassword: {
    enabled: true,
    // Password is hashed using scrypt by Better Auth
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'user',
      },
      phone: {
        type: 'string',
        required: false,
      },
      full_name: {
        type: 'string',
        required: false,
      },
      is_active: {
        type: 'boolean',
        required: false,
        defaultValue: true,
      },
    },
  },
  plugins: [nextCookies()],
})

export type Session = typeof auth.$Infer.Session
export type User = typeof auth.$Infer.Session.user
