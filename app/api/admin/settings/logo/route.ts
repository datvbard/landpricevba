import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'

const VALID_TYPES = ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp']
const MAX_SIZE = 2 * 1024 * 1024 // 2MB

/**
 * POST /api/admin/settings/logo - Upload logo to Supabase Storage (admin only)
 * Accepts FormData with file field
 * Returns { logo_url: string }
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

    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json({ error: 'Không tìm thấy file' }, { status: 400 })
    }

    // Validate file type
    if (!VALID_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Định dạng file không hợp lệ. Chỉ chấp nhận PNG, JPG, SVG, WebP' },
        { status: 400 }
      )
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: 'Kích thước file quá lớn. Tối đa 2MB' },
        { status: 400 }
      )
    }

    // Generate unique filename (sanitized)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const timestamp = Date.now()
    const filename = `logo-${timestamp}.${ext}`

    // Convert File to ArrayBuffer
    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    // Upload to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from('logos')
      .upload(filename, buffer, {
        contentType: file.type,
        upsert: true, // Overwrite if exists
      })

    if (uploadError) {
      console.error('Storage upload error:', uploadError)
      // If bucket doesn't exist, try to create it
      if (uploadError.message?.includes('bucket') || uploadError.message?.includes('not found')) {
        return NextResponse.json(
          { error: 'Storage bucket "logos" chưa được tạo. Vui lòng liên hệ admin.' },
          { status: 500 }
        )
      }
      return NextResponse.json({ error: 'Lỗi upload file' }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('logos')
      .getPublicUrl(filename)

    const logo_url = urlData.publicUrl

    // Update brand_settings with new logo URL
    const { error: updateError } = await supabaseAdmin
      .from('brand_settings')
      .upsert(
        { key: 'logo_url', value: logo_url, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )

    if (updateError) {
      console.error('Error updating logo_url setting:', updateError)
      return NextResponse.json({ error: 'Lỗi cập nhật database' }, { status: 500 })
    }

    return NextResponse.json({ logo_url })
  } catch (error) {
    console.error('Logo upload error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/settings/logo - Delete logo from Supabase Storage (admin only)
 */
export async function DELETE() {
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

    // Get current logo URL
    const { data: setting } = await supabaseAdmin
      .from('brand_settings')
      .select('value')
      .eq('key', 'logo_url')
      .single()

    if (setting?.value) {
      // Extract filename from URL
      const url = new URL(setting.value)
      const pathParts = url.pathname.split('/')
      const filename = pathParts[pathParts.length - 1]

      // Delete from storage
      if (filename) {
        await supabaseAdmin.storage.from('logos').remove([filename])
      }
    }

    // Update brand_settings to null
    const { error } = await supabaseAdmin
      .from('brand_settings')
      .upsert(
        { key: 'logo_url', value: null, updated_at: new Date().toISOString() },
        { onConflict: 'key' }
      )

    if (error) {
      console.error('Error clearing logo_url setting:', error)
      return NextResponse.json({ error: 'Lỗi cập nhật database' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logo delete error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
