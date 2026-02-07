import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Lấy lịch sử thay đổi của hộ khẩu
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Check if household exists
    const household = await prisma.household.findUnique({
      where: { id: params.id }
    })

    if (!household) {
      return NextResponse.json(
        { message: 'Không tìm thấy hộ khẩu' },
        { status: 404 }
      )
    }

    // Get change history
    const history = await prisma.householdChangeHistory.findMany({
      where: {
        householdId: params.id
      },
      orderBy: {
        changeDate: 'desc'
      }
    })

    return NextResponse.json(history)
  } catch (error) {
    console.error('Error fetching household history:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy lịch sử thay đổi' },
      { status: 500 }
    )
  }
}




