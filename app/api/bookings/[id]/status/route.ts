import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function PATCH(
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

    if (user.role !== 'TEAM_LEADER' && user.role !== 'ADMIN' && user.role !== 'LEADER' && user.role !== 'DEPUTY') {
      return NextResponse.json(
        { message: 'Chỉ tổ trưởng và tổ phó mới có quyền duyệt lịch đặt' },
        { status: 403 }
      )
    }

    const { status } = await request.json()

    if (!['APPROVED', 'REJECTED'].includes(status)) {
      return NextResponse.json(
        { message: 'Trạng thái không hợp lệ' },
        { status: 400 }
      )
    }

    const booking = await prisma.culturalCenterBooking.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    if (!booking) {
      return NextResponse.json(
        { message: 'Không tìm thấy lịch đặt' },
        { status: 404 }
      )
    }

    const updatedBooking = await prisma.culturalCenterBooking.update({
      where: { id: params.id },
      data: { status },
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

    // Create notification for user
    await prisma.notification.create({
      data: {
        title: status === 'APPROVED' ? 'Lịch đặt đã được duyệt' : 'Lịch đặt bị từ chối',
        message: status === 'APPROVED' 
          ? `Lịch đặt "${booking.title}" đã được duyệt thành công.`
          : `Lịch đặt "${booking.title}" đã bị từ chối.`,
        userId: booking.user.id
      }
    })

    return NextResponse.json(updatedBooking)
  } catch (error) {
    console.error('Error updating booking status:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật trạng thái lịch đặt' },
      { status: 500 }
    )
  }
}
