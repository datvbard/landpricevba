import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * GET /api/admin/coefficient-values?typeId=xxx - Get coefficient values by type (admin only)
 */
export async function GET(request: NextRequest) {
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

    // Parse query params
    const searchParams = request.nextUrl.searchParams
    const typeId = searchParams.get('typeId')
    const typeCode = searchParams.get('typeCode')

    let query = supabaseAdmin
      .from('coefficient_values')
      .select(`
        *,
        type:coefficient_types(id, code, name, has_range, range_field_name, range_unit, has_description)
      `)
      .order('sort_order', { ascending: true })

    // Filter by type ID or code
    if (typeId) {
      query = query.eq('type_id', typeId)
    } else if (typeCode) {
      // Need to get type ID from code first
      const { data: typeData } = await supabaseAdmin
        .from('coefficient_types')
        .select('id')
        .eq('code', typeCode)
        .single()

      if (!typeData) {
        return NextResponse.json({ error: 'Không tìm thấy loại hệ số' }, { status: 404 })
      }
      query = query.eq('type_id', typeData.id)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching coefficient values:', error)
      return NextResponse.json({ error: 'Failed to fetch coefficient values' }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('Coefficient values GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/coefficient-values - Create a new coefficient value (admin only)
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
    const { type_id, code, name, description, coefficient, range_min, range_max } = body

    // Validate required fields
    if (!type_id || !code || !name) {
      return NextResponse.json({ error: 'Loại hệ số, mã và tên là bắt buộc' }, { status: 400 })
    }

    // Check if code already exists for this type
    const { data: existing } = await supabaseAdmin
      .from('coefficient_values')
      .select('id')
      .eq('type_id', type_id)
      .eq('code', code)
      .single()

    if (existing) {
      return NextResponse.json({ error: 'Mã hệ số đã tồn tại trong loại này' }, { status: 400 })
    }

    // Get max sort_order for this type
    const { data: maxOrder } = await supabaseAdmin
      .from('coefficient_values')
      .select('sort_order')
      .eq('type_id', type_id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrder?.sort_order || 0) + 1

    const { data, error } = await supabaseAdmin
      .from('coefficient_values')
      .insert({
        type_id,
        code,
        name,
        description: description || null,
        coefficient: coefficient || 1,
        range_min: range_min || null,
        range_max: range_max || null,
        sort_order: nextOrder,
      })
      .select(`
        *,
        type:coefficient_types(id, code, name, has_range, range_field_name, range_unit, has_description)
      `)
      .single()

    if (error) {
      console.error('Error creating coefficient value:', error)
      return NextResponse.json({ error: `Không thể tạo hệ số: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Coefficient values POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/coefficient-values?typeId=xxx - Delete all coefficient values of a type (admin only)
 */
export async function DELETE(request: NextRequest) {
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

    const searchParams = request.nextUrl.searchParams
    const typeId = searchParams.get('typeId')

    if (!typeId) {
      return NextResponse.json({ error: 'typeId là bắt buộc' }, { status: 400 })
    }

    const { error } = await supabaseAdmin
      .from('coefficient_values')
      .delete()
      .eq('type_id', typeId)

    if (error) {
      console.error('Error deleting coefficient values:', error)
      return NextResponse.json({ error: 'Failed to delete coefficient values' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Đã xóa tất cả hệ số của loại này' })
  } catch (error) {
    console.error('Coefficient values DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
