import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Chuyển hộ khẩu sang địa chỉ mới
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { 
      newAddress,
      newStreet,
      newWard,
      newDistrict,
      newDistrictId,
      transferReason,
      transferDate
    } = await request.json()

    if (!newAddress || !newWard || !newDistrict || !newDistrictId) {
      return NextResponse.json(
        { message: 'Thông tin địa chỉ mới là bắt buộc' },
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
        { message: 'Không tìm thấy hộ khẩu' },
        { status: 404 }
      )
    }

    // Get old data for history
    const oldData = {
      address: originalHousehold.address,
      street: originalHousehold.street,
      ward: originalHousehold.ward,
      district: originalHousehold.district,
      districtId: originalHousehold.districtId
    }

    // Update household
    const transferDateObj = transferDate ? new Date(transferDate) : new Date()
    const household = await prisma.household.update({
      where: { id: params.id },
      data: {
        address: newAddress,
        street: newStreet || null,
        ward: newWard,
        district: newDistrict,
        districtId: newDistrictId
      },
      include: {
        districtRelation: true,
        persons: true
      }
    })

    const description = transferReason 
      ? `Chuyển hộ khẩu từ ${oldData.address}, ${oldData.ward}, ${oldData.district} sang ${newAddress}, ${newWard}, ${newDistrict}. Lý do: ${transferReason}`
      : `Chuyển hộ khẩu từ ${oldData.address}, ${oldData.ward}, ${oldData.district} sang ${newAddress}, ${newWard}, ${newDistrict}`

    // Record change history
    await prisma.householdChangeHistory.create({
      data: {
        householdId: household.id,
        changeType: 'TRANSFER',
        changeDate: transferDateObj,
        description: description,
        oldData: JSON.stringify(oldData),
        newData: JSON.stringify({
          address: household.address,
          street: household.street,
          ward: household.ward,
          district: household.district,
          districtId: household.districtId
        })
      }
    })

    // Record person change history for all persons
    for (const person of household.persons) {
      await prisma.personChangeHistory.create({
        data: {
          personId: person.id,
          changeType: 'MOVE_OUT',
          changeDate: transferDateObj,
          description: `Chuyển địa chỉ cùng hộ khẩu: ${description}`,
          oldData: JSON.stringify({
            address: oldData.address,
            ward: oldData.ward,
            district: oldData.district
          }),
          newData: JSON.stringify({
            address: household.address,
            ward: household.ward,
            district: household.district
          })
        }
      })
    }

    return NextResponse.json(household, { status: 200 })
  } catch (error) {
    console.error('Error transferring household:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi chuyển hộ khẩu' },
      { status: 500 }
    )
  }
}




