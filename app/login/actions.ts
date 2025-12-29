'use server'

import { auth } from '@/lib/auth/auth'
import { supabaseAdmin } from '@/lib/supabase/server'
import { normalizeEmailOrPhone, isValidPassword } from '@/lib/auth/validators'
import { headers } from 'next/headers'

export type LoginResult = {
  success: boolean
  error?: string
  redirectTo?: string
}

/**
 * Server action for user login
 * - Validates email/phone format
 * - Checks user exists and is active
 * - Authenticates via Better Auth
 * - Returns redirect path based on role
 */
export async function loginAction(
  identifier: string,
  password: string
): Promise<LoginResult> {
  try {
    // Validate inputs
    if (!identifier || !password) {
      return { success: false, error: 'Vui lòng nhập đầy đủ thông tin' }
    }

    if (!isValidPassword(password)) {
      return { success: false, error: 'Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường và số' }
    }

    // Normalize identifier (email or phone)
    const normalized = normalizeEmailOrPhone(identifier)
    if (normalized.type === 'invalid') {
      return { success: false, error: 'Email hoặc số điện thoại không đúng định dạng' }
    }

    // Query user from database
    const query = normalized.type === 'email'
      ? supabaseAdmin.from('users').select('*').eq('email', normalized.value).single()
      : supabaseAdmin.from('users').select('*').eq('phone', normalized.value).single()

    const { data: user, error: userError } = await query

    // Generic error to prevent user enumeration
    if (userError || !user) {
      return { success: false, error: 'Email/số điện thoại hoặc mật khẩu không chính xác' }
    }

    // Check if user is active (use generic error)
    if (!user.is_active) {
      return { success: false, error: 'Email/số điện thoại hoặc mật khẩu không chính xác' }
    }

    // Authenticate via Better Auth
    const result = await auth.api.signInEmail({
      body: {
        email: user.email,
        password: password,
      },
      headers: await headers(),
    })

    if (!result) {
      return { success: false, error: 'Email/số điện thoại hoặc mật khẩu không chính xác' }
    }

    // Determine redirect based on role
    const redirectTo = user.role === 'admin' ? '/admin/dashboard' : '/'

    return { success: true, redirectTo }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Đã xảy ra lỗi, vui lòng thử lại' }
  }
}
