import { NextResponse } from 'next/server'
import { getAllCoefficients } from '@/lib/api/coefficients'

export async function GET() {
  const coefficients = await getAllCoefficients()
  return NextResponse.json(coefficients)
}
