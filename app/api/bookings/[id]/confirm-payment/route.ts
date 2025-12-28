import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const bookingId = params.id

    // Get the booking
    const booking = await prisma.culturalCenterBooking.findUnique({
      where: { id: bookingId },
      include: {
        culturalCenter: true,
        user: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { message: 'Không tìm thấy lịch đặt' },
        { status: 404 }
      )
    }

    // Check if user owns this booking
    if (booking.userId !== user.id && user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    // Check if booking is in PENDING_PAYMENT status
    if (booking.status !== 'PENDING_PAYMENT') {
      return NextResponse.json(
        { message: 'Lịch đặt không ở trạng thái chờ thanh toán' },
        { status: 400 }
      )
    }

    // Update booking status and mark as paid
    const updatedBooking = await prisma.culturalCenterBooking.update({
      where: { id: bookingId },
      data: {
        status: 'APPROVED',
        feePaid: true
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

    // Create usage fee record
    if (booking.fee && booking.fee > 0) {
      await prisma.culturalCenterUsageFee.create({
        data: {
          bookingId: bookingId,
          amount: booking.fee,
          paymentDate: new Date(),
          paymentMethod: 'BANK_TRANSFER',
          notes: 'Thanh toán qua QR code VietQR'
        }
      })
    }

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xác nhận thanh toán' },
      { status: 500 }
    )
  }
}
