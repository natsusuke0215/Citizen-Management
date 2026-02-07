import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, verifyPassword } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface ChangePasswordRequest {
  currentPassword: string
  newPassword: string
}

export async function PATCH(request: NextRequest) {
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

    const body: ChangePasswordRequest = await request.json()
    const { currentPassword, newPassword } = body

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { message: 'Vui lòng nhập đầy đủ thông tin' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { message: 'Mật khẩu mới phải có ít nhất 8 ký tự' },
        { status: 400 }
      )
    }

    // Get user with password
    const userData = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!userData) {
      return NextResponse.json(
        { message: 'Người dùng không tồn tại' },
        { status: 404 }
      )
    }

    // Verify current password (plain text comparison)
    if (!verifyPassword(currentPassword, userData.password)) {
      return NextResponse.json(
        { message: 'Mật khẩu hiện tại không đúng' },
        { status: 401 }
      )
    }

    // Update password (plain text)
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
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



