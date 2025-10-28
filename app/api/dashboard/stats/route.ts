import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
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
