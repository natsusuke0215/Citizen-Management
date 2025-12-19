import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const person = await prisma.person.findUnique({
      where: { id: params.id },
      include: {
        household: {
          include: {
            districtRelation: true
          }
        },
        changeHistory: {
          orderBy: { changeDate: 'desc' }
        },
        temporaryAbsences: {
          where: { status: 'ACTIVE' },
          orderBy: { startDate: 'desc' }
        },
        temporaryResidences: {
          where: { status: 'ACTIVE' },
          orderBy: { startDate: 'desc' }
        }
      }
    })

    if (!person) {
      return NextResponse.json(
        { message: 'Không tìm thấy nhân khẩu' },
        { status: 404 }
      )
    }

    return NextResponse.json(person)
  } catch (error) {
    console.error('Error fetching person:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy thông tin nhân khẩu' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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
      moveOutDate,
      moveOutPlace,
      notes
    } = await request.json()

    if (!fullName || !dateOfBirth || !gender || !householdId) {
      return NextResponse.json(
        { message: 'Họ tên, ngày sinh, giới tính và hộ khẩu là bắt buộc' },
        { status: 400 }
      )
    }

    // Get old data for history
    const oldPerson = await prisma.person.findUnique({
      where: { id: params.id }
    })

    // Check if ID number already exists (excluding current person, if provided)
    if (idNumber) {
      const existingPerson = await prisma.person.findFirst({
        where: {
          idNumber,
          id: { not: params.id }
        }
      })

      if (existingPerson) {
        return NextResponse.json(
          { message: 'Số CMND/CCCD đã tồn tại' },
          { status: 400 }
        )
      }
    }

    const person = await prisma.person.update({
      where: { id: params.id },
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
        moveOutDate: moveOutDate ? new Date(moveOutDate) : null,
        moveOutPlace: moveOutPlace || null,
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
        changeType: 'UPDATE',
        changeDate: new Date(),
        description: `Cập nhật thông tin nhân khẩu: ${fullName}`,
        oldData: oldPerson ? JSON.stringify(oldPerson) : null,
        newData: JSON.stringify(person)
      }
    })

    return NextResponse.json(person)
  } catch (error) {
    console.error('Error updating person:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật nhân khẩu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const person = await prisma.person.findUnique({
      where: { id: params.id }
    })

    if (!person) {
      return NextResponse.json(
        { message: 'Không tìm thấy nhân khẩu' },
        { status: 404 }
      )
    }

    await prisma.person.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ message: 'Xóa nhân khẩu thành công' })
  } catch (error) {
    console.error('Error deleting person:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xóa nhân khẩu' },
      { status: 500 }
    )
  }
}

