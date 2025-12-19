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
    const { personId, householdId, startDate, endDate, originalAddress, reason } = await request.json()

    if (!personId || !startDate) {
      return NextResponse.json(
        { message: 'Nhân khẩu và ngày bắt đầu là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if person exists
    const person = await prisma.person.findUnique({
      where: { id: personId }
    })

    if (!person) {
      return NextResponse.json(
        { message: 'Không tìm thấy nhân khẩu' },
        { status: 404 }
      )
    }

    const residence = await prisma.temporaryResidence.create({
      data: {
        personId,
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




