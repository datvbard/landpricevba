import { NextResponse } from 'next/server'
import { auth } from '@/lib/auth/auth'
import { headers } from 'next/headers'
import { supabaseAdmin } from '@/lib/supabase/server'

/**
 * DELETE /api/admin/clear-districts - Force delete all districts (admin only)
 */
export async function DELETE() {
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

    // Delete in order: segments -> streets -> districts
    console.log('Deleting all segments...')
    const { error: segErr, data: segData } = await supabaseAdmin
      .from('segments')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select()

    if (segErr) {
      console.error('Error deleting segments:', segErr)
      return NextResponse.json({ error: 'Failed to delete segments', details: segErr }, { status: 500 })
    }

    console.log('Deleting all streets...')
    const { error: streetErr, data: streetData } = await supabaseAdmin
      .from('streets')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select()

    if (streetErr) {
      console.error('Error deleting streets:', streetErr)
      return NextResponse.json({ error: 'Failed to delete streets', details: streetErr }, { status: 500 })
    }

    console.log('Deleting all districts...')
    const { error: distErr, data: distData } = await supabaseAdmin
      .from('districts')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')
      .select()

    if (distErr) {
      console.error('Error deleting districts:', distErr)
      return NextResponse.json({ error: 'Failed to delete districts', details: distErr }, { status: 500 })
    }

    // Verify deletion
    const { data: remaining } = await supabaseAdmin
      .from('districts')
      .select('id')

    return NextResponse.json({
      success: true,
      deleted: {
        segments: segData?.length || 0,
        streets: streetData?.length || 0,
        districts: distData?.length || 0,
      },
      remainingDistricts: remaining?.length || 0,
    })
  } catch (error) {
    console.error('Clear districts error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
