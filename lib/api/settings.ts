/**
 * Brand Settings API Client
 * - Handles fetching and updating brand settings (app_name, branch_name, slogan, logo_url)
 * - Provides type-safe interfaces for brand settings operations
 */

export interface BrandSettings {
  app_name: string
  branch_name: string
  slogan: string
  logo_url: string | null
}

/**
 * Fetch current brand settings from the database
 */
export async function getSettings(): Promise<BrandSettings> {
  const res = await fetch('/api/admin/settings', {
    method: 'GET',
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error('Failed to fetch settings')
  }

  return res.json()
}

/**
 * Update brand settings (app_name, branch_name, slogan)
 */
export async function updateSettings(data: Partial<BrandSettings>): Promise<BrandSettings> {
  const res = await fetch('/api/admin/settings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to update settings')
  }

  return res.json()
}

/**
 * Upload logo file to Supabase Storage
 * Returns the public URL of the uploaded logo
 */
export async function uploadLogo(file: File): Promise<{ logo_url: string }> {
  const formData = new FormData()
  formData.append('file', file)

  const res = await fetch('/api/admin/settings/logo', {
    method: 'POST',
    body: formData,
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to upload logo')
  }

  return res.json()
}

/**
 * Delete logo from Supabase Storage
 */
export async function deleteLogo(): Promise<void> {
  const res = await fetch('/api/admin/settings/logo', {
    method: 'DELETE',
  })

  if (!res.ok) {
    const error = await res.json()
    throw new Error(error.error || 'Failed to delete logo')
  }
}
