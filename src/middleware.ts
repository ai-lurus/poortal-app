import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/lib/supabase/middleware'
import { PROTECTED_ROUTES, ROLE_ROUTES } from '@/lib/constants'
import type { UserRole } from '@/types'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Refresh the auth session
  const { supabaseResponse, user, supabase } = await updateSession(request)

  // Check if the route requires authentication
  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  )

  if (isProtectedRoute && !user) {
    // Redirect to login with return URL
    const redirectUrl = new URL('/login', request.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Check role-based access
  if (user) {
    for (const [role, routes] of Object.entries(ROLE_ROUTES)) {
      const requiresRole = routes.some((route) => pathname.startsWith(route))
      if (requiresRole) {
        // Fetch user role from profile
        const { data } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .single()

        const profile = data as { role: UserRole } | null

        if (!profile || profile.role !== role) {
          // Admin can access everything
          if (profile?.role !== 'admin') {
            return NextResponse.redirect(new URL('/', request.url))
          }
        }
      }
    }
  }

  // Redirect logged-in users away from auth pages
  if (user && (pathname === '/login' || pathname === '/register')) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
