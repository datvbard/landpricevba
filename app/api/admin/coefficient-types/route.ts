import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/admin/coefficient-types - Get all coefficient types (admin only)
 */
export async function GET() {
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

    const { data, error } = await supabaseAdmin
      .from('coefficient_types')
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error('Error fetching coefficient types:', error)
      return NextResponse.json({ error: 'Failed to fetch coefficient types' }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('Coefficient types GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/coefficient-types - Create a new coefficient type (admin only)
 */
export async function POST(request: NextRequest) {
  try {
    // Verify admin session
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Check admin role
    const { data: adminUser } = await supabaseAdmin
      .from('user')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (adminUser?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 })
    }

    const body = await request.json()
    const { code, name, description, has_range, range_field_name, range_unit, has_description } = body

    // Validate required fields
    if (!code || !name) {
      return NextResponse.json({ error: 'Mã và tên là bắt buộc' }, { status: 400 })
    }

    // Check if code already exists
    const { data: existing } = await supabaseAdmin
      .from('coefficient_types')
      .select('id')
      .eq('code', code)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Mã loại hệ số đã tồn tại' }, { status: 400 })
    }

    // Get max sort_order
    const { data: maxOrder } = await supabaseAdmin
      .from('coefficient_types')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrder?.sort_order || 0) + 1

    const { data, error } = await supabaseAdmin
      .from('coefficient_types')
      .insert({
        code,
        name,
        description: description || null,
        has_range: has_range || false,
        range_field_name: range_field_name || null,
        range_unit: range_unit || null,
        has_description: has_description !== false, // Default true
        sort_order: nextOrder,
        is_active: true,
      })
      .select('*')
      .single()

    if (error) {
      console.error('Error creating coefficient type:', error)
      return NextResponse.json({ error: `Không thể tạo loại hệ số: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Coefficient types POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
