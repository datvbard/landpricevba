'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import Sidebar from '@/components/admin/sidebar'
import { signOut } from '@/lib/auth/auth-client'

// Icons
const MenuIcon = () => (
  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16"/>
  </svg>
)

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
  </svg>
)

const BellIcon = () => (
  <svg className="w-[22px] h-[22px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
  </svg>
)

const LogoutIcon = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
  </svg>
)

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter()
  const { user, isLoading, isAuthenticated, isAdmin } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (!isAdmin) {
        // Non-admin trying to access admin pages
        router.push('/')
      }
    }
  }, [isLoading, isAuthenticated, isAdmin, router])

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

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-sm text-gray-500">Đang tải...</span>
        </div>
      </div>
    )
  }

  // Not authorized
  if (!isAuthenticated || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content */}
      <main className="flex-1 lg:ml-[280px] min-h-screen flex flex-col">
        {/* Top Bar */}
        <header className="bg-white px-4 lg:px-6 py-4 flex items-center justify-between border-b border-gray-200 sticky top-0 z-30 shadow-sm">
          {/* Mobile menu button + Page title */}
          <div className="flex items-center gap-4">
            <button
              className="lg:hidden w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-200 transition-colors"
              onClick={() => setSidebarOpen(true)}
            >
              <MenuIcon />
            </button>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-3">
            {/* Search box - hidden on mobile */}
            <div className="hidden md:block relative w-[300px]">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-2 border-transparent rounded-lg text-sm focus:outline-none focus:bg-white focus:border-primary transition-colors"
              />
            </div>

            {/* Notifications */}
            <button className="w-11 h-11 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-primary transition-colors relative">
              <BellIcon />
              <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />
            </button>

            {/* User Info */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-semibold">
                  {user?.name?.charAt(0) || user?.email?.charAt(0) || 'A'}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-700 max-w-[100px] truncate">
                {user?.name || user?.email}
              </span>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-11 h-11 bg-gray-50 rounded-lg flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
              title="Đăng xuất"
            >
              <LogoutIcon />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  )
}
