import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Phan', 'Trương']
const givenNames = ['Văn', 'Thị', 'Hùng', 'Lan', 'An', 'Bảo', 'Minh', 'Hạnh', 'Huỳnh', 'Dũng', 'Huy']
const lastNames = ['An', 'Bình', 'Cường', 'Dũng', 'Hùng', 'Hương', 'Linh', 'Mai', 'Nga', 'Phương', 'Quang', 'Sơn', 'Trang']
const streets = ['Đường A', 'Đường B', 'Đường C', 'Đường D', 'Đường E', 'Đường F', 'Đường G', 'Đường H']
const wards = ['Phường La Khê', 'Phường X', 'Phường Y', 'Phường Z']
const districts = ['Quận Hà Đông', 'Quận Thanh Xuân', 'Quận Hoàn Kiếm', 'Quận Cầu Giấy']

function randomName() {
  const f = firstNames[randInt(0, firstNames.length - 1)]
  const g = givenNames[randInt(0, givenNames.length - 1)]
  const l = lastNames[randInt(0, lastNames.length - 1)]
  return `${f} ${g} ${l}`
}

function randomAddress() {
  const num = randInt(1, 999)
  const street = streets[randInt(0, streets.length - 1)]
  const ward = wards[randInt(0, wards.length - 1)]
  const district = districts[randInt(0, districts.length - 1)]
  return { address: String(num), street, ward, district }
}

function randomDateBetween(startYear = 1950, endYear = 2019) {
  const year = randInt(startYear, endYear)
  const month = randInt(0, 11)
  const day = randInt(1, 28)
  return new Date(year, month, day)
}

async function main() {
  console.log('🌱 Tạo dữ liệu nhiều hộ khẩu (500)...')

  // ensure some districts exist
  const existingDistricts = await prisma.district.findMany()
  let districtIds: string[] = existingDistricts.map(d => d.id)
  if (districtIds.length < 4) {
    for (let i = 0; i < 4; i++) {
      const id = `district-seed-${i+1}`
      const name = `Khu phố ${i+1}`
      const d = await prisma.district.upsert({
        where: { id },
        update: {},
        create: { id, name, description: `Khu phố mẫu ${i+1}` }
      })
      districtIds.push(d.id)
    }
  }

  const totalHouseholds = 500

  const usedIdNumbers = new Set<string>()
  const places = ['Hà Nội', 'Hưng Yên', 'Hải Phòng', 'Đà Nẵng', 'TP. Hồ Chí Minh', 'Nghệ An', 'Thái Bình', 'Bắc Ninh']
  const ethnicities = ['Kinh', 'Tày', 'Thái', 'Mường', 'Khmer']
  const religions = ['Không', 'Phật giáo', 'Công giáo', 'Hòa Hảo']
  const educations = ['Tiểu học', 'THCS', 'THPT', 'Cao đẳng', 'Đại học', 'Sau đại học']
  const occupations = ['Công nhân', 'Giáo viên', 'Làm nông', 'Nhân viên văn phòng', 'Kinh doanh', 'Nhà nước', 'Sinh viên']
  const idTypes = ['CCCD', 'CMND']

  for (let i = 1; i <= totalHouseholds; i++) {
    const householdId = `HK${String(i).padStart(4, '0')}`
    const ownerName = randomName()
    const { address, street, ward, district } = randomAddress()
    const districtId = districtIds[randInt(0, districtIds.length - 1)]

    const household = await prisma.household.upsert({
      where: { householdId },
      update: {},
      create: {
        householdId,
        ownerName,
        address,
        street,
        ward,
        district,
        districtId,
      }
    })

    // create 1-5 persons with full details
    const personCount = randInt(1, 5)
    for (let p = 0; p < personCount; p++) {
      const fullName = randomName()
      const dob = randomDateBetween(1950, 2015)

      // generate unique idNumber 12 digits (most will have one)
      let idNumber: string | null = null
      if (Math.random() < 0.95) {
        for (let attempt = 0; attempt < 10; attempt++) {
          const num = String(randInt(1e11, 9e11)).padStart(12, '0')
          if (!usedIdNumbers.has(num)) {
            idNumber = num
            usedIdNumbers.add(num)
            break
          }
        }
        if (!idNumber) {
          idNumber = `9${String(i).padStart(11, '0')}`.slice(0,12)
          usedIdNumbers.add(idNumber)
        }
      }

      const gender = Math.random() < 0.5 ? 'Nam' : 'Nữ'
      const placeOfBirth = places[randInt(0, places.length - 1)]
      const origin = places[randInt(0, places.length - 1)]
      const ethnicity = ethnicities[randInt(0, ethnicities.length - 1)]
      const religion = religions[randInt(0, religions.length - 1)]
      const nationality = 'Việt Nam'
      const education = educations[randInt(0, educations.length - 1)]
      const occupation = occupations[randInt(0, occupations.length - 1)]
      const workplace = `${occupation} ${String(randInt(1, 200))}`
      const idType = idTypes[randInt(0, idTypes.length - 1)]
      const idIssueDate = new Date(dob.getFullYear() + randInt(16, 30), randInt(0,11), randInt(1,28))
      const idIssuePlace = placeOfBirth
      const registrationDate = new Date(dob.getFullYear() + randInt(16, 30), randInt(0,11), randInt(1,28))
      const previousAddress = Math.random() < 0.2 ? `${randInt(1,999)} Đường Cũ` : null
      const relationship = p === 0 ? 'Chủ hộ' : (Math.random() < 0.6 ? 'Con' : 'Vợ/Chồng')
      const status = 'ACTIVE'

      await prisma.person.create({
        data: {
          fullName,
          dateOfBirth: dob,
          placeOfBirth,
          origin,
          ethnicity,
          religion,
          nationality,
          education,
          gender,
          occupation,
          workplace,
          idType,
          idNumber,
          idIssueDate,
          idIssuePlace,
          registrationDate,
          previousAddress,
          relationship,
          status,
          householdId: household.id
        }
      })
    }

    if (i % 50 === 0) {
      console.log(`  - Đã tạo ${i} hộ khẩu`)
    }
  }

  console.log('✅ Hoàn thành tạo dữ liệu mẫu lớn.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })



