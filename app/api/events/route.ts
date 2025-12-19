import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const start = startDate ? new Date(startDate) : new Date()
    const end = endDate ? new Date(endDate) : new Date()
    end.setDate(end.getDate() + 30) // Mặc định lấy 30 ngày tiếp theo

    // Lấy bookings
    const bookings = await prisma.culturalCenterBooking.findMany({
      where: {
        startTime: {
          gte: start,
          lte: end
        },
        status: 'APPROVED'
      },
      include: {
        culturalCenter: {
          select: {
            id: true,
            name: true,
            building: true,
            floor: true,
            room: true
          }
        },
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        startTime: 'asc'
      }
    })

    // Lấy activities
    const activities = await prisma.culturalCenterActivity.findMany({
      where: {
        startDate: {
          gte: start,
          lte: end
        }
      },
      include: {
        culturalCenter: {
          select: {
            id: true,
            name: true,
            building: true,
            floor: true,
            room: true
          }
        }
      },
      orderBy: {
        startDate: 'asc'
      }
    })

    // Chuyển đổi thành format thống nhất
    const events = [
      ...bookings.map(booking => ({
        id: booking.id,
        title: booking.title,
        description: booking.description,
        start: booking.startTime,
        end: booking.endTime,
        type: 'BOOKING',
        status: booking.status,
        visibility: booking.visibility,
        culturalCenter: booking.culturalCenter,
        user: booking.user,
        color: booking.culturalCenter.building === 'A' ? '#3B82F6' : 
               booking.culturalCenter.building === 'B' ? '#10B981' : '#8B5CF6'
      })),
      ...activities.map(activity => ({
        id: activity.id,
        title: activity.title,
        description: activity.description,
        start: activity.startDate,
        end: activity.endDate || activity.startDate,
        type: 'ACTIVITY',
        activityType: activity.activityType,
        organizer: activity.organizer,
        participantCount: activity.participantCount,
        culturalCenter: activity.culturalCenter,
        color: activity.culturalCenter.building === 'A' ? '#3B82F6' : 
               activity.culturalCenter.building === 'B' ? '#10B981' : '#8B5CF6'
      }))
    ].sort((a, b) => new Date(a.start).getTime() - new Date(b.start).getTime())

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy sự kiện' },
      { status: 500 }
    )
  }
}

