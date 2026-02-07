import { NextRequest, NextResponse } from 'next/server'
import { verifyToken, generateToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface UpdateProfileRequest {
  name?: string
  email?: string
  phone?: string
  address?: string
}

export async function GET(request: NextRequest) {
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

    const userData = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!userData) {
      return NextResponse.json(
        { message: 'Người dùng không tồn tại' },
        { status: 404 }
      )
    }

    // Return user data with defaults for new fields if they don't exist
    const responseData = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      phone: (userData as any).phone || null,
      address: (userData as any).address || null,
      avatarUrl: (userData as any).avatarUrl || null,
      role: userData.role,
      isEmailNotificationEnabled: (userData as any).isEmailNotificationEnabled ?? true,
      isPushNotificationEnabled: (userData as any).isPushNotificationEnabled ?? true,
      isPublicProfile: (userData as any).isPublicProfile ?? false,
      theme: (userData as any).theme || 'system',
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error('Get user profile error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy thông tin người dùng' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
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

    const body: UpdateProfileRequest = await request.json()
    const { name, email, phone, address } = body

    // Validate required fields
    if (!name || name.trim() === '') {
      return NextResponse.json(
        { message: 'Họ và tên là bắt buộc' },
        { status: 400 }
      )
    }

    if (!email || email.trim() === '') {
      return NextResponse.json(
        { message: 'Email là bắt buộc' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { message: 'Email không hợp lệ' },
        { status: 400 }
      )
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { message: 'Email đã được sử dụng' },
          { status: 400 }
        )
      }
    }

    const updateData: any = {
      name: name.trim(),
      email: email.trim()
    }
    
    // Handle optional fields - convert empty strings to null
    if (phone !== undefined) {
      updateData.phone = phone && phone.trim() !== '' ? phone.trim() : null
    }
    if (address !== undefined) {
      updateData.address = address && address.trim() !== '' ? address.trim() : null
    }

    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: updateData
    })

    // Return with defaults for new fields
    const responseUser = {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      phone: (updatedUser as any).phone || null,
      address: (updatedUser as any).address || null,
      avatarUrl: (updatedUser as any).avatarUrl || null,
      role: updatedUser.role,
      isEmailNotificationEnabled: (updatedUser as any).isEmailNotificationEnabled ?? true,
      isPushNotificationEnabled: (updatedUser as any).isPushNotificationEnabled ?? true,
      isPublicProfile: (updatedUser as any).isPublicProfile ?? false,
      theme: (updatedUser as any).theme || 'system',
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }

    // Regenerate JWT token if name or email changed (to keep session in sync)
    const nameChanged = name && name.trim() !== user.name
    const emailChanged = email && email.trim() !== user.email
    
    const response = NextResponse.json({
      message: 'Cập nhật thông tin thành công',
      user: responseUser
    })

    if (nameChanged || emailChanged) {
      // Generate new token with updated user data
      const newToken = generateToken({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role
      })

      // Update the auth cookie with the new token
      response.cookies.set('auth-token', newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 7 * 24 * 60 * 60, // 7 days
        path: '/'
      })
    }

    return response
  } catch (error: any) {
    console.error('Update profile error:', error)
    
    // Handle Prisma errors
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Email đã được sử dụng' },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2025') {
      return NextResponse.json(
        { message: 'Người dùng không tồn tại' },
        { status: 404 }
      )
    }
    
    return NextResponse.json(
      { message: error.message || 'Có lỗi xảy ra khi cập nhật thông tin' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
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

    const body = await request.json().catch(() => ({}))
    const { password } = body

    if (!password) {
      return NextResponse.json(
        { message: 'Vui lòng nhập mật khẩu để xác nhận' },
        { status: 400 }
      )
    }

    // Verify password (plain text comparison)
    const userData = await prisma.user.findUnique({
      where: { id: user.id }
    })

    if (!userData || userData.password !== password) {
      return NextResponse.json(
        { message: 'Mật khẩu không đúng' },
        { status: 401 }
      )
    }

    // Delete user
    await prisma.user.delete({
      where: { id: user.id }
    })

    // Clear auth cookie
    const response = NextResponse.json({
      message: 'Xóa tài khoản thành công'
    })

    response.cookies.delete('auth-token')

    return response
  } catch (error) {
    console.error('Delete account error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xóa tài khoản' },
      { status: 500 }
    )
  }
}

