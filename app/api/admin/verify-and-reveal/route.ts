import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { verifyPassword } from '@/lib/auth'

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

    // Only ADMIN can reveal passwords
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Chỉ quản trị viên mới có quyền xem mật khẩu' },
        { status: 403 }
      )
    }

    const { adminId, adminPassword, targetUserId } = await request.json()

    if (!adminId || !adminPassword || !targetUserId) {
      return NextResponse.json(
        { message: 'Thiếu thông tin xác thực' },
        { status: 400 }
      )
    }

    // Verify admin user exists and matches token
    if (user.id !== adminId) {
      return NextResponse.json(
        { message: 'Không khớp với người dùng hiện tại' },
        { status: 403 }
      )
    }

    // Get admin user from database
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId }
    })

    if (!adminUser) {
      return NextResponse.json(
        { message: 'Không tìm thấy quản trị viên' },
        { status: 404 }
      )
    }

    // Verify admin password (plain text comparison)
    if (!verifyPassword(adminPassword, adminUser.password)) {
      return NextResponse.json(
        { message: 'Mật khẩu quản trị viên không đúng' },
        { status: 401 }
      )
    }

    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: {
        id: true,
        email: true,
        name: true,
        password: true
      }
    })

    if (!targetUser) {
      return NextResponse.json(
        { message: 'Không tìm thấy người dùng' },
        { status: 404 }
      )
    }

    // Check if password is still hashed (starts with $2b$ or $2a$ for bcrypt)
    if (targetUser.password.startsWith('$2b$') || targetUser.password.startsWith('$2a$')) {
      return NextResponse.json(
        { 
          message: 'Mật khẩu trong database vẫn đang được hash',
          error: 'PASSWORD_STILL_HASHED'
        },
        { status: 400 }
      )
    }

    // Return the password (plain text)
    return NextResponse.json({
      password: targetUser.password
    })
  } catch (error) {
    console.error('Error in verify-and-reveal:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xác thực' },
      { status: 500 }
    )
  }
}
