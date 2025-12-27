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

    // Optimize query with select instead of include
    const requests = await prisma.request.findMany({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        type: true,
        description: true,
        status: true,
        data: true,
        createdAt: true,
        updatedAt: true,
        household: {
          select: {
            id: true,
            householdId: true,
            address: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(requests)
  } catch (error) {
    console.error('Error fetching user requests:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách yêu cầu' },
      { status: 500 }
    )
  }
}
