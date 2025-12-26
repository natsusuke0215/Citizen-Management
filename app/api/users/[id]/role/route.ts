import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@/lib/types'

interface UpdateRoleRequest {
  role: UserRole
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Only ADMIN can update user roles
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Không có quyền cập nhật role' },
        { status: 403 }
      )
    }

    const userId = params.id
    const body: UpdateRoleRequest = await request.json()
    const { role } = body

    if (!role) {
      return NextResponse.json(
        { message: 'Role là bắt buộc' },
        { status: 400 }
      )
    }

    // Validate role
    if (!Object.values(UserRole).includes(role)) {
      return NextResponse.json(
        { message: 'Role không hợp lệ' },
        { status: 400 }
      )
    }

    // Prevent updating role to ADMIN
    if (role === 'ADMIN') {
      return NextResponse.json(
        { message: 'Không thể cập nhật role thành Quản trị viên' },
        { status: 403 }
      )
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!existingUser) {
      return NextResponse.json(
        { message: 'Người dùng không tồn tại' },
        { status: 404 }
      )
    }

    // Update user role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        householdId: true,
        createdAt: true,
        updatedAt: true
      }
    })

    return NextResponse.json({
      message: 'Cập nhật role thành công',
      user: updatedUser
    })
  } catch (error) {
    console.error('Update user role error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật role' },
      { status: 500 }
    )
  }
}

