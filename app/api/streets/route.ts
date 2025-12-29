import { NextResponse } from 'next/server'
import { getStreetsByDistrict } from '@/lib/api/search-data'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const districtId = searchParams.get('districtId')

  if (!districtId) {
    return NextResponse.json({ error: 'districtId is required' }, { status: 400 })
  }

  const streets = await getStreetsByDistrict(districtId)
  return NextResponse.json(streets)
}
