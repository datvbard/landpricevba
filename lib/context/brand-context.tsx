'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'

export interface BrandSettings {
  app_name: string
  branch_name: string
  slogan: string
  logo_url: string | null
}

interface BrandContextType {
  settings: BrandSettings
  isLoading: boolean
  error: string | null
  refresh: () => Promise<void>
}

const defaultSettings: BrandSettings = {
  app_name: 'Agribank',
  branch_name: 'Trà Vinh',
  slogan: 'Tra Cứu Giá Đất',
  logo_url: null,
}

const BrandContext = createContext<BrandContextType>({
  settings: defaultSettings,
  isLoading: true,
  error: null,
  refresh: async () => {},
})

export function BrandProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BrandSettings>(defaultSettings)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchSettings = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const res = await fetch('/api/admin/settings', { cache: 'no-store' })
      if (!res.ok) throw new Error('Failed to fetch settings')
      const data = await res.json()
      setSettings({
        app_name: data.app_name || defaultSettings.app_name,
        branch_name: data.branch_name || defaultSettings.branch_name,
        slogan: data.slogan || defaultSettings.slogan,
        logo_url: data.logo_url,
      })
    } catch (err) {
      console.error('Error fetching brand settings:', err)
      setError(err instanceof Error ? err.message : 'Unknown error')
      // Keep default settings on error
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  return (
    <BrandContext.Provider value={{ settings, isLoading, error, refresh: fetchSettings }}>
      {children}
    </BrandContext.Provider>
  )
}

export function useBrand() {
  const context = useContext(BrandContext)
  if (!context) {
    throw new Error('useBrand must be used within a BrandProvider')
  }
  return context
}

/**
 * Get full brand name (app_name + branch_name)
 */
export function useFullBrandName() {
  const { settings } = useBrand()
  return settings.branch_name
    ? `${settings.app_name} ${settings.branch_name}`
    : settings.app_name
}
