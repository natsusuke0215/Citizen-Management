import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

// Lấy thông tin phí sử dụng
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { message: 'Token không hợp lệ' },
        { status: 401 }
      )
    }

    const booking = await prisma.culturalCenterBooking.findUnique({
      where: { id: params.id },
      include: {
        usageFee: true
      }
    })

    if (!booking) {
      return NextResponse.json(
        { message: 'Không tìm thấy lịch đặt' },
        { status: 404 }
      )
    }

    return NextResponse.json(booking.usageFee || { bookingId: params.id, amount: booking.fee || 0 })
  } catch (error) {
    console.error('Error fetching usage fee:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy thông tin phí sử dụng' },
      { status: 500 }
    )
  }
}

// Tạo hoặc cập nhật phí sử dụng
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user || (user.role !== 'TEAM_LEADER' && user.role !== 'ADMIN' && user.role !== 'LEADER' && user.role !== 'DEPUTY')) {
      return NextResponse.json(
        { message: 'Chỉ tổ trưởng và tổ phó mới có quyền quản lý phí sử dụng' },
        { status: 403 }
      )
    }

    const { amount, paymentDate, paymentMethod, receiptNumber, notes } = await request.json()

    if (!amount) {
      return NextResponse.json(
        { message: 'Số tiền là bắt buộc' },
        { status: 400 }
      )
    }

    // Check if booking exists
    const booking = await prisma.culturalCenterBooking.findUnique({
      where: { id: params.id }
    })

    if (!booking) {
      return NextResponse.json(
        { message: 'Không tìm thấy lịch đặt' },
        { status: 404 }
      )
    }

    // Check if fee already exists
    const existingFee = await prisma.culturalCenterUsageFee.findUnique({
      where: { bookingId: params.id }
    })

    let usageFee
    if (existingFee) {
      // Update existing fee
      usageFee = await prisma.culturalCenterUsageFee.update({
        where: { bookingId: params.id },
        data: {
          amount: parseFloat(amount),
          paymentDate: paymentDate ? new Date(paymentDate) : null,
          paymentMethod: paymentMethod || null,
          receiptNumber: receiptNumber || null,
          notes: notes || null
        }
      })

      // Update booking fee paid status
      await prisma.culturalCenterBooking.update({
        where: { id: params.id },
        data: {
          feePaid: paymentDate ? true : false
        }
      })
    } else {
      // Create new fee
      usageFee = await prisma.culturalCenterUsageFee.create({
        data: {
          bookingId: params.id,
          amount: parseFloat(amount),
          paymentDate: paymentDate ? new Date(paymentDate) : null,
          paymentMethod: paymentMethod || null,
          receiptNumber: receiptNumber || null,
          notes: notes || null
        }
      })

      // Update booking fee paid status
      await prisma.culturalCenterBooking.update({
        where: { id: params.id },
        data: {
          feePaid: paymentDate ? true : false
        }
      })
    }

    return NextResponse.json(usageFee, { status: existingFee ? 200 : 201 })
  } catch (error) {
    console.error('Error creating/updating usage fee:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo/cập nhật phí sử dụng' },
      { status: 500 }
    )
  }
}

