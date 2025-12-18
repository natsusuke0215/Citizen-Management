import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu...')
  console.log('⚠️  Lưu ý: Đảm bảo đã chạy "npx prisma db push" hoặc "npx prisma migrate dev" trước!')

  // Tạo admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Quản trị viên',
      role: 'ADMIN'
    }
  })

  // Tạo user thường
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Người dùng',
      role: 'USER'
    }
  })

  // Tạo khu phố
  const district1 = await prisma.district.upsert({
    where: { id: 'district-1' },
    update: {},
    create: {
      id: 'district-1',
      name: 'Khu phố 1',
      description: 'Khu phố trung tâm thành phố'
    }
  })

  const district2 = await prisma.district.upsert({
    where: { id: 'district-2' },
    update: {},
    create: {
      id: 'district-2',
      name: 'Khu phố 2',
      description: 'Khu phố phía đông'
    }
  })

  // Tạo hộ khẩu
  const household1 = await prisma.household.upsert({
    where: { id: 'household-1' },
    update: {},
    create: {
      id: 'household-1',
      householdId: 'HK001',
      ownerName: 'Nguyễn Văn A',
      address: '123',
      street: 'Đường ABC',
      ward: 'Phường La Khê',
      district: 'Quận Hà Đông',
      districtId: district1.id
    }
  })

  const household2 = await prisma.household.upsert({
    where: { id: 'household-2' },
    update: {},
    create: {
      id: 'household-2',
      householdId: 'HK002',
      ownerName: 'Trần Văn B',
      address: '456',
      street: 'Đường DEF',
      ward: 'Phường La Khê',
      district: 'Quận Hà Đông',
      districtId: district2.id
    }
  })

  // Gán user vào hộ khẩu
  await prisma.user.update({
    where: { id: user.id },
    data: { householdId: household1.id }
  })

  // Tạo nhân khẩu
  await prisma.person.upsert({
    where: { id: 'person-1' },
    update: {},
    create: {
      id: 'person-1',
      fullName: 'Nguyễn Văn A',
      dateOfBirth: new Date('1990-01-01'),
      gender: 'Nam',
      placeOfBirth: 'Hà Nội',
      origin: 'Hà Nội',
      ethnicity: 'Kinh',
      occupation: 'Công nhân',
      workplace: 'Công ty ABC',
      idType: 'CCCD',
      idNumber: '123456789012',
      idIssueDate: new Date('2015-01-01'),
      idIssuePlace: 'Công an quận Hà Đông',
      registrationDate: new Date('2010-01-01'),
      relationship: 'Chủ hộ',
      status: 'ACTIVE',
      householdId: household1.id
    }
  })

  await prisma.person.upsert({
    where: { id: 'person-2' },
    update: {},
    create: {
      id: 'person-2',
      fullName: 'Trần Thị B',
      dateOfBirth: new Date('1992-05-15'),
      gender: 'Nữ',
      placeOfBirth: 'Hà Nội',
      origin: 'Hà Nội',
      ethnicity: 'Kinh',
      occupation: 'Giáo viên',
      workplace: 'Trường Tiểu học XYZ',
      idType: 'CCCD',
      idNumber: '987654321098',
      idIssueDate: new Date('2016-01-01'),
      idIssuePlace: 'Công an quận Hà Đông',
      registrationDate: new Date('2010-01-01'),
      relationship: 'Vợ',
      status: 'ACTIVE',
      householdId: household1.id
    }
  })

  // Tạo nhân khẩu trẻ em (chưa có CMND/CCCD)
  await prisma.person.upsert({
    where: { id: 'person-3' },
    update: {},
    create: {
      id: 'person-3',
      fullName: 'Nguyễn Văn C',
      dateOfBirth: new Date('2020-03-20'),
      gender: 'Nam',
      placeOfBirth: 'Hà Nội',
      origin: 'Hà Nội',
      ethnicity: 'Kinh',
      relationship: 'Con',
      status: 'ACTIVE',
      previousAddress: 'Mới sinh',
      householdId: household1.id
    }
  })

  // Tạo nhà văn hóa
  await prisma.culturalCenter.upsert({
    where: { id: 'center-1' },
    update: {},
    create: {
      id: 'center-1',
      name: 'Hội trường tầng 1',
      description: 'Hội trường rộng ở tầng 1, phục vụ sinh hoạt hội họp và các hoạt động văn hóa',
      capacity: 200,
      location: 'Tầng 1, Nhà văn hóa Tổ dân phố 7',
      building: 'Nhà văn hóa',
      floor: 1,
      room: 'Hội trường',
      area: 240.0,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Máy chiếu', 'Âm thanh', 'Điều hòa', 'Sân khấu'])
    }
  })

  await prisma.culturalCenter.upsert({
    where: { id: 'center-2' },
    update: {},
    create: {
      id: 'center-2',
      name: 'Phòng chức năng 1',
      description: 'Phòng chức năng trên tầng 2',
      capacity: 50,
      location: 'Tầng 2, Nhà văn hóa Tổ dân phố 7',
      building: 'Nhà văn hóa',
      floor: 2,
      room: 'Phòng 201',
      area: 80.0,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Máy chiếu', 'Điều hòa'])
    }
  })

  await prisma.culturalCenter.upsert({
    where: { id: 'center-3' },
    update: {},
    create: {
      id: 'center-3',
      name: 'Phòng chức năng 2',
      description: 'Phòng chức năng trên tầng 2',
      capacity: 30,
      location: 'Tầng 2, Nhà văn hóa Tổ dân phố 7',
      building: 'Nhà văn hóa',
      floor: 2,
      room: 'Phòng 202',
      area: 50.0,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Máy chiếu'])
    }
  })

  // Tạo lịch đặt mẫu
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  tomorrow.setHours(9, 0, 0, 0)

  const endTime = new Date(tomorrow)
  endTime.setHours(11, 0, 0, 0)

  await prisma.culturalCenterBooking.upsert({
    where: { id: 'booking-1' },
    update: {},
    create: {
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
      userId: user.id
    }
  })

  // Tạo đặt lịch đám cưới (có phí)
  const weddingDate = new Date()
  weddingDate.setDate(weddingDate.getDate() + 7)
  weddingDate.setHours(18, 0, 0, 0)

  const weddingEnd = new Date(weddingDate)
  weddingEnd.setHours(22, 0, 0, 0)

  await prisma.culturalCenterBooking.upsert({
    where: { id: 'booking-2' },
    update: {},
    create: {
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
      userId: user.id
    }
  })

  // Tạo yêu cầu mẫu
  await prisma.request.upsert({
    where: { id: 'request-1' },
    update: {},
    create: {
      id: 'request-1',
      type: 'HOUSEHOLD_UPDATE',
      description: 'Cập nhật địa chỉ hộ khẩu',
      data: JSON.stringify({
        oldAddress: '123 Đường ABC cũ',
        newAddress: '123 Đường ABC mới'
      }),
      userId: user.id,
      householdId: household1.id
    }
  })

  // Tạo tài sản nhà văn hóa mẫu
  try {
    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Bàn ghế',
        category: 'Nội thất',
        quantity: 50,
        condition: 'GOOD',
        location: 'Hội trường tầng 1',
        culturalCenterId: 'center-1',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Loa',
        category: 'Thiết bị âm thanh',
        quantity: 4,
        condition: 'GOOD',
        location: 'Hội trường tầng 1',
        culturalCenterId: 'center-1',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Màn hình',
        category: 'Thiết bị điện tử',
        quantity: 2,
        condition: 'GOOD',
        location: 'Hội trường tầng 1',
        culturalCenterId: 'center-1',
        lastChecked: new Date()
      }
    })
  } catch (error: any) {
    if (error.code === 'P2003' || error.message?.includes('CulturalCenterAsset')) {
      console.log('⚠️  Bảng tài sản chưa được tạo, bỏ qua tạo tài sản mẫu')
    } else {
      throw error
    }
  }

  // Tạo hoạt động mẫu
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

  console.log('✅ Dữ liệu mẫu đã được tạo thành công!')
  console.log('👤 Admin: admin@example.com / admin123')
  console.log('👤 User: user@example.com / user123')
  console.log('📋 Đã tạo:')
  console.log('   - 2 khu phố')
  console.log('   - 2 hộ khẩu')
  console.log('   - 3 nhân khẩu (bao gồm 1 trẻ em)')
  console.log('   - 3 nhà văn hóa/phòng chức năng')
  console.log('   - 2 lịch đặt (1 họp, 1 đám cưới)')
  console.log('   - 3 tài sản nhà văn hóa')
  console.log('   - 1 hoạt động')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
