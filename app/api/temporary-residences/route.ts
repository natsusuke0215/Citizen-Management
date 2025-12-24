import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Lấy danh sách tạm trú
export async function GET(request: NextRequest) {
  try {
    const { status, personId, householdId } = Object.fromEntries(request.nextUrl.searchParams)

    const where: any = {}
    if (status) where.status = status
    if (personId) where.personId = personId
    if (householdId) where.householdId = householdId

    const residences = await prisma.temporaryResidence.findMany({
      where,
      include: {
        person: {
          include: {
            household: {
              include: {
                districtRelation: true
              }
            }
          }
        }
      },
      orderBy: { startDate: 'desc' }
    })

    return NextResponse.json(residences)
  } catch (error) {
    console.error('Error fetching temporary residences:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách tạm trú' },
      { status: 500 }
    )
  }
}

// Tạo giấy tạm trú
export async function POST(request: NextRequest) {
  try {
    const { 
      // Có thể nhận personId (nếu đã có) hoặc thông tin người mới
      personId,
      // Thông tin người tạm trú (nếu chưa có trong hệ thống)
      fullName,
      dateOfBirth,
      gender,
      idNumber,
      idType,
      // Thông tin tạm trú
      householdId, // Hộ khẩu nơi tạm trú (optional)
      temporaryAddress, // Địa chỉ tạm trú
      startDate,
      endDate,
      originalAddress, // Địa chỉ thường trú gốc
      reason
    } = await request.json()

    if (!startDate) {
      return NextResponse.json(
        { message: 'Ngày bắt đầu là bắt buộc' },
        { status: 400 }
      )
    }

    let person

    if (personId) {
      // Nếu có personId, tìm người đó
      person = await prisma.person.findUnique({
        where: { id: personId }
      })

      if (!person) {
        return NextResponse.json(
          { message: 'Không tìm thấy nhân khẩu' },
          { status: 404 }
        )
      }
    } else {
      // Nếu không có personId, cần thông tin để tạo người mới
      if (!fullName || !dateOfBirth || !gender) {
        return NextResponse.json(
          { message: 'Họ tên, ngày sinh và giới tính là bắt buộc' },
          { status: 400 }
        )
      }

      // Kiểm tra xem đã có người với CMND/CCCD này chưa
      if (idNumber) {
        const existingPerson = await prisma.person.findUnique({
          where: { idNumber }
        })

        if (existingPerson) {
          person = existingPerson
        }
      }

      // Nếu chưa có, tạo Person mới
      // Người tạm trú không thuộc hộ khẩu ở địa phương này
      // Cần tạo một hộ khẩu đặc biệt hoặc để null
      // Tạm thời tạo một hộ khẩu đặc biệt "TẠM_TRÚ" nếu chưa có
      if (!person) {
        // Tìm hoặc tạo hộ khẩu đặc biệt cho người tạm trú
        let tempHousehold = await prisma.household.findFirst({
          where: { householdId: 'TAM_TRU_SPECIAL' }
        })

        if (!tempHousehold) {
          // Lấy district đầu tiên để tạo hộ khẩu đặc biệt
          const firstDistrict = await prisma.district.findFirst()
          if (!firstDistrict) {
            return NextResponse.json(
              { message: 'Chưa có khu phố nào trong hệ thống' },
              { status: 400 }
            )
          }

          tempHousehold = await prisma.household.create({
            data: {
              householdId: 'TAM_TRU_SPECIAL',
              ownerName: 'Hộ khẩu đặc biệt - Tạm trú',
              address: 'Địa chỉ tạm trú',
              ward: 'Phường tạm trú',
              district: 'Quận tạm trú',
              districtId: firstDistrict.id,
              householdType: 'TẠM_TRÚ'
            }
          })
        }

        person = await prisma.person.create({
          data: {
            fullName,
            dateOfBirth: new Date(dateOfBirth),
            gender,
            idType: idType || null,
            idNumber: idNumber || null,
            householdId: tempHousehold.id,
            status: 'ACTIVE'
          }
        })
      }
    }

    const residence = await prisma.temporaryResidence.create({
      data: {
        personId: person.id,
        householdId: householdId || null,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        originalAddress: originalAddress || null,
        reason: reason || null,
        status: 'ACTIVE'
      },
      include: {
        person: {
          include: {
            household: {
              include: {
                districtRelation: true
              }
            }
          }
        }
      }
    })

    return NextResponse.json(residence, { status: 201 })
  } catch (error) {
    console.error('Error creating temporary residence:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo giấy tạm trú' },
      { status: 500 }
    )
  }
}




