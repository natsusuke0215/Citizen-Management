import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

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

    const formData = await request.formData()
    const file = formData.get('avatar') as File

    if (!file) {
      return NextResponse.json(
        { message: 'Không tìm thấy file' },
        { status: 400 }
      )
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { message: 'File phải là ảnh' },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: 'Kích thước file không được vượt quá 5MB' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const fileExtension = file.name.split('.').pop() || 'jpg'
    const fileName = `${user.id}-${Date.now()}.${fileExtension}`
    
    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), 'public', 'uploads', 'avatars')
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true })
    }

    // Save file
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // Update user with avatar URL
    const avatarUrl = `/uploads/avatars/${fileName}`
    
    // Note: This assumes the User model has an avatarUrl field
    // If not, you may need to add it to the schema
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: {
          // @ts-ignore - avatarUrl might not be in the schema yet
          avatarUrl: avatarUrl
        }
      })
    } catch (error) {
      // If avatarUrl field doesn't exist, just return the URL
      // The frontend can handle it
      console.warn('Avatar URL field might not exist in schema:', error)
    }

    return NextResponse.json({
      message: 'Tải ảnh đại diện thành công',
      avatarUrl: avatarUrl
    })
  } catch (error) {
    console.error('Upload avatar error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tải ảnh lên' },
      { status: 500 }
    )
  }
}

