/**
 * Admin Dynamic Coefficients API Client
 * Functions for managing coefficient types and values dynamically
 */
import type { CoefficientType, CoefficientValue } from '@/lib/supabase/database.types'

// Extended type with nested type info
export interface CoefficientValueWithType extends CoefficientValue {
  type: Pick<CoefficientType, 'id' | 'code' | 'name' | 'has_range' | 'range_field_name' | 'range_unit' | 'has_description'>
}

// ============================================================================
// Coefficient Types API
// ============================================================================

/**
 * Get all coefficient types
 */
export async function getCoefficientTypes(): Promise<CoefficientType[]> {
  const res = await fetch('/api/admin/coefficient-types')
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Không thể tải loại hệ số')
  }
  const result = await res.json()
  return result.data
}

/**
 * Create a new coefficient type
 */
export interface CreateCoefficientTypeInput {
  code: string
  name: string
  description?: string | null
  has_range?: boolean
  range_field_name?: string | null
  range_unit?: string | null
  has_description?: boolean
}

export async function createCoefficientType(data: CreateCoefficientTypeInput): Promise<CoefficientType> {
  const res = await fetch('/api/admin/coefficient-types', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Không thể tạo loại hệ số')
  }
  const result = await res.json()
  return result.data
}

/**
 * Update a coefficient type
 */
export interface UpdateCoefficientTypeInput {
  name?: string
  description?: string | null
  has_range?: boolean
  range_field_name?: string | null
  range_unit?: string | null
  has_description?: boolean
  sort_order?: number
  is_active?: boolean
}

export async function updateCoefficientType(id: string, data: UpdateCoefficientTypeInput): Promise<CoefficientType> {
  const res = await fetch(`/api/admin/coefficient-types/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Không thể cập nhật loại hệ số')
  }
  const result = await res.json()
  return result.data
}

/**
 * Delete a coefficient type
 */
export async function deleteCoefficientType(id: string): Promise<void> {
  const res = await fetch(`/api/admin/coefficient-types/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Không thể xóa loại hệ số')
  }
}

// ============================================================================
// Coefficient Values API
// ============================================================================

/**
 * Get coefficient values by type
 */
export async function getCoefficientValues(typeId?: string, typeCode?: string): Promise<CoefficientValueWithType[]> {
  const params = new URLSearchParams()
  if (typeId) params.set('typeId', typeId)
  if (typeCode) params.set('typeCode', typeCode)

  const res = await fetch(`/api/admin/coefficient-values?${params.toString()}`)
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Không thể tải hệ số')
  }
  const result = await res.json()
  return result.data
}

/**
 * Create a new coefficient value
 */
export interface CreateCoefficientValueInput {
  type_id: string
  code: string
  name: string
  description?: string | null
  coefficient?: number
  range_min?: number | null
  range_max?: number | null
}

export async function createCoefficientValue(data: CreateCoefficientValueInput): Promise<CoefficientValueWithType> {
  const res = await fetch('/api/admin/coefficient-values', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Không thể tạo hệ số')
  }
  const result = await res.json()
  return result.data
}

/**
 * Update a coefficient value
 */
export interface UpdateCoefficientValueInput {
  name?: string
  description?: string | null
  coefficient?: number
  range_min?: number | null
  range_max?: number | null
  sort_order?: number
}

export async function updateCoefficientValue(id: string, data: UpdateCoefficientValueInput): Promise<CoefficientValueWithType> {
  const res = await fetch(`/api/admin/coefficient-values/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Không thể cập nhật hệ số')
  }
  const result = await res.json()
  return result.data
}

/**
 * Delete a coefficient value
 */
export async function deleteCoefficientValue(id: string): Promise<void> {
  const res = await fetch(`/api/admin/coefficient-values/${id}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Không thể xóa hệ số')
  }
}

/**
 * Delete all coefficient values of a type
 */
export async function deleteAllCoefficientValues(typeId: string): Promise<void> {
  const res = await fetch(`/api/admin/coefficient-values?typeId=${typeId}`, {
    method: 'DELETE',
  })
  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Không thể xóa hệ số')
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Format coefficient for display
 */
export function formatCoefficient(value: number): string {
  return value.toFixed(2)
}

/**
 * Get range label based on type configuration
 */
export function getRangeLabel(type: Pick<CoefficientType, 'range_field_name' | 'range_unit'>): string {
  if (!type.range_field_name) return 'Khoảng'

  const labels: Record<string, string> = {
    area: 'Diện tích',
    depth: 'Chiều sâu',
    width: 'Độ rộng',
  }

  return labels[type.range_field_name] || type.range_field_name
}
