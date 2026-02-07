import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    // Lấy tất cả nhân khẩu và hộ khẩu
    const [allPersons, allHouseholds, districts] = await Promise.all([
      prisma.person.findMany({
        select: {
          id: true,
          dateOfBirth: true,
          gender: true,
          ethnicity: true,
          religion: true,
          status: true,
          moveOutDate: true,
          createdAt: true,
          registrationDate: true,
        }
      }),
      prisma.household.findMany({
        select: {
          id: true,
          address: true,
          street: true,
          ward: true,
          district: true,
          districtId: true,
        }
      }),
      prisma.district.findMany()
    ])

    // Tính toán thống kê
    const totalPersons = allPersons.length
    const totalHouseholds = allHouseholds.length

    // Tính mật độ dân cư (số người/km²) - giả sử diện tích khu vực là 10 km²
    const areaKm2 = 10 // Có thể lấy từ database sau
    const populationDensity = totalPersons / areaKm2

    // Thống kê theo độ tuổi
    const now = new Date()
    const ageGroups = {
      '0-17': 0,
      '18-30': 0,
      '31-50': 0,
      '51-65': 0,
      '65+': 0
    }

    allPersons.forEach(person => {
      if (person.status === 'ACTIVE') {
        const age = Math.floor((now.getTime() - new Date(person.dateOfBirth).getTime()) / (1000 * 60 * 60 * 24 * 365.25))
        if (age < 18) ageGroups['0-17']++
        else if (age <= 30) ageGroups['18-30']++
        else if (age <= 50) ageGroups['31-50']++
        else if (age <= 65) ageGroups['51-65']++
        else ageGroups['65+']++
      }
    })

    // Thống kê theo giới tính
    const genderStats = {
      'Nam': allPersons.filter(p => p.gender === 'Nam' || p.gender === 'MALE' || p.gender === 'male').length,
      'Nữ': allPersons.filter(p => p.gender === 'Nữ' || p.gender === 'FEMALE' || p.gender === 'female').length,
      'Khác': allPersons.filter(p => p.gender !== 'Nam' && p.gender !== 'Nữ' && p.gender !== 'MALE' && p.gender !== 'FEMALE' && p.gender !== 'male' && p.gender !== 'female').length
    }

    // Thống kê theo dân tộc
    const ethnicityStats: Record<string, number> = {}
    allPersons.forEach(person => {
      if (person.status === 'ACTIVE' && person.ethnicity) {
        ethnicityStats[person.ethnicity] = (ethnicityStats[person.ethnicity] || 0) + 1
      }
    })

    // Thống kê theo tôn giáo
    const religionStats: Record<string, number> = {}
    allPersons.forEach(person => {
      if (person.status === 'ACTIVE' && person.religion) {
        religionStats[person.religion] = (religionStats[person.religion] || 0) + 1
      }
    })

    // Thống kê sinh tử
    const currentYear = now.getFullYear()
    const birthsThisYear = allPersons.filter(p => {
      const birthYear = new Date(p.dateOfBirth).getFullYear()
      return birthYear === currentYear
    }).length

    const deathsThisYear = allPersons.filter(p => {
      return p.status === 'DECEASED' && p.moveOutDate && new Date(p.moveOutDate).getFullYear() === currentYear
    }).length

    // Thống kê chuyển đi
    const movedOut = allPersons.filter(p => p.status === 'MOVED_OUT').length
    const movedOutThisYear = allPersons.filter(p => {
      return p.status === 'MOVED_OUT' && p.moveOutDate && new Date(p.moveOutDate).getFullYear() === currentYear
    }).length

    // Thống kê chuyển đến
    const movedInThisYear = allPersons.filter(p => {
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
    console.error('Error fetching detailed stats:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy thống kê chi tiết' },
      { status: 500 }
    )
  }
}

