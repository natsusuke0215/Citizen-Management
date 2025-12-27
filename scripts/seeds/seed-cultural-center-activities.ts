import { PrismaClient } from '@prisma/client'

export async function seedCulturalCenterActivities(prisma: PrismaClient) {
  console.log('🎭 Đang tạo cultural center activities...')

  try {
    await prisma.culturalCenterActivity.create({
      data: {
        title: 'Họp sinh hoạt tổ dân phố tháng 12',
        description: 'Cuộc họp định kỳ hàng tháng',
        activityType: 'MEETING',
        startDate: new Date('2024-12-15T09:00:00'),
        endDate: new Date('2024-12-15T11:00:00'),
        culturalCenterId: 'center-1',
        organizer: 'Tổ trưởng',
        participantCount: 50
      }
    })
  } catch (error: any) {
    if (error.code === 'P2003' || error.message?.includes('CulturalCenterActivity')) {
      console.log('⚠️  Bảng hoạt động chưa được tạo, bỏ qua tạo hoạt động mẫu')
    } else {
      throw error
    }
  }
}

