import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Lấy danh sách hoạt động
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { activityType, startDate, endDate } = Object.fromEntries(request.nextUrl.searchParams)

    const where: any = {
      culturalCenterId: params.id
    }

    if (activityType) where.activityType = activityType
    if (startDate || endDate) {
      where.startDate = {}
      if (startDate) where.startDate.gte = new Date(startDate)
      if (endDate) where.startDate.lte = new Date(endDate)
    }

    const activities = await prisma.culturalCenterActivity.findMany({
      where,
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json(activities)
  } catch (error) {
    console.error('Error fetching activities:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách hoạt động' },
      { status: 500 }
    )
  }
}

// Tạo hoạt động mới
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { title, description, activityType, startDate, endDate, organizer, participantCount, notes } = await request.json()

    if (!title || !activityType || !startDate) {
      return NextResponse.json(
        { message: 'Tiêu đề, loại hoạt động và ngày bắt đầu là bắt buộc' },
        { status: 400 }
      )
    }

    const activity = await prisma.culturalCenterActivity.create({
      data: {
        title,
        description: description || null,
        activityType,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        culturalCenterId: params.id,
        organizer: organizer || null,
        participantCount: participantCount ? parseInt(participantCount) : null,
        notes: notes || null
      }
    })

    return NextResponse.json(activity, { status: 201 })
  } catch (error) {
    console.error('Error creating activity:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo hoạt động' },
      { status: 500 }
    )
  }
}





