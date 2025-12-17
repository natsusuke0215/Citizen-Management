import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const persons = await prisma.person.findMany({
      include: {
        household: {
          include: {
            district: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(persons)
  } catch (error) {
    console.error('Error fetching persons:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách nhân khẩu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const { fullName, dateOfBirth, gender, idNumber, relationship, householdId } = await request.json()

    if (!fullName || !dateOfBirth || !gender || !idNumber || !relationship || !householdId) {
      return NextResponse.json(
        { message: 'Tất cả các trường là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if ID number already exists
    const existingPerson = await prisma.person.findUnique({
      where: { idNumber }
    })

    if (existingPerson) {
      return NextResponse.json(
        { message: 'Số CMND/CCCD đã tồn tại' },
        { status: 400 }
      )
    }

    const person = await prisma.person.create({
      data: {
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        idNumber,
        relationship,
        householdId
      },
      include: {
        household: {
          include: {
            district: true
          }
        }
      }
    })

    return NextResponse.json(person, { status: 201 })
  } catch (error) {
    console.error('Error creating person:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo nhân khẩu' },
      { status: 500 }
    )
  }
}

