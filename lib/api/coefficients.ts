/**
 * Coefficients API Functions
 * Fetch all coefficient types from Supabase using the new dynamic structure
 */
import { supabase } from '@/lib/supabase/client'
import type { CoefficientType, CoefficientValue } from '@/lib/supabase/database.types'

// Legacy type aliases for backward compatibility
export type LandTypeCoefficient = CoefficientValue
export type LocationCoefficient = CoefficientValue
export type AreaCoefficient = CoefficientValue
export type DepthCoefficient = CoefficientValue
export type FengShuiCoefficient = CoefficientValue

export interface CoefficientValueWithType extends CoefficientValue {
  type: CoefficientType
}

export interface DynamicCoefficients {
  types: CoefficientType[]
  values: Record<string, CoefficientValue[]> // keyed by type code
}

// Legacy interface for backward compatibility
export interface AllCoefficients {
  landTypes: CoefficientValue[]
  locations: CoefficientValue[]
  areas: CoefficientValue[]
  depths: CoefficientValue[]
  fengShuis: CoefficientValue[]
}

/**
 * Get all coefficient types and their values (new dynamic API)
 */
export async function getDynamicCoefficients(): Promise<DynamicCoefficients> {
  // Fetch all types
  const { data: types, error: typesError } = await supabase
    .from('coefficient_types')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (typesError) {
    console.error('Error fetching coefficient types:', typesError)
    return { types: [], values: {} }
  }

  // Fetch all values
  const { data: values, error: valuesError } = await supabase
    .from('coefficient_values')
    .select('*, type:coefficient_types(id, code, name)')
    .order('sort_order', { ascending: true })

  if (valuesError) {
    console.error('Error fetching coefficient values:', valuesError)
    return { types: types || [], values: {} }
  }

  // Group values by type code
  const groupedValues: Record<string, CoefficientValue[]> = {}
  for (const value of values || []) {
    const typeCode = (value.type as { code: string })?.code
    if (typeCode) {
      if (!groupedValues[typeCode]) {
        groupedValues[typeCode] = []
      }
      groupedValues[typeCode].push(value)
    }
  }

  return {
    types: types || [],
    values: groupedValues,
  }
}

/**
 * Get coefficients by type code
 */
export async function getCoefficientsByTypeCode(typeCode: string): Promise<CoefficientValue[]> {
  const { data: type } = await supabase
    .from('coefficient_types')
    .select('id')
    .eq('code', typeCode)
    .single()

  if (!type) return []

  const { data, error } = await supabase
    .from('coefficient_values')
    .select('*')
    .eq('type_id', type.id)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error(`Error fetching ${typeCode} coefficients:`, error)
    return []
  }
  return data || []
}

/**
 * Legacy: Get all coefficients (backward compatible format)
 * Maps the new dynamic structure to the old static format
 */
export async function getAllCoefficients(): Promise<AllCoefficients> {
  const dynamic = await getDynamicCoefficients()

  return {
    landTypes: dynamic.values['land_type'] || [],
    locations: dynamic.values['location'] || [],
    areas: dynamic.values['area'] || [],
    depths: dynamic.values['depth'] || [],
    fengShuis: dynamic.values['feng_shui'] || [],
  }
}

// Legacy functions for backward compatibility
export async function getLandTypeCoefficients(): Promise<CoefficientValue[]> {
  return getCoefficientsByTypeCode('land_type')
}

export async function getLocationCoefficients(): Promise<CoefficientValue[]> {
  return getCoefficientsByTypeCode('location')
}

export async function getAreaCoefficients(): Promise<CoefficientValue[]> {
  return getCoefficientsByTypeCode('area')
}

export async function getDepthCoefficients(): Promise<CoefficientValue[]> {
  return getCoefficientsByTypeCode('depth')
}

export async function getFengShuiCoefficients(): Promise<CoefficientValue[]> {
  return getCoefficientsByTypeCode('feng_shui')
}

/**
 * Get all active coefficient types
 */
export async function getCoefficientTypes(): Promise<CoefficientType[]> {
  const { data, error } = await supabase
    .from('coefficient_types')
    .select('*')
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching coefficient types:', error)
    return []
  }
  return data || []
}
