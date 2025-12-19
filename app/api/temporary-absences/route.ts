import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Lấy danh sách tạm vắng
export async function GET(request: NextRequest) {
  try {
    const { status, personId } = Object.fromEntries(request.nextUrl.searchParams)

    const where: any = {}
    if (status) where.status = status
    if (personId) where.personId = personId

    const absences = await prisma.temporaryAbsence.findMany({
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

    return NextResponse.json(absences)
  } catch (error) {
    console.error('Error fetching temporary absences:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách tạm vắng' },
      { status: 500 }
    )
  }
}

// Tạo giấy tạm vắng
export async function POST(request: NextRequest) {
  try {
    const { personId, startDate, endDate, reason, destination } = await request.json()

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

    const absence = await prisma.temporaryAbsence.create({
      data: {
        personId,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        reason: reason || null,
        destination: destination || null,
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

    return NextResponse.json(absence, { status: 201 })
  } catch (error) {
    console.error('Error creating temporary absence:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo giấy tạm vắng' },
      { status: 500 }
    )
  }
}





