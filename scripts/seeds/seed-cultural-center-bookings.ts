import { PrismaClient } from '@prisma/client'

export async function seedCulturalCenterBookings(prisma: PrismaClient, userId: string) {
  console.log('📅 Đang tạo cultural center bookings...')

  // Tạo lịch đặt mẫu
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)

  const endTime = new Date(tomorrow)
  endTime.setHours(11, 0, 0, 0)

  await prisma.culturalCenterBooking.create({
    data: {
      id: 'booking-1',
      title: 'Họp tổ dân phố',
      description: 'Cuộc họp định kỳ tổ dân phố',
      startTime: tomorrow,
      endTime: endTime,
      visibility: 'PUBLIC',
      status: 'APPROVED',
      type: 'MEETING',
      fee: null,
      feePaid: false,
      culturalCenterId: 'center-1',
      userId: userId
    }
  })

  // Tạo đặt lịch đám cưới (có phí)
  const weddingDate = new Date()
  weddingDate.setDate(weddingDate.getDate() + 7)
  weddingDate.setHours(18, 0, 0, 0)

  const weddingEnd = new Date(weddingDate)
  weddingEnd.setHours(22, 0, 0, 0)

  await prisma.culturalCenterBooking.create({
    data: {
      id: 'booking-2',
      title: 'Đám cưới gia đình Nguyễn Văn A',
      description: 'Tổ chức đám cưới tại hội trường',
      startTime: weddingDate,
      endTime: weddingEnd,
      visibility: 'PUBLIC',
      status: 'PENDING',
      type: 'WEDDING',
      fee: 500000,
      feePaid: false,
      culturalCenterId: 'center-1',
      userId: userId
    }
  })

  // Thêm một số đặt lịch khác
  const nextWeek = new Date()
  nextWeek.setDate(nextWeek.getDate() + 5)
  nextWeek.setHours(14, 0, 0, 0)
  const nextWeekEnd = new Date(nextWeek)
  nextWeekEnd.setHours(16, 0, 0, 0)

  await prisma.culturalCenterBooking.create({
    data: {
      id: 'booking-3',
      title: 'Lớp học tiếng Anh',
      description: 'Lớp học tiếng Anh cho trẻ em',
      startTime: nextWeek,
      endTime: nextWeekEnd,
      visibility: 'PUBLIC',
      status: 'APPROVED',
      type: 'ACTIVITY',
      fee: null,
      feePaid: false,
      culturalCenterId: 'center-2',
      userId: userId
    }
  })

  const sportsDate = new Date()
  sportsDate.setDate(sportsDate.getDate() + 3)
  sportsDate.setHours(18, 0, 0, 0)
  const sportsEnd = new Date(sportsDate)
  sportsEnd.setHours(20, 0, 0, 0)

  await prisma.culturalCenterBooking.create({
    data: {
      id: 'booking-4',
      title: 'Tập luyện cầu lông',
      description: 'Tập luyện cầu lông hàng tuần',
      startTime: sportsDate,
      endTime: sportsEnd,
      visibility: 'PUBLIC',
      status: 'APPROVED',
      type: 'ACTIVITY',
      fee: 50000,
      feePaid: true,
      culturalCenterId: 'center-8',
      userId: userId
    }
  })
}

