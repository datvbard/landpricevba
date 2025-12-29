import { NextRequest, NextResponse } from 'next/server'
import { getSessionCookie } from 'better-auth/cookies'

/**
 * Next.js Middleware for route protection
 * - Public: /login, /api/auth/*
 * - Protected: /, /admin/*
 * - Uses cookie-based session check (fast, no DB call)
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes - allow without auth
  const publicRoutes = ['/login', '/api/auth']
  const isPublic = publicRoutes.some(route => pathname.startsWith(route))

  if (isPublic) {
    return NextResponse.next()
  }

  // Check session cookie
  const sessionCookie = getSessionCookie(request)

  // No session - redirect to login
  if (!sessionCookie) {
    const loginUrl = new URL('/login', request.url)
    return NextResponse.redirect(loginUrl)
  }

  // Has session - allow access
  // Note: Role-based checks are done in layout components
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all routes except static files and images
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.svg$).*)',
  ],
}
