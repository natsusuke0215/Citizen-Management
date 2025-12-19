import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Lấy lịch sử thay đổi của nhân khẩu
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const changes = await prisma.personChangeHistory.findMany({
      where: { personId: params.id },
      orderBy: { changeDate: 'desc' }
    })

    return NextResponse.json(changes)
  } catch (error) {
    console.error('Error fetching person changes:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy lịch sử thay đổi' },
      { status: 500 }
    )
  }
}

// Ghi nhận thay đổi nhân khẩu (chuyển đi, qua đời, v.v.)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { changeType, changeDate, description, moveOutDate, moveOutPlace, notes } = await request.json()

    if (!changeType || !changeDate) {
      return NextResponse.json(
        { message: 'Loại thay đổi và ngày thay đổi là bắt buộc' },
        { status: 400 }
      )
    }

    // Get old data
    const oldPerson = await prisma.person.findUnique({
      where: { id: params.id }
    })

    if (!oldPerson) {
      return NextResponse.json(
        { message: 'Không tìm thấy nhân khẩu' },
        { status: 404 }
      )
    }

    // Update person status based on change type
    let updateData: any = {}
    if (changeType === 'MOVE_OUT') {
      updateData = {
        status: 'MOVED_OUT',
        moveOutDate: moveOutDate ? new Date(moveOutDate) : new Date(changeDate),
        moveOutPlace: moveOutPlace || null,
        notes: notes || null
      }
    } else if (changeType === 'DECEASED') {
      updateData = {
        status: 'DECEASED',
        notes: 'Đã qua đời'
      }
    }

    const updatedPerson = await prisma.person.update({
      where: { id: params.id },
      data: updateData
    })

    // Create change history
    const changeHistory = await prisma.personChangeHistory.create({
      data: {
        personId: params.id,
        changeType,
        changeDate: new Date(changeDate),
        description: description || `Thay đổi: ${changeType}`,
        oldData: JSON.stringify(oldPerson),
        newData: JSON.stringify(updatedPerson)
      }
    })

    return NextResponse.json(changeHistory, { status: 201 })
  } catch (error) {
    console.error('Error recording person change:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi ghi nhận thay đổi' },
      { status: 500 }
    )
  }
}




