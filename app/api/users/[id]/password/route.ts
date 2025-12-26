import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface ChangePasswordRequest {
  newPassword: string
  adminPassword?: string // Optional admin password verification
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

    // Only ADMIN can change passwords
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Không có quyền thay đổi mật khẩu' },
        { status: 403 }
      )
    }

    const userId = params.id
    const body: ChangePasswordRequest = await request.json()
    const { newPassword, adminPassword } = body

    if (!newPassword) {
      return NextResponse.json(
        { message: 'Mật khẩu mới là bắt buộc' },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { message: 'Mật khẩu phải có ít nhất 6 ký tự' },
        { status: 400 }
      )
    }

    // Optional: Verify admin password if provided
    if (adminPassword) {
      const adminUser = await prisma.user.findUnique({
        where: { id: user.id }
      })

      if (!adminUser || adminPassword !== adminUser.password) {
        return NextResponse.json(
          { message: 'Mật khẩu quản trị viên không đúng' },
          { status: 401 }
        )
      }
    }

    // Check if target user exists
    const targetUser = await prisma.user.findUnique({
      where: { id: userId }
    })

    if (!targetUser) {
      return NextResponse.json(
        { message: 'Người dùng không tồn tại' },
        { status: 404 }
      )
    }

    // Update password (plain text)
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { password: newPassword },
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
      message: 'Cập nhật mật khẩu thành công',
      user: updatedUser
    })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật mật khẩu' },
      { status: 500 }
    )
  }
}

