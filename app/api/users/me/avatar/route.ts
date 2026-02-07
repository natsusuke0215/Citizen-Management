import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { writeFile, mkdir, unlink } from 'fs/promises'
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

    // Get current user to check for existing avatar
    const currentUser = await prisma.user.findUnique({
      where: { id: user.id },
      select: { avatarUrl: true }
    })

    // Save file
    const filePath = join(uploadsDir, fileName)
    await writeFile(filePath, buffer)

    // Update user with avatar URL
    const avatarUrl = `/uploads/avatars/${fileName}`
    
    try {
      // Update database - this is critical, if it fails, we should delete the file
      await prisma.user.update({
        where: { id: user.id },
        data: {
          avatarUrl: avatarUrl
        }
      })

      // Delete old avatar file if it exists and is different from the new one
      if (currentUser?.avatarUrl && currentUser.avatarUrl !== avatarUrl) {
        const oldFilePath = join(process.cwd(), 'public', currentUser.avatarUrl)
        if (existsSync(oldFilePath)) {
          try {
            await unlink(oldFilePath)
          } catch (unlinkError) {
            // Log but don't fail if old file deletion fails
            console.warn('Failed to delete old avatar file:', unlinkError)
          }
        }
      }

      return NextResponse.json({
        message: 'Tải ảnh đại diện thành công',
        avatarUrl: avatarUrl
      })
    } catch (dbError: any) {
      // If database update fails, delete the uploaded file to prevent orphaned files
      try {
        await unlink(filePath)
      } catch (unlinkError) {
        console.error('Failed to delete uploaded file after DB error:', unlinkError)
      }

      console.error('Database update error:', dbError)
      
      // Handle specific Prisma errors
      if (dbError.code === 'P2025') {
        return NextResponse.json(
          { message: 'Người dùng không tồn tại' },
          { status: 404 }
        )
      }

      return NextResponse.json(
        { message: 'Có lỗi xảy ra khi cập nhật thông tin người dùng trong cơ sở dữ liệu' },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Upload avatar error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tải ảnh lên' },
      { status: 500 }
    )
  }
}

