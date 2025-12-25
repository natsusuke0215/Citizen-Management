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

  // Account Management: Only TEAM_LEADER can access
  if (pathname.startsWith('/dashboard/accounts')) {
    if (role !== 'TEAM_LEADER' && role !== 'ADMIN' && role !== 'LEADER') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Household Management: TEAM_LEADER and DEPUTY only
  if (pathname.startsWith('/dashboard/households')) {
    if (role !== 'TEAM_LEADER' && role !== 'ADMIN' && role !== 'LEADER' && role !== 'DEPUTY') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // Resident Management (Persons): TEAM_LEADER and DEPUTY only
  if (pathname.startsWith('/dashboard/persons')) {
    if (role !== 'TEAM_LEADER' && role !== 'ADMIN' && role !== 'LEADER' && role !== 'DEPUTY') {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  // FACILITY_MANAGER: Additional restrictions for other paths
  if (role === 'FACILITY_MANAGER') {
    const restrictedPaths = [
      '/dashboard/districts',
      '/dashboard/requests',
      '/dashboard/my-household',
    ]

    if (restrictedPaths.some(path => pathname.startsWith(path))) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|assets|favicon.ico).*)',
  ],
}
