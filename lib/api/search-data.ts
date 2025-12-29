/**
 * Search Data API Functions
 * Fetch districts, streets, segments from Supabase
 */
import { supabase } from '@/lib/supabase/client'
import type { District, Street, Segment } from '@/lib/supabase/database.types'

export async function getDistricts(): Promise<District[]> {
  const { data, error } = await supabase
    .from('districts')
    .select('*')
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('Error fetching districts:', error)
    return []
  }
  return data || []
}

export async function getStreetsByDistrict(districtId: string): Promise<Street[]> {
  const { data, error } = await supabase
    .from('streets')
    .select('*')
    .eq('district_id', districtId)
    .order('name', { ascending: true })

  if (error) {
    console.error('Error fetching streets:', error)
    return []
  }
  return data || []
}

export async function getSegmentsByStreet(streetId: string): Promise<Segment[]> {
  const { data, error } = await supabase
    .from('segments')
    .select('*')
    .eq('street_id', streetId)
    .order('segment_from', { ascending: true })

  if (error) {
    console.error('Error fetching segments:', error)
    return []
  }
  return data || []
}

export async function getSegmentById(segmentId: string): Promise<Segment | null> {
  const { data, error } = await supabase
    .from('segments')
    .select('*')
    .eq('id', segmentId)
    .single()

  if (error) {
    console.error('Error fetching segment:', error)
    return null
  }
  return data
}
