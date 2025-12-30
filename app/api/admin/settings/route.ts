import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'

// Keys used in database - maps to UI fields
// app_name -> app_name (bank name display)
// branch_name -> branch_name
// slogan -> slogan
// logo_url -> logo_url
const DB_KEYS = ['app_name', 'branch_name', 'slogan', 'logo_url'] as const

/**
 * GET /api/admin/settings - Fetch brand settings (public)
 * Returns app_name, branch_name, slogan, logo_url as a single object
 */
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from('brand_settings')
      .select('key, value')

    if (error) {
      console.error('Error fetching brand settings:', error)
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 })
    }

    // Convert rows to object with default values
    const settings: Record<string, string | null> = {
      app_name: 'Agribank',
      branch_name: 'Trà Vinh',
      slogan: 'Tra Cứu Giá Đất',
      logo_url: null,
    }

    if (data) {
      for (const row of data) {
        // Handle both old and new key names
        if (row.key === 'app_name' || row.key === 'bank_name') {
          settings.app_name = row.value || settings.app_name
        } else if (DB_KEYS.includes(row.key as typeof DB_KEYS[number])) {
          settings[row.key] = row.value
        }
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * POST /api/admin/settings - Update brand settings (admin only)
 * Accepts: { app_name?, branch_name?, slogan?, logo_url? }
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

    // Validate input
    const updates: { key: string; value: string | null }[] = []

    if (body.app_name !== undefined) {
      if (typeof body.app_name !== 'string' || body.app_name.length > 100) {
        return NextResponse.json({ error: 'Tên ngân hàng không hợp lệ' }, { status: 400 })
      }
      updates.push({ key: 'app_name', value: body.app_name || 'Agribank' })
    }

    if (body.branch_name !== undefined) {
      if (typeof body.branch_name !== 'string' || body.branch_name.length > 100) {
        return NextResponse.json({ error: 'Tên chi nhánh không hợp lệ' }, { status: 400 })
      }
      updates.push({ key: 'branch_name', value: body.branch_name })
    }

    if (body.slogan !== undefined) {
      if (typeof body.slogan !== 'string' || body.slogan.length > 200) {
        return NextResponse.json({ error: 'Slogan không hợp lệ' }, { status: 400 })
      }
      updates.push({ key: 'slogan', value: body.slogan })
    }

    if (body.logo_url !== undefined) {
      if (body.logo_url !== null && typeof body.logo_url !== 'string') {
        return NextResponse.json({ error: 'URL logo không hợp lệ' }, { status: 400 })
      }
      updates.push({ key: 'logo_url', value: body.logo_url })
    }

    if (updates.length === 0) {
      return NextResponse.json({ error: 'Không có dữ liệu để cập nhật' }, { status: 400 })
    }

    // Upsert each setting
    for (const update of updates) {
      const { error } = await supabaseAdmin
        .from('brand_settings')
        .upsert(
          { key: update.key, value: update.value, updated_at: new Date().toISOString() },
          { onConflict: 'key' }
        )

      if (error) {
        console.error(`Error upserting ${update.key}:`, error)
        return NextResponse.json({ error: `Lỗi cập nhật ${update.key}` }, { status: 500 })
      }
    }

    // Fetch and return updated settings
    const { data } = await supabaseAdmin
      .from('brand_settings')
      .select('key, value')

    const settings: Record<string, string | null> = {
      app_name: 'Agribank',
      branch_name: 'Trà Vinh',
      slogan: 'Tra Cứu Giá Đất',
      logo_url: null,
    }

    if (data) {
      for (const row of data) {
        if (row.key === 'app_name' || row.key === 'bank_name') {
          settings.app_name = row.value || settings.app_name
        } else if (DB_KEYS.includes(row.key as typeof DB_KEYS[number])) {
          settings[row.key] = row.value
        }
      }
    }

    return NextResponse.json(settings)
  } catch (error) {
    console.error('Settings POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
