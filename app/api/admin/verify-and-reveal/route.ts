import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface VerifyAndRevealRequest {
  adminId: string
  adminPassword: string
  targetUserId: string
}

export async function POST(request: NextRequest) {
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

    // Only ADMIN can reveal passwords
    if (user.role !== 'ADMIN') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const body: VerifyAndRevealRequest = await request.json()
    const { adminId, adminPassword, targetUserId } = body

    if (!adminId || !adminPassword || !targetUserId) {
      return NextResponse.json(
        { message: 'Tất cả các trường là bắt buộc' },
        { status: 400 }
      )
    }

    // Verify admin ID matches the logged-in user
    if (adminId !== user.id) {
      return NextResponse.json(
        { message: 'ID người dùng không khớp' },
        { status: 403 }
      )
    }

    // Get admin user from database
    const adminUser = await prisma.user.findUnique({
      where: { id: adminId }
    })

    if (!adminUser) {
      return NextResponse.json(
        { message: 'Không tìm thấy tài khoản quản trị viên' },
        { status: 404 }
      )
    }

    // Debug logging (remove in production)
    console.log('Admin email:', adminUser.email)
    console.log('Input password length:', adminPassword.length)
    console.log('Stored password length:', adminUser.password?.length)
    console.log('Stored password starts with $2b$:', adminUser.password?.startsWith('$2b$'))

    // Check if password is still hashed (starts with bcrypt hash prefix)
    if (adminUser.password?.startsWith('$2b$') || adminUser.password?.startsWith('$2a$')) {
      console.error('Password is still hashed! Please update database to use plain text passwords.')
      return NextResponse.json(
        { 
          message: 'Mật khẩu trong database vẫn đang được hash. Vui lòng cập nhật database hoặc chạy lại seed file.',
          error: 'PASSWORD_STILL_HASHED'
        },
        { status: 500 }
      )
    }

    // Verify admin password (plain text comparison)
    if (adminPassword !== adminUser.password) {
      console.log('Password mismatch')
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

    // Check if target user password is still hashed
    if (targetUser.password?.startsWith('$2b$') || targetUser.password?.startsWith('$2a$')) {
      console.error(`Target user ${targetUser.email} password is still hashed!`)
      return NextResponse.json(
        { 
          message: 'Mật khẩu của người dùng này vẫn đang được hash. Vui lòng chạy script: npx tsx scripts/update-passwords-to-plaintext.ts',
          error: 'PASSWORD_STILL_HASHED'
        },
        { status: 500 }
      )
    }

    // Return the plain text password
    return NextResponse.json({
      message: 'Xác thực thành công',
      password: targetUser.password,
      user: {
        id: targetUser.id,
        name: targetUser.name,
        email: targetUser.email
      }
    })
  } catch (error) {
    console.error('Verify and reveal error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xác thực và hiển thị mật khẩu' },
      { status: 500 }
    )
  }
}

