import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'

type CoefficientType = 'land_type' | 'location' | 'area' | 'depth' | 'feng_shui'

const tableMap: Record<CoefficientType, string> = {
  land_type: 'land_type_coefficients',
  location: 'location_coefficients',
  area: 'area_coefficients',
  depth: 'depth_coefficients',
  feng_shui: 'feng_shui_coefficients',
}

/**
 * GET /api/admin/coefficients?type=land_type - Get coefficients by type (admin only)
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
    const type = searchParams.get('type') as CoefficientType

    if (!type || !tableMap[type]) {
      return NextResponse.json(
        { error: 'Invalid coefficient type. Use: land_type, location, area, depth, feng_shui' },
        { status: 400 }
      )
    }

    const tableName = tableMap[type]

    const { data, error } = await supabaseAdmin
      .from(tableName)
      .select('*')
      .order('sort_order', { ascending: true })

    if (error) {
      console.error(`Error fetching ${type} coefficients:`, error)
      return NextResponse.json({ error: 'Failed to fetch coefficients' }, { status: 500 })
    }

    return NextResponse.json({ data: data || [] })
  } catch (error) {
    console.error('Coefficients GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/coefficients - Create a new coefficient (admin only)
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

    const searchParams = request.nextUrl.searchParams
    const type = searchParams.get('type') as CoefficientType

    if (!type || !tableMap[type]) {
      return NextResponse.json(
        { error: 'Invalid coefficient type' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const tableName = tableMap[type]

    // Validate required fields
    if (!body.code || !body.name) {
      return NextResponse.json({ error: 'Mã và tên là bắt buộc' }, { status: 400 })
    }

    // Get max sort_order
    const { data: maxOrder } = await supabaseAdmin
      .from(tableName)
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1)
      .single()

    const nextOrder = (maxOrder?.sort_order || 0) + 1

    // Build insert data based on coefficient type
    // Note: area_coefficients and depth_coefficients don't have 'description' column
    let insertData: Record<string, unknown> = {
      code: body.code,
      name: body.name,
      coefficient: body.coefficient || 1,
      sort_order: nextOrder,
    }

    // Add type-specific fields
    if (type === 'land_type' || type === 'feng_shui') {
      insertData.description = body.description || null
    } else if (type === 'location') {
      insertData.description = body.description || null
      insertData.width_min = body.width_min || 0
      insertData.width_max = body.width_max || 0
    } else if (type === 'area') {
      insertData.area_min = body.area_min || 0
      insertData.area_max = body.area_max || 0
    } else if (type === 'depth') {
      insertData.depth_min = body.depth_min || 0
      insertData.depth_max = body.depth_max || 0
    }

    // Create coefficient
    const { data, error } = await supabaseAdmin
      .from(tableName)
      .insert(insertData)
      .select('*')
      .single()

    if (error) {
      console.error(`Error creating ${type} coefficient:`, error)
      return NextResponse.json({ error: `Không thể tạo hệ số: ${error.message}` }, { status: 500 })
    }

    return NextResponse.json({ data }, { status: 201 })
  } catch (error) {
    console.error('Coefficients POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/coefficients?type=land_type - Delete all coefficients of a type (admin only)
 * If type=all, deletes ALL coefficient types
 */
export async function DELETE(request: NextRequest) {
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
    const type = searchParams.get('type')

    if (type === 'all') {
      // Delete all coefficient types
      for (const tableName of Object.values(tableMap)) {
        const { error } = await supabaseAdmin
          .from(tableName)
          .delete()
          .neq('id', '00000000-0000-0000-0000-000000000000')

        if (error) {
          console.error(`Error deleting ${tableName}:`, error)
          return NextResponse.json({ error: `Failed to delete ${tableName}` }, { status: 500 })
        }
      }
      return NextResponse.json({ success: true, message: 'Đã xóa tất cả hệ số' })
    }

    if (!type || !tableMap[type as CoefficientType]) {
      return NextResponse.json(
        { error: 'Invalid coefficient type. Use: land_type, location, area, depth, feng_shui, or all' },
        { status: 400 }
      )
    }

    const tableName = tableMap[type as CoefficientType]

    const { error } = await supabaseAdmin
      .from(tableName)
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) {
      console.error(`Error deleting ${type} coefficients:`, error)
      return NextResponse.json({ error: 'Failed to delete coefficients' }, { status: 500 })
    }

    return NextResponse.json({ success: true, message: `Đã xóa tất cả hệ số ${type}` })
  } catch (error) {
    console.error('Coefficients DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
