import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET() {
  try {
    const bookings = await prisma.culturalCenterBooking.findMany({
      include: {
        culturalCenter: {
          select: {
            id: true,
            name: true,
            building: true,
            floor: true,
            room: true,
            capacity: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        startTime: 'desc'
      }
    })

    return NextResponse.json(bookings)
  } catch (error) {
    console.error('Error fetching bookings:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách lịch đặt' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
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

    const { title, description, startTime, endTime, culturalCenterId, visibility } = await request.json()

    if (!title || !startTime || !endTime || !culturalCenterId) {
      return NextResponse.json(
        { message: 'Tất cả các trường bắt buộc phải được điền' },
        { status: 400 }
      )
    }

    const start = new Date(startTime)
    const end = new Date(endTime)

    if (start >= end) {
      return NextResponse.json(
        { message: 'Thời gian kết thúc phải sau thời gian bắt đầu' },
        { status: 400 }
      )
    }

    if (start < new Date()) {
      return NextResponse.json(
        { message: 'Không thể đặt lịch trong quá khứ' },
        { status: 400 }
      )
    }

    // Check for overlapping bookings
    const overlappingBooking = await prisma.culturalCenterBooking.findFirst({
      where: {
        culturalCenterId,
        status: 'APPROVED',
        OR: [
          {
            AND: [
              { startTime: { lte: start } },
              { endTime: { gt: start } }
            ]
          },
          {
            AND: [
              { startTime: { lt: end } },
              { endTime: { gte: end } }
            ]
          },
          {
            AND: [
              { startTime: { gte: start } },
              { endTime: { lte: end } }
            ]
          }
        ]
      }
    })

    if (overlappingBooking) {
      return NextResponse.json(
        { message: 'Thời gian này đã được đặt bởi người khác' },
        { status: 400 }
      )
    }

    const booking = await prisma.culturalCenterBooking.create({
      data: {
        title,
        description: description || null,
        startTime: start,
        endTime: end,
        culturalCenterId,
        userId: user.id,
        visibility: visibility || 'PUBLIC'
      },
      include: {
        culturalCenter: {
          select: {
            id: true,
            name: true,
            building: true,
            floor: true,
            room: true,
            capacity: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    })

    return NextResponse.json(booking, { status: 201 })
  } catch (error) {
    console.error('Error creating booking:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo lịch đặt' },
      { status: 500 }
    )
  }
}
