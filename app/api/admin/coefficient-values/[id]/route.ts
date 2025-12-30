import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'

type Params = { params: Promise<{ id: string }> }

/**
 * PUT /api/admin/coefficient-values/[id] - Update a coefficient value (admin only)
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
    if (body.coefficient !== undefined) updateData.coefficient = body.coefficient
    if (body.range_min !== undefined) updateData.range_min = body.range_min
    if (body.range_max !== undefined) updateData.range_max = body.range_max
    if (body.sort_order !== undefined) updateData.sort_order = body.sort_order

    if (Object.keys(updateData).length === 0) {
      return NextResponse.json({ error: 'Không có dữ liệu để cập nhật' }, { status: 400 })
    }

    const { data, error } = await supabaseAdmin
      .from('coefficient_values')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        type:coefficient_types(id, code, name, has_range, range_field_name, range_unit, has_description)
      `)
      .single()

    if (error) {
      console.error('Error updating coefficient value:', error)
      return NextResponse.json({ error: `Không thể cập nhật: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error('Coefficient value PUT error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/coefficient-values/[id] - Delete a coefficient value (admin only)
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

    const { error } = await supabaseAdmin
      .from('coefficient_values')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting coefficient value:', error)
      return NextResponse.json({ error: `Không thể xóa: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: 'Đã xóa hệ số' })
  } catch (error) {
    console.error('Coefficient value DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
