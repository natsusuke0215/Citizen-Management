import { PrismaClient } from '@prisma/client'

export async function cleanupData(prisma: PrismaClient) {
  console.log('🧹 Đang xóa dữ liệu cũ...')
  try {
    await prisma.culturalCenterUsageFee.deleteMany()
    await prisma.culturalCenterBooking.deleteMany()
    await prisma.culturalCenterActivity.deleteMany()
    await prisma.culturalCenterAsset.deleteMany()
    await prisma.culturalCenter.deleteMany()
    
    await prisma.temporaryResidence.deleteMany()
    await prisma.temporaryAbsence.deleteMany()
    await prisma.personChangeHistory.deleteMany()
    await prisma.householdChangeHistory.deleteMany()
    
    await prisma.request.deleteMany()
    await prisma.notification.deleteMany()
    
    // Ngắt kết nối User - Household trước khi xóa Household
    // await prisma.user.updateMany({ data: { householdId: null } })
    
    await prisma.person.deleteMany()
    await prisma.user.deleteMany() 
    await prisma.household.deleteMany()
    await prisma.district.deleteMany()
  } catch (error) {
    console.log('⚠️  Lỗi khi xóa dữ liệu cũ (có thể bỏ qua nếu lần đầu chạy):', error)
  }
}

