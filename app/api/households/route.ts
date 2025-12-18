import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const households = await prisma.household.findMany({
      include: {
        districtRelation: true,
        persons: true,
        members: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(households)
  } catch (error) {
    console.error('Error fetching households:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách hộ khẩu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      householdId, 
      ownerName, 
      address, 
      street, 
      ward, 
      district, 
      districtId 
    } = await request.json()

    if (!householdId || !ownerName || !address || !ward || !district || !districtId) {
      return NextResponse.json(
        { message: 'Số hộ khẩu, tên chủ hộ, địa chỉ, phường, quận và khu phố là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if household ID already exists
    const existingHousehold = await prisma.household.findUnique({
      where: { householdId }
    })

    if (existingHousehold) {
      return NextResponse.json(
        { message: 'Số hộ khẩu đã tồn tại' },
        { status: 400 }
      )
    }

    const household = await prisma.household.create({
      data: {
        householdId,
        ownerName,
        address,
        street: street || null,
        ward,
        district,
        districtId
      },
      include: {
        districtRelation: true,
        members: true
      }
    })

    // Ghi lịch sử thay đổi
    await prisma.householdChangeHistory.create({
      data: {
        householdId: household.id,
        changeType: 'CREATE',
        changeDate: new Date(),
        description: `Tạo hộ khẩu mới: ${householdId}`,
        newData: JSON.stringify(household)
      }
    })

    return NextResponse.json(household, { status: 201 })
  } catch (error) {
    console.error('Error creating household:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo hộ khẩu' },
      { status: 500 }
    )
  }
}
