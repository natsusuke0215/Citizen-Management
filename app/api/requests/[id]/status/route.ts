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
        { message: 'Chỉ tổ trưởng và tổ phó mới có quyền duyệt yêu cầu' },
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

    const requestData = await prisma.request.findUnique({
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

    if (!requestData) {
      return NextResponse.json(
        { message: 'Không tìm thấy yêu cầu' },
        { status: 404 }
      )
    }

    const updatedRequest = await prisma.request.update({
      where: { id: params.id },
      data: { status },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        household: {
          select: {
            id: true,
            householdId: true,
            address: true
          }
        }
      }
    })

    // Create notification for user
    await prisma.notification.create({
      data: {
        title: status === 'APPROVED' ? 'Yêu cầu đã được duyệt' : 'Yêu cầu bị từ chối',
        message: status === 'APPROVED' 
          ? `Yêu cầu "${requestData.description}" đã được duyệt thành công.`
          : `Yêu cầu "${requestData.description}" đã bị từ chối.`,
        userId: requestData.user.id
      }
    })

    return NextResponse.json(updatedRequest)
  } catch (error) {
    console.error('Error updating request status:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật trạng thái yêu cầu' },
      { status: 500 }
    )
  }
}
