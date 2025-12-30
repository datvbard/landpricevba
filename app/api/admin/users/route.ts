import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/admin/users - Fetch all users (admin only)
 * Query params: search (optional)
 */
export async function GET(request: Request) {
  try {
    // Verify admin session
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role from Better Auth 'user' table
    const { data: adminUser } = await supabaseAdmin
      .from('user')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    // Get search param
    const { searchParams } = new URL(request.url)
    const search = searchParams.get('search')

    // Build query - use 'user' table (Better Auth uses camelCase)
    let query = supabaseAdmin
      .from('user')
      .select('id, email, name, phone, role, full_name, is_active, createdAt, updatedAt', { count: 'exact' })
      .order('createdAt', { ascending: false })

    // Apply search filter
    if (search) {
      query = query.or(`email.ilike.%${search}%,full_name.ilike.%${search}%,phone.ilike.%${search}%`)
    }

    const { data, error, count } = await query

    if (error) {
      console.error('Error fetching users:', error)
      return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 })
    }

    return NextResponse.json({ data: data || [], total: count || 0 })
  } catch (error) {
    console.error('Users GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/users - Create a new user (admin only)
 */
export async function POST(request: Request) {
  try {
    // Verify admin session
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role from Better Auth 'user' table
    const { data: adminUser } = await supabaseAdmin
      .from('user')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { email, phone, password, role, full_name, is_active } = body

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email và mật khẩu là bắt buộc' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Email không hợp lệ' }, { status: 400 })
    }

    // Validate password length
    if (password.length < 8) {
      return NextResponse.json(
        { error: 'Mật khẩu phải có ít nhất 8 ký tự' },
        { status: 400 }
      )
    }

    // Use Better Auth's sign-up API to create user (ensures proper password hashing)
    const signUpResult = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: full_name || email.split('@')[0],
      },
    })

    if (!signUpResult?.user?.id) {
      return NextResponse.json({ error: 'Không thể tạo tài khoản' }, { status: 500 })
    }

    // Update additional fields in user table
    const { data, error } = await supabaseAdmin
      .from('user')
      .update({
        phone: phone || null,
        role: role || 'user',
        full_name: full_name || null,
        is_active: is_active ?? true,
      })
      .eq('id', signUpResult.user.id)
      .select('id, email, name, phone, role, full_name, is_active, createdAt, updatedAt')
      .single()

    if (error) {
      // Check for duplicate email
      if (error.code === '23505') {
        return NextResponse.json({ error: 'Email đã tồn tại' }, { status: 409 })
      }
      console.error('Error creating user:', error)
      return NextResponse.json({ error: 'Failed to create user' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Users POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
