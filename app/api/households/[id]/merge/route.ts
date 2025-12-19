import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Nhập (gộp) hộ khẩu - gộp hộ khẩu nguồn vào hộ khẩu đích
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { 
      sourceHouseholdId,
      mergeReason,
      mergeDate
    } = await request.json()

    if (!sourceHouseholdId) {
      return NextResponse.json(
        { message: 'Vui lòng chọn hộ khẩu cần nhập' },
        { status: 400 }
      )
    }

    // Get target household (household to merge into)
    const targetHousehold = await prisma.household.findUnique({
      where: { id: params.id },
      include: { 
        districtRelation: true,
        persons: true
      }
    })

    if (!targetHousehold) {
      return NextResponse.json(
        { message: 'Không tìm thấy hộ khẩu đích' },
        { status: 404 }
      )
    }

    // Get source household (household to merge from)
    const sourceHousehold = await prisma.household.findUnique({
      where: { id: sourceHouseholdId },
      include: {
        districtRelation: true,
        persons: true,
        members: true
      }
    })

    if (!sourceHousehold) {
      return NextResponse.json(
        { message: 'Không tìm thấy hộ khẩu nguồn' },
        { status: 404 }
      )
    }

    if (targetHousehold.id === sourceHousehold.id) {
      return NextResponse.json(
        { message: 'Không thể nhập hộ khẩu vào chính nó' },
        { status: 400 }
      )
    }

    // Check if source household has members (users linked)
    if (sourceHousehold.members.length > 0) {
      return NextResponse.json(
        { message: 'Không thể nhập hộ khẩu có người dùng liên kết. Vui lòng hủy liên kết trước.' },
        { status: 400 }
      )
    }

    const mergeDateObj = mergeDate ? new Date(mergeDate) : new Date()

    // Move all persons from source to target household
    for (const person of sourceHousehold.persons) {
      await prisma.person.update({
        where: { id: person.id },
        data: {
          householdId: targetHousehold.id,
          // Update relationship if person was owner of source household
          relationship: person.relationship || null
        }
      })

      // Record person change history
      await prisma.personChangeHistory.create({
        data: {
          personId: person.id,
          changeType: 'MOVE_OUT',
          changeDate: mergeDateObj,
          description: `Nhập vào hộ khẩu: ${targetHousehold.householdId}${mergeReason ? `. Lý do: ${mergeReason}` : ''}`,
          oldData: JSON.stringify({
            householdId: sourceHousehold.id,
            householdNumber: sourceHousehold.householdId
          }),
          newData: JSON.stringify({
            householdId: targetHousehold.id,
            householdNumber: targetHousehold.householdId
          })
        }
      })
    }

    // Record change history for target household
    const targetDescription = mergeReason 
      ? `Nhập hộ khẩu ${sourceHousehold.householdId} vào hộ khẩu này. Lý do: ${mergeReason}`
      : `Nhập hộ khẩu ${sourceHousehold.householdId} vào hộ khẩu này`

    await prisma.householdChangeHistory.create({
      data: {
        householdId: targetHousehold.id,
        changeType: 'MERGE',
        changeDate: mergeDateObj,
        description: targetDescription,
        newData: JSON.stringify({
          mergedFrom: sourceHousehold.id,
          mergedHouseholdNumber: sourceHousehold.householdId,
          mergeReason: mergeReason || null
        })
      }
    })

    // Record change history for source household
    const sourceDescription = mergeReason 
      ? `Hộ khẩu được nhập vào ${targetHousehold.householdId}. Lý do: ${mergeReason}`
      : `Hộ khẩu được nhập vào ${targetHousehold.householdId}`

    await prisma.householdChangeHistory.create({
      data: {
        householdId: sourceHousehold.id,
        changeType: 'MERGE',
        changeDate: mergeDateObj,
        description: sourceDescription,
        newData: JSON.stringify({
          mergedTo: targetHousehold.id,
          mergedHouseholdNumber: targetHousehold.householdId,
          mergeReason: mergeReason || null
        })
      }
    })

    // Delete source household (now empty)
    await prisma.household.delete({
      where: { id: sourceHousehold.id }
    })

    // Fetch updated target household
    const updatedHousehold = await prisma.household.findUnique({
      where: { id: targetHousehold.id },
      include: {
        districtRelation: true,
        persons: true
      }
    })

    return NextResponse.json(updatedHousehold, { status: 200 })
  } catch (error) {
    console.error('Error merging household:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi nhập hộ khẩu' },
      { status: 500 }
    )
  }
}
