import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Tách hộ từ một hộ khẩu đã có
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { 
      newHouseholdId, 
      ownerName, 
      address, 
      street, 
      ward, 
      district, 
      personIds,
      personRelationships,
      splitReason,
      splitDate
    } = await request.json()

    if (!newHouseholdId || !ownerName || !address || !ward || !district || !personIds || !Array.isArray(personIds) || personIds.length === 0) {
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

    // Move persons to new household and update relationships
    const personsToMove = await prisma.person.findMany({
      where: {
        id: { in: personIds },
        householdId: params.id
      }
    })

    for (let i = 0; i < personsToMove.length; i++) {
      const personId = personIds[i]
      const newRelationship = personRelationships && personRelationships[personId] 
        ? personRelationships[personId] 
        : null

      await prisma.person.update({
        where: { id: personId },
        data: {
          householdId: newHousehold.id,
          relationship: newRelationship
        }
      })
    }

    const splitDateObj = splitDate ? new Date(splitDate) : new Date()
    const description = splitReason 
      ? `Tách hộ khẩu thành hộ khẩu mới: ${newHouseholdId}. Lý do: ${splitReason}`
      : `Tách hộ khẩu thành hộ khẩu mới: ${newHouseholdId}`

    // Record change history for original household
    await prisma.householdChangeHistory.create({
      data: {
        householdId: params.id,
        changeType: 'SPLIT',
        changeDate: splitDateObj,
        description: description,
        newData: JSON.stringify({ 
          splitTo: newHousehold.id,
          splitReason: splitReason || null,
          splitDate: splitDateObj.toISOString()
        })
      }
    })

    // Record change history for new household
    await prisma.householdChangeHistory.create({
      data: {
        householdId: newHousehold.id,
        changeType: 'SPLIT',
        changeDate: splitDateObj,
        description: `Hộ khẩu được tách từ: ${originalHousehold.householdId}${splitReason ? `. Lý do: ${splitReason}` : ''}`,
        newData: JSON.stringify({ 
          splitFrom: params.id,
          splitReason: splitReason || null,
          splitDate: splitDateObj.toISOString()
        })
      }
    })

    // Record person change history
    const persons = await prisma.person.findMany({
      where: { id: { in: personIds } }
    })

    for (const person of persons) {
      const newRelationship = personRelationships && personRelationships[person.id] 
        ? personRelationships[person.id] 
        : null

      await prisma.personChangeHistory.create({
        data: {
          personId: person.id,
          changeType: 'SPLIT_HOUSEHOLD',
          changeDate: splitDateObj,
          description: `Chuyển sang hộ khẩu mới: ${newHouseholdId}${splitReason ? `. Lý do: ${splitReason}` : ''}`,
          oldData: JSON.stringify({ 
            householdId: params.id,
            relationship: person.relationship 
          }),
          newData: JSON.stringify({ 
            householdId: newHousehold.id,
            relationship: newRelationship
          })
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





