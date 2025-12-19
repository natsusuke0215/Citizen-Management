import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const persons = await prisma.person.findMany({
      include: {
        household: {
          include: {
            districtRelation: true
          }
        },
        changeHistory: {
          orderBy: { changeDate: 'desc' },
          take: 5
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
    const { 
      fullName, 
      dateOfBirth, 
      gender, 
      placeOfBirth,
      origin,
      ethnicity,
      religion,
      nationality,
      education,
      occupation,
      workplace,
      idType,
      idNumber, 
      idIssueDate,
      idIssuePlace,
      registrationDate,
      previousAddress,
      relationship, 
      householdId,
      status,
      notes
    } = await request.json()

    if (!fullName || !dateOfBirth || !gender || !householdId) {
      return NextResponse.json(
        { message: 'Họ tên, ngày sinh, giới tính và hộ khẩu là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if ID number already exists (if provided)
    if (idNumber) {
      const existingPerson = await prisma.person.findUnique({
        where: { idNumber }
      })

      if (existingPerson) {
        return NextResponse.json(
          { message: 'Số CMND/CCCD đã tồn tại' },
          { status: 400 }
        )
      }
    }

    const person = await prisma.person.create({
      data: {
        fullName,
        dateOfBirth: new Date(dateOfBirth),
        gender,
        placeOfBirth: placeOfBirth || null,
        origin: origin || null,
        ethnicity: ethnicity || null,
        religion: religion || null,
        nationality: nationality || null,
        education: education || null,
        occupation: occupation || null,
        workplace: workplace || null,
        idType: idType || null,
        idNumber: idNumber || null,
        idIssueDate: idIssueDate ? new Date(idIssueDate) : null,
        idIssuePlace: idIssuePlace || null,
        registrationDate: registrationDate ? new Date(registrationDate) : null,
        previousAddress: previousAddress || null,
        relationship: relationship || null,
        status: status || 'ACTIVE',
        notes: notes || null,
        householdId
      },
      include: {
        household: {
          include: {
            districtRelation: true
          }
        }
      }
    })

    // Ghi lịch sử thay đổi
    await prisma.personChangeHistory.create({
      data: {
        personId: person.id,
        changeType: 'ADD',
        changeDate: new Date(),
        description: `Thêm nhân khẩu mới: ${fullName}`,
        newData: JSON.stringify(person)
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

