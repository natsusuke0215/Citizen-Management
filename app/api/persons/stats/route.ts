import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Thống kê nhân khẩu theo các tiêu chí
export async function GET(request: NextRequest) {
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

    // Only ADMIN, TEAM_LEADER, LEADER, DEPUTY can view stats
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_LEADER' && user.role !== 'LEADER' && user.role !== 'DEPUTY') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }
    const { 
      byGender, 
      byAge, 
      byTimeRange, 
      byTemporaryStatus,
      startDate,
      endDate
    } = Object.fromEntries(request.nextUrl.searchParams)

    const stats: any = {}

    // Thống kê theo giới tính
    if (byGender === 'true') {
      const genderStats = await prisma.person.groupBy({
        by: ['gender'],
        where: {
          status: 'ACTIVE'
        },
        _count: {
          id: true
        }
      })
      stats.byGender = genderStats.map(item => ({
        gender: item.gender,
        count: item._count.id
      }))
    }

    // Thống kê theo độ tuổi
    if (byAge === 'true') {
      const allPersons = await prisma.person.findMany({
        where: { status: 'ACTIVE' },
        select: { dateOfBirth: true }
      })

      const now = new Date()
      const ageGroups = {
        preschool: 0,      // Mầm non (0-5)
        kindergarten: 0,   // Mẫu giáo (6-6)
        primary: 0,        // Cấp 1 (7-11)
        secondary: 0,      // Cấp 2 (12-14)
        highSchool: 0,     // Cấp 3 (15-17)
        working: 0,        // Độ tuổi lao động (18-60)
        retired: 0         // Nghỉ hưu (60+)
      }

      allPersons.forEach(person => {
        const age = now.getFullYear() - person.dateOfBirth.getFullYear()
        if (age <= 5) ageGroups.preschool++
        else if (age === 6) ageGroups.kindergarten++
        else if (age >= 7 && age <= 11) ageGroups.primary++
        else if (age >= 12 && age <= 14) ageGroups.secondary++
        else if (age >= 15 && age <= 17) ageGroups.highSchool++
        else if (age >= 18 && age < 60) ageGroups.working++
        else ageGroups.retired++
      })

      stats.byAge = [
        { group: 'Mầm non (0-5 tuổi)', count: ageGroups.preschool },
        { group: 'Mẫu giáo (6 tuổi)', count: ageGroups.kindergarten },
        { group: 'Cấp 1 (7-11 tuổi)', count: ageGroups.primary },
        { group: 'Cấp 2 (12-14 tuổi)', count: ageGroups.secondary },
        { group: 'Cấp 3 (15-17 tuổi)', count: ageGroups.highSchool },
        { group: 'Độ tuổi lao động (18-59 tuổi)', count: ageGroups.working },
        { group: 'Nghỉ hưu (60+ tuổi)', count: ageGroups.retired }
      ]
    }

    // Thống kê theo khoảng thời gian
    if (byTimeRange === 'true' && startDate && endDate) {
      const timeRangeStats = await prisma.person.findMany({
        where: {
          createdAt: {
            gte: new Date(startDate),
            lte: new Date(endDate)
          }
        },
        select: {
          createdAt: true,
          status: true
        }
      })

      stats.byTimeRange = {
        total: timeRangeStats.length,
        active: timeRangeStats.filter(p => p.status === 'ACTIVE').length,
        movedOut: timeRangeStats.filter(p => p.status === 'MOVED_OUT').length,
        deceased: timeRangeStats.filter(p => p.status === 'DECEASED').length
      }
    }

    // Thống kê tạm vắng / tạm trú
    if (byTemporaryStatus === 'true') {
      const [absencesCount, residencesCount] = await Promise.all([
        prisma.temporaryAbsence.count({
          where: { status: 'ACTIVE' }
        }),
        prisma.temporaryResidence.count({
          where: { status: 'ACTIVE' }
        })
      ])

      stats.temporaryStatus = {
        absences: absencesCount,
        residences: residencesCount
      }
    }

    // Tổng số nhân khẩu
    const totalStats = await prisma.person.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    })

    stats.total = {
      active: totalStats.find(s => s.status === 'ACTIVE')?._count.id || 0,
      movedOut: totalStats.find(s => s.status === 'MOVED_OUT')?._count.id || 0,
      deceased: totalStats.find(s => s.status === 'DECEASED')?._count.id || 0,
      total: totalStats.reduce((sum, s) => sum + s._count.id, 0)
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error fetching person stats:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy thống kê' },
      { status: 500 }
    )
  }
}
