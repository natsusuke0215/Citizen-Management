import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function deleteTamTruSpecial() {
  try {
    console.log('🔍 Đang tìm hộ khẩu TAM_TRU_SPECIAL...')
    
    // Tìm hộ khẩu TAM_TRU_SPECIAL
    const household = await prisma.household.findFirst({
      where: { householdId: 'TAM_TRU_SPECIAL' },
      include: {
        persons: true
      }
    })

    if (!household) {
      console.log('✅ Không tìm thấy hộ khẩu TAM_TRU_SPECIAL')
      return
    }

    console.log(`📋 Tìm thấy hộ khẩu với ${household.persons.length} nhân khẩu`)

    // Lấy danh sách person IDs
    const personIds = household.persons.map(p => p.id)

    if (personIds.length > 0) {
      console.log('🗑️  Đang xóa dữ liệu liên quan...')
      
      // Xóa TemporaryResidence liên quan
      const deletedResidences = await prisma.temporaryResidence.deleteMany({
        where: { personId: { in: personIds } }
      })
      console.log(`   - Đã xóa ${deletedResidences.count} bản ghi tạm trú`)

      // Xóa TemporaryAbsence liên quan
      const deletedAbsences = await prisma.temporaryAbsence.deleteMany({
        where: { personId: { in: personIds } }
      })
      console.log(`   - Đã xóa ${deletedAbsences.count} bản ghi tạm vắng`)

      // Xóa PersonChangeHistory liên quan
      const deletedPersonHistory = await prisma.personChangeHistory.deleteMany({
        where: { personId: { in: personIds } }
      })
      console.log(`   - Đã xóa ${deletedPersonHistory.count} bản ghi lịch sử nhân khẩu`)

      // Xóa Persons
      const deletedPersons = await prisma.person.deleteMany({
        where: { id: { in: personIds } }
      })
      console.log(`   - Đã xóa ${deletedPersons.count} nhân khẩu`)
    }

    // Xóa HouseholdChangeHistory
    const deletedHouseholdHistory = await prisma.householdChangeHistory.deleteMany({
      where: { householdId: household.id }
    })
    console.log(`   - Đã xóa ${deletedHouseholdHistory.count} bản ghi lịch sử hộ khẩu`)

    // Xóa Requests liên quan (nếu có)
    const deletedRequests = await prisma.request.deleteMany({
      where: { householdId: household.id }
    })
    console.log(`   - Đã xóa ${deletedRequests.count} yêu cầu liên quan`)

    // Cuối cùng, xóa hộ khẩu
    await prisma.household.delete({
      where: { id: household.id }
    })
    console.log('✅ Đã xóa hộ khẩu TAM_TRU_SPECIAL thành công!')

  } catch (error) {
    console.error('❌ Lỗi khi xóa hộ khẩu TAM_TRU_SPECIAL:', error)
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

deleteTamTruSpecial()
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })

