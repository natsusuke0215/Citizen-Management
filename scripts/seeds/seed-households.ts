import { PrismaClient } from '@prisma/client'

export interface SeedHouseholdsResult {
  household1: { id: string }
  household2: { id: string }
}

export async function seedHouseholds(
  prisma: PrismaClient,
  district1Id: string,
  district2Id: string
): Promise<SeedHouseholdsResult> {
  console.log('🏠 Đang tạo households...')

  // Tạo hộ khẩu
  const household1 = await prisma.household.create({
    data: {
      id: 'household-1',
      householdId: 'HK001',
      ownerName: 'Nguyễn Văn A',
      address: '123',
      street: 'Đường ABC',
      ward: 'Phường La Khê',
      district: 'Quận Hà Đông',
      districtId: district1Id
    }
  })

  const household2 = await prisma.household.create({
    data: {
      id: 'household-2',
      householdId: 'HK002',
      ownerName: 'Trần Văn B',
      address: '456',
      street: 'Đường DEF',
      ward: 'Phường La Khê',
      district: 'Quận Hà Đông',
      districtId: district2Id
    }
  })

  return { household1, household2 }
}

