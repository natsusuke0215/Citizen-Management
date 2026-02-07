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

    // Only ADMIN, TEAM_LEADER, LEADER, DEPUTY can view stats
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_LEADER' && user.role !== 'LEADER' && user.role !== 'DEPUTY') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    // Get filter parameters from query string
    const searchParams = request.nextUrl.searchParams
    const gender = searchParams.get('gender')
    const birthYear = searchParams.get('birthYear')
    const minAge = searchParams.get('minAge')
    const maxAge = searchParams.get('maxAge')
    const districtId = searchParams.get('districtId')
    const ward = searchParams.get('ward')
    const ethnicity = searchParams.get('ethnicity')
    const religion = searchParams.get('religion')
    const education = searchParams.get('education')
    const occupation = searchParams.get('occupation')
    const status = searchParams.get('status') || 'ACTIVE'

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (gender) {
      where.gender = gender
    }

    if (birthYear) {
      const year = parseInt(birthYear)
      const startDate = new Date(year, 0, 1)
      const endDate = new Date(year, 11, 31, 23, 59, 59)
      where.dateOfBirth = {
        gte: startDate,
        lte: endDate
      }
    }

    if (minAge || maxAge) {
      const now = new Date()
      if (maxAge) {
        const minBirthDate = new Date(now.getFullYear() - parseInt(maxAge) - 1, 11, 31)
        where.dateOfBirth = {
          ...where.dateOfBirth,
          gte: where.dateOfBirth?.gte || minBirthDate
        }
      }
      if (minAge) {
        const maxBirthDate = new Date(now.getFullYear() - parseInt(minAge), 0, 1)
        where.dateOfBirth = {
          ...where.dateOfBirth,
          lte: where.dateOfBirth?.lte || maxBirthDate
        }
      }
    }

    if (ethnicity) {
      where.ethnicity = ethnicity
    }

    if (religion) {
      where.religion = religion
    }

    if (education) {
      where.education = education
    }

    if (occupation) {
      where.occupation = occupation
    }

    // Get persons with filters
    const persons = await prisma.person.findMany({
      where,
      include: {
        household: {
          include: {
            districtRelation: true
          }
        }
      }
    })

    // Apply district and ward filters after fetching (since they're in household relation)
    let filteredPersons = persons
    if (districtId) {
      filteredPersons = filteredPersons.filter(p => p.household.districtId === districtId)
    }
    if (ward) {
      filteredPersons = filteredPersons.filter(p => p.household.ward === ward)
    }

    // Calculate statistics
    const total = filteredPersons.length
    const now = new Date()

    // Gender distribution
    const genderStats = {
      'Nam': filteredPersons.filter(p => p.gender === 'Nam' || p.gender === 'MALE' || p.gender === 'male').length,
      'Nữ': filteredPersons.filter(p => p.gender === 'Nữ' || p.gender === 'FEMALE' || p.gender === 'female').length,
      'Khác': filteredPersons.filter(p => {
        const g = p.gender
        return g !== 'Nam' && g !== 'Nữ' && g !== 'MALE' && g !== 'FEMALE' && g !== 'male' && g !== 'female'
      }).length
    }

    // Age groups
    const ageGroups = {
      '0-17': 0,
      '18-30': 0,
      '31-50': 0,
      '51-65': 0,
      '65+': 0
    }

    filteredPersons.forEach(person => {
      const age = Math.floor((now.getTime() - new Date(person.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
      if (age < 18) ageGroups['0-17']++
      else if (age <= 30) ageGroups['18-30']++
      else if (age <= 50) ageGroups['31-50']++
      else if (age <= 65) ageGroups['51-65']++
      else ageGroups['65+']++
    })

    // Year of birth distribution
    const birthYearStats: Record<number, number> = {}
    filteredPersons.forEach(person => {
      const year = new Date(person.dateOfBirth).getFullYear()
      birthYearStats[year] = (birthYearStats[year] || 0) + 1
    })

    // District distribution
    const districtStats: Record<string, number> = {}
    filteredPersons.forEach(person => {
      const districtName = person.household.districtRelation?.name || person.household.district || 'Không xác định'
      districtStats[districtName] = (districtStats[districtName] || 0) + 1
    })

    // Ward distribution
    const wardStats: Record<string, number> = {}
    filteredPersons.forEach(person => {
      const wardName = person.household.ward || 'Không xác định'
      wardStats[wardName] = (wardStats[wardName] || 0) + 1
    })

    // Ethnicity distribution
    const ethnicityStats: Record<string, number> = {}
    filteredPersons.forEach(person => {
      if (person.ethnicity) {
        ethnicityStats[person.ethnicity] = (ethnicityStats[person.ethnicity] || 0) + 1
      }
    })

    // Religion distribution
    const religionStats: Record<string, number> = {}
    filteredPersons.forEach(person => {
      if (person.religion) {
        religionStats[person.religion] = (religionStats[person.religion] || 0) + 1
      }
    })

    // Education distribution
    const educationStats: Record<string, number> = {}
    filteredPersons.forEach(person => {
      if (person.education) {
        educationStats[person.education] = (educationStats[person.education] || 0) + 1
      }
    })

    // Occupation distribution
    const occupationStats: Record<string, number> = {}
    filteredPersons.forEach(person => {
      if (person.occupation) {
        occupationStats[person.occupation] = (occupationStats[person.occupation] || 0) + 1
      }
    })

    return NextResponse.json({
      total,
      genderStats,
      ageGroups,
      birthYearStats,
      districtStats,
      wardStats,
      ethnicityStats,
      religionStats,
      educationStats,
      occupationStats,
      persons: filteredPersons.map(p => ({
        id: p.id,
        fullName: p.fullName,
        dateOfBirth: p.dateOfBirth,
        gender: p.gender,
        ethnicity: p.ethnicity,
        religion: p.religion,
        education: p.education,
        occupation: p.occupation,
        status: p.status,
        household: {
          householdId: p.household.householdId,
          district: p.household.district,
          ward: p.household.ward,
          districtName: p.household.districtRelation?.name
        }
      }))
    })
  } catch (error) {
    console.error('Error fetching advanced stats:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy thống kê' },
      { status: 500 }
    )
  }
}

