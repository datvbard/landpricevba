/**
 * Coefficients API Functions
 * Fetch all coefficient types from Supabase
 */
import { supabase } from '@/lib/supabase/client'
import type {
  LandTypeCoefficient,
  LocationCoefficient,
  AreaCoefficient,
  DepthCoefficient,
  FengShuiCoefficient,
} from '@/lib/supabase/database.types'

export interface AllCoefficients {
  landTypes: LandTypeCoefficient[]
  locations: LocationCoefficient[]
  areas: AreaCoefficient[]
  depths: DepthCoefficient[]
  fengShuis: FengShuiCoefficient[]
}

export async function getAllCoefficients(): Promise<AllCoefficients> {
  const [landTypes, locations, areas, depths, fengShuis] = await Promise.all([
    getLandTypeCoefficients(),
    getLocationCoefficients(),
    getAreaCoefficients(),
    getDepthCoefficients(),
    getFengShuiCoefficients(),
  ])

  return { landTypes, locations, areas, depths, fengShuis }
}

export async function getLandTypeCoefficients(): Promise<LandTypeCoefficient[]> {
  const { data, error } = await supabase
    .from('land_type_coefficients')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching land type coefficients:', error)
    return []
  }
  return data || []
}

export async function getLocationCoefficients(): Promise<LocationCoefficient[]> {
  const { data, error } = await supabase
    .from('location_coefficients')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching location coefficients:', error)
    return []
  }
  return data || []
}

export async function getAreaCoefficients(): Promise<AreaCoefficient[]> {
  const { data, error } = await supabase
    .from('area_coefficients')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching area coefficients:', error)
    return []
  }
  return data || []
}

export async function getDepthCoefficients(): Promise<DepthCoefficient[]> {
  const { data, error } = await supabase
    .from('depth_coefficients')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching depth coefficients:', error)
    return []
  }
  return data || []
}

export async function getFengShuiCoefficients(): Promise<FengShuiCoefficient[]> {
  const { data, error } = await supabase
    .from('feng_shui_coefficients')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching feng shui coefficients:', error)
    return []
  }
  return data || []
}
