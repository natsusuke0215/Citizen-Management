import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Tách hộ từ một hộ khẩu đã có
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { newHouseholdId, ownerName, address, street, ward, district, personIds } = await request.json()

    if (!newHouseholdId || !ownerName || !address || !ward || !district || !personIds || !Array.isArray(personIds)) {
      return NextResponse.json(
        { message: 'Thông tin hộ khẩu mới và danh sách nhân khẩu là bắt buộc' },
        { status: 400 }
      )
    }

    // Get original household
    const originalHousehold = await prisma.household.findUnique({
      where: { id: params.id },
      include: { districtRelation: true }
    })

    if (!originalHousehold) {
      return NextResponse.json(
        { message: 'Không tìm thấy hộ khẩu gốc' },
        { status: 404 }
      )
    }

    // Check if new household ID already exists
    const existingHousehold = await prisma.household.findUnique({
      where: { householdId: newHouseholdId }
    })

    if (existingHousehold) {
      return NextResponse.json(
        { message: 'Số hộ khẩu mới đã tồn tại' },
        { status: 400 }
      )
    }

    // Create new household
    const newHousehold = await prisma.household.create({
      data: {
        householdId: newHouseholdId,
        ownerName,
        address,
        street: street || null,
        ward,
        district,
        districtId: originalHousehold.districtId,
        splitFromId: params.id
      },
      include: {
        districtRelation: true,
        persons: true
      }
    })

    // Move persons to new household
    await prisma.person.updateMany({
      where: {
        id: { in: personIds },
        householdId: params.id
      },
      data: {
        householdId: newHousehold.id
      }
    })

    // Record change history for original household
    await prisma.householdChangeHistory.create({
      data: {
        householdId: params.id,
        changeType: 'SPLIT',
        changeDate: new Date(),
        description: `Tách hộ khẩu thành hộ khẩu mới: ${newHouseholdId}`,
        newData: JSON.stringify({ splitTo: newHousehold.id })
      }
    })

    // Record change history for new household
    await prisma.householdChangeHistory.create({
      data: {
        householdId: newHousehold.id,
        changeType: 'SPLIT',
        changeDate: new Date(),
        description: `Hộ khẩu được tách từ: ${originalHousehold.householdId}`,
        newData: JSON.stringify({ splitFrom: params.id })
      }
    })

    // Record person change history
    const persons = await prisma.person.findMany({
      where: { id: { in: personIds } }
    })

    for (const person of persons) {
      await prisma.personChangeHistory.create({
        data: {
          personId: person.id,
          changeType: 'SPLIT_HOUSEHOLD',
          changeDate: new Date(),
          description: `Chuyển sang hộ khẩu mới: ${newHouseholdId}`,
          oldData: JSON.stringify({ householdId: params.id }),
          newData: JSON.stringify({ householdId: newHousehold.id })
        }
      })
    }

    const result = await prisma.household.findUnique({
      where: { id: newHousehold.id },
      include: {
        districtRelation: true,
        persons: true
      }
    })

    return NextResponse.json(result, { status: 201 })
  } catch (error) {
    console.error('Error splitting household:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tách hộ khẩu' },
      { status: 500 }
    )
  }
}




