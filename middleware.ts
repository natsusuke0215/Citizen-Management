import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { decodeTokenOnly } from '@/lib/auth'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value
  const { pathname } = request.nextUrl
  
  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register', '/']
  const isPublicRoute = publicRoutes.some(route => pathname === route || pathname.startsWith(route + '/'))
  
  if (isPublicRoute) {
    return NextResponse.next()
  }
  
  // Check if user is authenticated
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  const user = decodeTokenOnly(token)
  
  if (!user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // Role-based Access Control
  const role = user.role

  // FACILITY_MANAGER Restrictions
  if (role === 'FACILITY_MANAGER') {
    // List of restricted paths (starts with)
    const restrictedPaths = [
      '/dashboard/households',
      '/dashboard/persons',
      '/dashboard/districts',
      '/dashboard/requests',
      '/dashboard/my-household',
    ]

    if (restrictedPaths.some(path => pathname.startsWith(path))) {
       // Redirect to allowed area
       return NextResponse.redirect(new URL('/dashboard/cultural-centers', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
  ],
}
