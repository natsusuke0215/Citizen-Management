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

    // Only ADMIN, TEAM_LEADER, LEADER, DEPUTY can view statistics
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_LEADER' && user.role !== 'LEADER' && user.role !== 'DEPUTY') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const searchParams = request.nextUrl.searchParams
    const gender = searchParams.get('gender')
    const birthYearFrom = searchParams.get('birthYearFrom')
    const birthYearTo = searchParams.get('birthYearTo')
    const ageFrom = searchParams.get('ageFrom')
    const ageTo = searchParams.get('ageTo')
    const districtId = searchParams.get('districtId')
    const ward = searchParams.get('ward')
    const ethnicity = searchParams.get('ethnicity')
    const religion = searchParams.get('religion')
    const education = searchParams.get('education')
    const status = searchParams.get('status') || 'ACTIVE'

    // Build where clause
    const where: any = {}

    if (status) {
      where.status = status
    }

    if (gender) {
      where.gender = gender
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

    if (districtId || ward) {
      where.household = {}
      if (districtId) {
        where.household.districtId = districtId
      }
      if (ward) {
        where.household.ward = ward
      }
    }

    // Get all persons matching filters
    const allPersons = await prisma.person.findMany({
      where,
      select: {
        id: true,
        dateOfBirth: true,
        gender: true,
        ethnicity: true,
        religion: true,
        education: true,
        occupation: true,
        status: true,
        moveOutDate: true,
        createdAt: true,
        registrationDate: true,
        householdId: true,
        household: {
          select: {
            districtId: true,
            district: true,
            ward: true,
          }
        }
      }
    })

    // Filter by birth year and age
    const now = new Date()
    let filteredPersons = allPersons

    if (birthYearFrom || birthYearTo || ageFrom || ageTo) {
      filteredPersons = allPersons.filter(person => {
        const birthYear = new Date(person.dateOfBirth).getFullYear()
        const age = Math.floor((now.getTime() - new Date(person.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))

        if (birthYearFrom && birthYear < parseInt(birthYearFrom)) return false
        if (birthYearTo && birthYear > parseInt(birthYearTo)) return false
        if (ageFrom && age < parseInt(ageFrom)) return false
        if (ageTo && age > parseInt(ageTo)) return false

        return true
      })
    }

    // Get households for filtered persons
    const householdIds = [...new Set(filteredPersons.map(p => p.householdId))]
    const allHouseholds = await prisma.household.findMany({
      where: {
        id: { in: householdIds }
      },
      select: {
        id: true,
        districtId: true,
        ward: true,
        persons: {
          where: {
            id: { in: filteredPersons.map(p => p.id) }
          },
          select: {
            id: true
          }
        }
      }
    })

    const districts = await prisma.district.findMany()

    // Calculate statistics
    const totalPersons = filteredPersons.length
    const totalHouseholds = allHouseholds.length
    const areaKm2 = 10
    const populationDensity = totalPersons / areaKm2

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

    // Gender stats
    const genderStats = {
      'Nam': filteredPersons.filter(p => p.gender === 'Nam' || p.gender === 'MALE' || p.gender === 'male').length,
      'Nữ': filteredPersons.filter(p => p.gender === 'Nữ' || p.gender === 'FEMALE' || p.gender === 'female').length,
      'Khác': filteredPersons.filter(p => p.gender !== 'Nam' && p.gender !== 'Nữ' && p.gender !== 'MALE' && p.gender !== 'FEMALE' && p.gender !== 'male' && p.gender !== 'female').length
    }

    // Ethnicity stats
    const ethnicityStats: Record<string, number> = {}
    filteredPersons.forEach(person => {
      if (person.ethnicity) {
        ethnicityStats[person.ethnicity] = (ethnicityStats[person.ethnicity] || 0) + 1
      }
    })

    // Religion stats
    const religionStats: Record<string, number> = {}
    filteredPersons.forEach(person => {
      if (person.religion) {
        religionStats[person.religion] = (religionStats[person.religion] || 0) + 1
      }
    })

    // Education stats
    const educationStats: Record<string, number> = {}
    filteredPersons.forEach(person => {
      if (person.education) {
        educationStats[person.education] = (educationStats[person.education] || 0) + 1
      }
    })

    // Birth year stats
    const birthYearStats: Record<number, { total: number; male: number; female: number }> = {}
    filteredPersons.forEach(person => {
      const birthYear = new Date(person.dateOfBirth).getFullYear()
      if (!birthYearStats[birthYear]) {
        birthYearStats[birthYear] = { total: 0, male: 0, female: 0 }
      }
      birthYearStats[birthYear].total++
      if (person.gender === 'Nam' || person.gender === 'MALE' || person.gender === 'male') {
        birthYearStats[birthYear].male++
      } else if (person.gender === 'Nữ' || person.gender === 'FEMALE' || person.gender === 'female') {
        birthYearStats[birthYear].female++
      }
    })

    // District stats
    const districtStats: Record<string, { name: string; count: number; households: number }> = {}
    districts.forEach(district => {
      districtStats[district.id] = {
        name: district.name,
        count: 0,
        households: 0
      }
    })

    filteredPersons.forEach(person => {
      if (person.household?.districtId) {
        const districtId = person.household.districtId
        if (districtStats[districtId]) {
          districtStats[districtId].count++
        }
      }
    })

    allHouseholds.forEach(household => {
      if (household.districtId && districtStats[household.districtId]) {
        districtStats[household.districtId].households++
      }
    })

    // Ward stats
    const wardStats: Record<string, number> = {}
    filteredPersons.forEach(person => {
      if (person.household?.ward) {
        const ward = person.household.ward
        wardStats[ward] = (wardStats[ward] || 0) + 1
      }
    })

    // Household size stats
    const householdSizeStats: Record<number, number> = {}
    allHouseholds.forEach(household => {
      const size = household.persons.length
      householdSizeStats[size] = (householdSizeStats[size] || 0) + 1
    })

    // Births and deaths
    const currentYear = now.getFullYear()
    const birthsThisYear = filteredPersons.filter(p => {
      const birthYear = new Date(p.dateOfBirth).getFullYear()
      return birthYear === currentYear
    }).length

    const deathsThisYear = filteredPersons.filter(p => {
      return p.status === 'DECEASED' && p.moveOutDate && new Date(p.moveOutDate).getFullYear() === currentYear
    }).length

    // Moved out
    const movedOut = filteredPersons.filter(p => p.status === 'MOVED_OUT').length
    const movedOutThisYear = filteredPersons.filter(p => {
      return p.status === 'MOVED_OUT' && p.moveOutDate && new Date(p.moveOutDate).getFullYear() === currentYear
    }).length

    // Moved in
    const movedInThisYear = filteredPersons.filter(p => {
      return p.registrationDate && new Date(p.registrationDate).getFullYear() === currentYear
    }).length

    return NextResponse.json({
      totalPersons,
      totalHouseholds,
      populationDensity: Math.round(populationDensity * 100) / 100,
      ageGroups,
      genderStats,
      ethnicityStats,
      religionStats,
      educationStats,
      birthYearStats,
      districtStats,
      wardStats,
      householdSizeStats,
      births: {
        total: birthsThisYear,
        thisYear: birthsThisYear
      },
      deaths: {
        total: deathsThisYear,
        thisYear: deathsThisYear
      },
      movedOut: {
        total: movedOut,
        thisYear: movedOutThisYear
      },
      movedIn: {
        thisYear: movedInThisYear
      }
    })
  } catch (error) {
    console.error('Error querying statistics:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi truy vấn thống kê' },
      { status: 500 }
    )
  }
}

