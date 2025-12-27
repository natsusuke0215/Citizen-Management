import { PrismaClient } from '@prisma/client'
import { cleanupData } from './seeds/seed-cleanup'
import { seedUsers, SeedUsersResult } from './seeds/seed-users'
import { seedDistricts, SeedDistrictsResult } from './seeds/seed-districts'
import { seedHouseholds, SeedHouseholdsResult } from './seeds/seed-households'
import { seedPersons } from './seeds/seed-persons'
import { seedCulturalCenters } from './seeds/seed-cultural-centers'
import { seedCulturalCenterBookings } from './seeds/seed-cultural-center-bookings'
import { seedRequests } from './seeds/seed-requests'
import { seedCulturalCenterAssets } from './seeds/seed-cultural-center-assets'
import { seedCulturalCenterActivities } from './seeds/seed-cultural-center-activities'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu...')
  console.log('⚠️  Lưu ý: Đảm bảo đã chạy "npx prisma db push" hoặc "npx prisma migrate dev" trước!')

  // 1. Xóa dữ liệu cũ
  await cleanupData(prisma)

  // 2. Tạo dữ liệu mới theo thứ tự phụ thuộc
  const users: SeedUsersResult = await seedUsers(prisma)
  
  const districts: SeedDistrictsResult = await seedDistricts(prisma)
  
  const households: SeedHouseholdsResult = await seedHouseholds(
    prisma,
    districts.district1.id,
    districts.district2.id
  )

  // Gán user vào hộ khẩu
  await prisma.user.update({
    where: { id: users.user.id },
    data: { householdId: households.household1.id }
  })

  await seedPersons(prisma, households.household1.id)
  
  await seedCulturalCenters(prisma)
  
  await seedCulturalCenterBookings(prisma, users.user.id)
  
  await seedRequests(prisma, users.user.id, households.household1.id)
  
  await seedCulturalCenterAssets(prisma)
  
  await seedCulturalCenterActivities(prisma)

  console.log('✅ Dữ liệu mẫu đã được tạo thành công!')
  console.log('👤 Admin: admin@example.com / admin123')
  console.log('👤 Tổ trưởng: totruong@gmail.com / 123456')
  console.log('👤 Tổ phó: topho@gmail.com / 123456')
  console.log('👤 QL CSVC: quanlycsvc@gmail.com / 123456')
  console.log('👤 User: user@example.com / user123')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
