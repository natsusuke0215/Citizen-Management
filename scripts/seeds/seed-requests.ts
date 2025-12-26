import { PrismaClient } from '@prisma/client'

export async function seedRequests(prisma: PrismaClient, userId: string, householdId: string) {
  console.log('📝 Đang tạo requests...')

  // Tạo yêu cầu mẫu
  await prisma.request.create({
    data: {
      id: 'request-1',
      type: 'HOUSEHOLD_UPDATE',
      description: 'Cập nhật địa chỉ hộ khẩu',
      data: JSON.stringify({
        oldAddress: '123 Đường ABC cũ',
        newAddress: '123 Đường ABC mới'
      }),
      userId: userId,
      householdId: householdId
    }
  })
}

