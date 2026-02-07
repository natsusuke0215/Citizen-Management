import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Tìm số hộ khẩu mới tiếp theo dựa trên số hộ khẩu cũ
export async function POST(request: NextRequest) {
  try {
    const { oldHouseholdId } = await request.json()

    if (!oldHouseholdId) {
      return NextResponse.json(
        { message: 'Số hộ khẩu cũ là bắt buộc' },
        { status: 400 }
      )
    }

    // Tách phần prefix và số từ số hộ khẩu cũ
    // Ví dụ: "HK123" -> prefix: "HK", number: 123
    const match = oldHouseholdId.match(/^([A-Za-z]*)(\d+)$/)
    
    if (!match) {
      return NextResponse.json(
        { message: 'Định dạng số hộ khẩu không hợp lệ' },
        { status: 400 }
      )
    }

    const prefix = match[1] || ''
    const numberStr = match[2]
    let number = parseInt(numberStr, 10)

    if (isNaN(number)) {
      return NextResponse.json(
        { message: 'Không thể tách số từ số hộ khẩu cũ' },
        { status: 400 }
      )
    }

    // Tìm số hộ khẩu tiếp theo chưa được sử dụng
    let newNumber = number + 1
    let maxAttempts = 1000 // Giới hạn số lần thử để tránh vòng lặp vô hạn
    let attempts = 0

    while (attempts < maxAttempts) {
      // Tạo số hộ khẩu mới với cùng format (giữ nguyên số chữ số)
      const paddedNumber = newNumber.toString().padStart(numberStr.length, '0')
      const newHouseholdId = `${prefix}${paddedNumber}`

      // Kiểm tra xem số hộ khẩu này đã tồn tại chưa
      const existingHousehold = await prisma.household.findUnique({
        where: { householdId: newHouseholdId }
      })

      if (!existingHousehold) {
        // Tìm thấy số hộ khẩu chưa được sử dụng
        return NextResponse.json({ 
          newHouseholdId,
          oldHouseholdId 
        })
      }

      // Nếu đã tồn tại, tăng số lên 1 và thử lại
      newNumber++
      attempts++
    }

    // Nếu không tìm thấy sau nhiều lần thử, trả về lỗi
    return NextResponse.json(
      { message: 'Không thể tìm thấy số hộ khẩu mới hợp lệ' },
      { status: 500 }
    )
  } catch (error) {
    console.error('Error finding next household ID:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tìm số hộ khẩu mới' },
      { status: 500 }
    )
  }
}

