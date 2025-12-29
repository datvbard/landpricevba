'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { useAuth } from '@/hooks/use-auth'
import { useBrand } from '@/lib/context/brand-context'
import { signOut } from '@/lib/auth/auth-client'

// Default Agribank logo SVG
const DefaultLogo = () => (
  <svg viewBox="0 0 50 50" className="w-full h-full">
    <path d="M25 5L40 15V35L25 45L10 35V15L25 5Z" fill="#AE1C3E"/>
    <path d="M25 12L33 17V27L25 32L17 27V17L25 12Z" fill="#D4AF37"/>
    <path d="M25 18L29 21V27L25 30L21 27V21L25 18Z" fill="white"/>
  </svg>
)

/**
 * Header component with branding and user info
 * - Displays logo and brand name from settings
 * - User name with role badge
 * - Logout button
 */
export default function Header() {
  const router = useRouter()
  const { user, isLoading, isAdmin } = useAuth()
  const { settings, isLoading: brandLoading } = useBrand()

  const handleLogout = async () => {
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login')
          router.refresh()
        },
      },
    })
  }

  if (isLoading) {
    return (
      <header className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex items-center justify-between max-w-[428px] mx-auto">
          <div className="h-6 w-32 bg-gray-200 animate-pulse rounded" />
          <div className="h-8 w-20 bg-gray-200 animate-pulse rounded" />
        </div>
      </header>
    )
  }

  if (!user) return null

  // Full brand name (app_name + branch_name)
  const brandName = settings.branch_name
    ? `${settings.app_name} ${settings.branch_name}`
    : settings.app_name

  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between max-w-[428px] mx-auto">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 flex-shrink-0">
            {settings.logo_url && !brandLoading ? (
              <Image
                src={settings.logo_url}
                alt={settings.app_name}
                width={32}
                height={32}
                className="w-full h-full object-contain"
                unoptimized
              />
            ) : (
              <DefaultLogo />
            )}
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-primary truncate max-w-[150px]">
              {brandName}
            </span>
            {isAdmin && (
              <span className="text-xs text-gray-500">Quản trị viên</span>
            )}
          </div>
        </div>

        {/* User + Logout */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-primary rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">
                {user.name?.charAt(0) || user.email?.charAt(0) || 'U'}
              </span>
            </div>
            <span className="text-xs text-gray-600 truncate max-w-[80px]">
              {user.name || user.email?.split('@')[0]}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 px-2 py-1.5 text-xs text-gray-600 hover:text-primary hover:bg-gray-50 rounded-lg transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
            </svg>
            <span className="hidden sm:inline">Đăng xuất</span>
          </button>
        </div>
      </div>
    </header>
  )
}
