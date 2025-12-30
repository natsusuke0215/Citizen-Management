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

    // Optimize query with select instead of include for better performance
    const bookings = await prisma.culturalCenterBooking.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        startTime: true,
        endTime: true,
        status: true,
        visibility: true,
        type: true,
        fee: true,
        bookerName: true,
        bookerPhone: true,
        feePaid: true,
        createdAt: true,
        updatedAt: true,
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
        },
        usageFee: true
      },
      orderBy: {
        createdAt: 'desc'
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

    const { title, description, startTime, endTime, culturalCenterId, visibility, type, fee, bookerName, bookerPhone } = await request.json()

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
    // Two bookings overlap if: start1 < end2 AND end1 > start2
    const overlappingBooking = await prisma.culturalCenterBooking.findFirst({
      where: {
        culturalCenterId,
        status: 'APPROVED',
        startTime: { lt: end },
        endTime: { gt: start }
      }
    })

    if (overlappingBooking) {
      return NextResponse.json(
        { message: 'Thời gian này đã được đặt bởi người khác' },
        { status: 400 }
      )
    }

    // Check if this is a payment-required booking
    const isPaymentRequired = true // All bookings now require payment

    const booking = await prisma.culturalCenterBooking.create({
      data: {
        title,
        description: description || null,
        startTime: start,
        endTime: end,
        culturalCenterId,
        userId: user.id,
        visibility: visibility || 'PUBLIC',
        status: isPaymentRequired ? 'PENDING_PAYMENT' : 'APPROVED',
        type: type || 'EVENT',
        fee: fee !== undefined && fee !== null ? (typeof fee === 'number' ? fee : parseFloat(String(fee))) : null,
        bookerName: bookerName ? String(bookerName) : null,
        bookerPhone: bookerPhone ? String(bookerPhone) : null,
        feePaid: false
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
