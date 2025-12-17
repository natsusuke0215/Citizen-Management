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
            district: true
          }
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
    const { fullName, dateOfBirth, gender, idNumber, relationship, householdId } = await request.json()

    if (!fullName || !dateOfBirth || !gender || !idNumber || !relationship || !householdId) {
      return NextResponse.json(
        { message: 'Tất cả các trường là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if ID number already exists (excluding current person)
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

    const person = await prisma.person.update({
      where: { id: params.id },
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

