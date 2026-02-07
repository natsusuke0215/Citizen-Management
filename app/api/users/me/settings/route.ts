import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

interface UpdateSettingsRequest {
  isEmailNotificationEnabled?: boolean
  isPushNotificationEnabled?: boolean
  isPublicProfile?: boolean
  theme?: string
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

    const body: UpdateSettingsRequest = await request.json()
    const {
      isEmailNotificationEnabled,
      isPushNotificationEnabled,
      isPublicProfile,
      theme
    } = body

    // Validate theme if provided
    if (theme && !['light', 'dark', 'system'].includes(theme)) {
      return NextResponse.json(
        { message: 'Theme không hợp lệ' },
        { status: 400 }
      )
    }

    const updateData: any = {}
    if (isEmailNotificationEnabled !== undefined) {
      updateData.isEmailNotificationEnabled = isEmailNotificationEnabled
    }
    if (isPushNotificationEnabled !== undefined) {
      updateData.isPushNotificationEnabled = isPushNotificationEnabled
    }
    if (isPublicProfile !== undefined) {
      updateData.isPublicProfile = isPublicProfile
    }
    if (theme !== undefined) {
      updateData.theme = theme
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
      role: updatedUser.role,
      isEmailNotificationEnabled: (updatedUser as any).isEmailNotificationEnabled ?? true,
      isPushNotificationEnabled: (updatedUser as any).isPushNotificationEnabled ?? true,
      isPublicProfile: (updatedUser as any).isPublicProfile ?? false,
      theme: (updatedUser as any).theme || 'system',
      householdId: updatedUser.householdId,
      createdAt: updatedUser.createdAt,
      updatedAt: updatedUser.updatedAt
    }

    return NextResponse.json({
      message: 'Cập nhật cài đặt thành công',
      user: responseUser
    })
  } catch (error) {
    console.error('Update settings error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật cài đặt' },
      { status: 500 }
    )
  }
}

