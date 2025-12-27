import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Không tìm thấy token' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)

    if (!user) {
      return NextResponse.json(
        { message: 'Token không hợp lệ' },
        { status: 401 }
      )
    }

    // Try to get sessions from database if Session model exists
    // Otherwise return mock data
    try {
      // Check if Session model exists in Prisma schema
      // @ts-ignore
      const sessions = await prisma.session?.findMany({
        where: { userId: user.id },
        orderBy: { createdAt: 'desc' },
        take: 10
      })

      if (sessions) {
        const formattedSessions = sessions.map((session: any) => ({
          id: session.id,
          ipAddress: session.ipAddress || 'Unknown',
          userAgent: session.userAgent || 'Unknown',
          location: session.location || null,
          loginAt: session.createdAt || session.loginAt,
          isCurrent: session.id === session.currentSessionId
        }))

        return NextResponse.json({ sessions: formattedSessions })
      }
    } catch (error) {
      // Session model doesn't exist, return mock data
      console.log('Session model not found, returning mock data')
    }

    // Return mock data with current session
    const userAgent = request.headers.get('user-agent') || 'Unknown'
    const forwarded = request.headers.get('x-forwarded-for')
    const ipAddress = forwarded ? forwarded.split(',')[0] : request.headers.get('x-real-ip') || 'Unknown'

    const mockSessions = [
      {
        id: 'current',
        ipAddress: ipAddress,
        userAgent: userAgent,
        location: null, // Could be enhanced with IP geolocation
        loginAt: new Date().toISOString(),
        isCurrent: true
      }
    ]

    return NextResponse.json({ sessions: mockSessions })
  } catch (error) {
    console.error('Get sessions error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy lịch sử đăng nhập' },
      { status: 500 }
    )
  }
}

