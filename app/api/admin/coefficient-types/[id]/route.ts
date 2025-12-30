import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

/**
 * GET /api/admin/coefficient-types/[id] - Get a single coefficient type (admin only)
 */
export async function GET(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

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

    const { data, error } = await supabaseAdmin
      .from('coefficient_types')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !data) {
      return NextResponse.json({ error: 'Không tìm thấy loại hệ số' }, { status: 404 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Coefficient type GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * PUT /api/admin/coefficient-types/[id] - Update a coefficient type (admin only)
 */
export async function PUT(request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

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
    const updateData: Record<string, unknown> = {}

    // Only update provided fields
    if (body.name !== undefined) updateData.name = body.name
    if (body.description !== undefined) updateData.description = body.description
    if (body.has_range !== undefined) updateData.has_range = body.has_range
    if (body.range_field_name !== undefined) updateData.range_field_name = body.range_field_name
    if (body.range_unit !== undefined) updateData.range_unit = body.range_unit
    if (body.has_description !== undefined) updateData.has_description = body.has_description
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Không có dữ liệu để cập nhật' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('coefficient_types')
      .update(updateData)
      .eq('id', id)
      .select('*')
      .single()

    if (error) {
      console.error('Error updating coefficient type:', error)
      return NextResponse.json({ error: `Không thể cập nhật: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Coefficient type PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/coefficient-types/[id] - Delete a coefficient type (admin only)
 * WARNING: This will also delete all coefficient values of this type!
 */
export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const { id } = await params

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

    // Check if type exists and get value count
    const { data: typeData } = await supabaseAdmin
      .from('coefficient_types')
      .select('id, name')
      .eq('id', id)
      .single()

    if (!typeData) {
      return NextResponse.json({ error: 'Không tìm thấy loại hệ số' }, { status: 404 })
    }

    // Delete the type (cascade will delete values)
    const { error } = await supabaseAdmin
      .from('coefficient_types')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting coefficient type:', error)
      return NextResponse.json({ error: `Không thể xóa: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Đã xóa loại hệ số "${typeData.name}"` })
  } catch (error) {
    console.error('Coefficient type DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
