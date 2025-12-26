import { PrismaClient } from '@prisma/client'

export interface SeedDistrictsResult {
  district1: { id: string }
  district2: { id: string }
}

export async function seedDistricts(prisma: PrismaClient): Promise<SeedDistrictsResult> {
  console.log('🏘️  Đang tạo districts...')

  // Tạo khu phố
  const district1 = await prisma.district.create({
    data: {
      id: 'district-1',
      name: 'Khu phố 1',
      description: 'Khu phố trung tâm thành phố'
    }
  })

  const district2 = await prisma.district.create({
    data: {
      id: 'district-2',
      name: 'Khu phố 2',
      description: 'Khu phố phía đông'
    }
  })

  return { district1, district2 }
}

