import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

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

    // Only ADMIN, TEAM_LEADER, LEADER, DEPUTY can view filter options
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_LEADER' && user.role !== 'LEADER' && user.role !== 'DEPUTY') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    // Get all unique values for filter options
    const [persons, districts, households] = await Promise.all([
      prisma.person.findMany({
        select: {
          gender: true,
          ethnicity: true,
          religion: true,
          education: true,
          occupation: true,
          status: true,
          dateOfBirth: true
        }
      }),
      prisma.district.findMany({
        select: {
          id: true,
          name: true
        }
      }),
      prisma.household.findMany({
        select: {
          ward: true,
          districtId: true
        }
      })
    ])

    // Get unique values
    const genders = [...new Set(persons.map(p => p.gender).filter(Boolean))].sort()
    const ethnicities = [...new Set(persons.map(p => p.ethnicity).filter(Boolean))].sort()
    const religions = [...new Set(persons.map(p => p.religion).filter(Boolean))].sort()
    const educations = [...new Set(persons.map(p => p.education).filter(Boolean))].sort()
    const occupations = [...new Set(persons.map(p => p.occupation).filter(Boolean))].sort()
    const statuses = [...new Set(persons.map(p => p.status).filter(Boolean))].sort()
    const wards = [...new Set(households.map(h => h.ward).filter(Boolean))].sort()

    // Get birth year range
    const birthYears = persons
      .map(p => new Date(p.dateOfBirth).getFullYear())
      .filter(year => !isNaN(year))
    const minBirthYear = Math.min(...birthYears)
    const maxBirthYear = Math.max(...birthYears)

    return NextResponse.json({
      genders,
      ethnicities,
      religions,
      educations,
      occupations,
      statuses,
      districts: districts.map(d => ({ id: d.id, name: d.name })),
      wards,
      birthYearRange: {
        min: minBirthYear,
        max: maxBirthYear
      }
    })
  } catch (error) {
    console.error('Error fetching filter options:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy tùy chọn lọc' },
      { status: 500 }
    )
  }
}

