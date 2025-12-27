import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
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

    // Only ADMIN, TEAM_LEADER, LEADER, DEPUTY can view dashboard stats
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_LEADER' && user.role !== 'LEADER' && user.role !== 'DEPUTY') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }
    const [
      totalHouseholds,
      totalPersons,
      totalDistricts,
      totalRequests,
      pendingRequests,
      totalBookings
    ] = await Promise.all([
      prisma.household.count(),
      prisma.person.count(),
      prisma.district.count(),
      prisma.request.count(),
      prisma.request.count({
        where: { status: 'PENDING' }
      }),
      prisma.culturalCenterBooking.count()
    ])

    return NextResponse.json({
      totalHouseholds,
      totalPersons,
      totalDistricts,
      totalRequests,
      pendingRequests,
      totalBookings
    })
  } catch (error) {
    console.error('Error fetching dashboard stats:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy thống kê' },
      { status: 500 }
    )
  }
}
