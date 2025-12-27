import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyPassword, verifyToken } from '@/lib/auth'

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

    // Check if user is admin, team leader or leader
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_LEADER' && user.role !== 'LEADER') {
      return NextResponse.json(
        { message: 'Chỉ quản trị viên mới có quyền thực hiện thao tác này' },
        { status: 403 }
      )
    }

    const { adminId, adminPassword, targetUserId } = await request.json()

    if (!adminId || !adminPassword || !targetUserId) {
      return NextResponse.json(
        { message: 'Thiếu thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // Verify admin ID matches token
    if (adminId !== user.id) {
      return NextResponse.json(
        { message: 'ID quản trị viên không khớp' },
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

    // Verify admin password
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

    // Return the password (plain text as stored in database)
    return NextResponse.json({
      password: targetUser.password
    })
  } catch (error) {
    console.error('Error in verify-and-reveal:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xác thực và hiển thị mật khẩu' },
      { status: 500 }
    )
  }
}