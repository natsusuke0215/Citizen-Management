import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Bắt đầu tạo dữ liệu mẫu...')
  console.log('⚠️  Lưu ý: Đảm bảo đã chạy "npx prisma db push" hoặc "npx prisma migrate dev" trước!')

  // 1. Xóa dữ liệu cũ (theo thứ tự quan hệ khóa ngoại)
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
    await prisma.user.updateMany({ data: { householdId: null } })
    
    await prisma.person.deleteMany()
    await prisma.user.deleteMany() 
    await prisma.household.deleteMany()
    await prisma.district.deleteMany()
  } catch (error) {
    console.log('⚠️  Lỗi khi xóa dữ liệu cũ (có thể bỏ qua nếu lần đầu chạy):', error)
  }

  // Tạo dữ liệu mới
  // Tạo admin user (plain text password)
  const admin = await prisma.user.create({
    data: {
      id: 'admin-user',
      email: 'admin@example.com',
      password: 'admin123', // Plain text password
      name: 'Quản trị viên',
      role: 'ADMIN'
    }
  })

  // Tạo Tổ trưởng
  const teamLeader = await prisma.user.create({
    data: {
      id: 'team-leader',
      email: 'totruong@gmail.com',
      password: '123456', // Plain text password
      name: 'Nguyễn Văn Tổ Trưởng',
      role: 'TEAM_LEADER'
    }
  })

  // Tạo Tổ phó
  await prisma.user.create({
    data: {
      id: 'deputy-leader',
      email: 'topho@gmail.com',
      password: '123456', // Plain text password
      name: 'Trần Thị Tổ Phó',
      role: 'DEPUTY'
    }
  })

  // Cán bộ quản lý CSVC
  await prisma.user.create({
    data: {
      id: 'facility-manager',
      email: 'quanlycsvc@gmail.com',
      password: '123456', // Plain text password
      name: 'Lê Văn Quản Lý',
      role: 'FACILITY_MANAGER'
    }
  })

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
      districtId: district1.id
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
      districtId: district2.id
    }
  })

  // Tạo nhân khẩu
  await prisma.person.create({
    data: {
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

  await prisma.person.create({
    data: {
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
  await prisma.person.create({
    data: {
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

  // Tạo nhà văn hóa - Phòng bên trong
  await prisma.culturalCenter.create({
    data: {
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
      amenities: JSON.stringify(['Máy chiếu', 'Âm thanh', 'Điều hòa', 'Sân khấu', 'Màn hình LED', 'Micro không dây', 'Bàn ghế di động']),
      imageUrl: '/assets/images/center/hoi-truong-tang-1.jpg'
    }
  })

  await prisma.culturalCenter.create({
    data: {
      id: 'center-2',
      name: 'Phòng chức năng 1',
      description: 'Phòng chức năng trên tầng 2, phù hợp cho các cuộc họp nhỏ và lớp học',
      capacity: 50,
      location: 'Tầng 2, Nhà văn hóa Tổ dân phố 7',
      building: 'Nhà văn hóa',
      floor: 2,
      room: 'Phòng 201',
      area: 80.0,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Máy chiếu', 'Điều hòa', 'Bảng trắng', 'Bàn ghế', 'WiFi']),
      imageUrl: '/assets/images/center/phong-chuc-nang-1.jpg'
    }
  })

  await prisma.culturalCenter.create({
    data: {
      id: 'center-3',
      name: 'Phòng chức năng 2',
      description: 'Phòng chức năng trên tầng 2, phù hợp cho các hoạt động nhóm nhỏ',
      capacity: 30,
      location: 'Tầng 2, Nhà văn hóa Tổ dân phố 7',
      building: 'Nhà văn hóa',
      floor: 2,
      room: 'Phòng 202',
      area: 50.0,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Máy chiếu', 'Điều hòa', 'Bảng trắng', 'WiFi']),
      imageUrl: '/assets/images/center/phong-chuc-nang-2.jpg'
    }
  })

  await prisma.culturalCenter.create({
    data: {
      id: 'center-4',
      name: 'Phòng chức năng 3',
      description: 'Phòng chức năng trên tầng 2, có không gian yên tĩnh phù hợp cho học tập',
      capacity: 40,
      location: 'Tầng 2, Nhà văn hóa Tổ dân phố 7',
      building: 'Nhà văn hóa',
      floor: 2,
      room: 'Phòng 203',
      area: 65.0,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Máy chiếu', 'Điều hòa', 'Bảng trắng', 'Bàn ghế', 'WiFi', 'Tủ sách']),
      imageUrl: '/assets/images/center/phong-chuc-nang-3.jpg'
    }
  })

  await prisma.culturalCenter.create({
    data: {
      id: 'center-5',
      name: 'Phòng đa năng tầng 3',
      description: 'Phòng đa năng trên tầng 3, có thể tổ chức các hoạt động thể dục thể thao nhẹ',
      capacity: 60,
      location: 'Tầng 3, Nhà văn hóa Tổ dân phố 7',
      building: 'Nhà văn hóa',
      floor: 3,
      room: 'Phòng 301',
      area: 100.0,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Máy chiếu', 'Điều hòa', 'Gương tập', 'Sàn gỗ', 'Hệ thống âm thanh', 'WiFi']),
      imageUrl: '/assets/images/center/phong-da-nang-tang-3.jpg'
    }
  })

  await prisma.culturalCenter.create({
    data: {
      id: 'center-6',
      name: 'Phòng họp nhỏ tầng 1',
      description: 'Phòng họp nhỏ gọn trên tầng 1, phù hợp cho các cuộc họp nội bộ',
      capacity: 20,
      location: 'Tầng 1, Nhà văn hóa Tổ dân phố 7',
      building: 'Nhà văn hóa',
      floor: 1,
      room: 'Phòng 101',
      area: 35.0,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Máy chiếu', 'Điều hòa', 'Bảng trắng', 'Bàn họp', 'WiFi']),
      imageUrl: '/assets/images/center/phong-hop-nho-tang-1.jpg'
    }
  })

  await prisma.culturalCenter.create({
    data: {
      id: 'center-7',
      name: 'Phòng thư viện',
      description: 'Phòng thư viện trên tầng 2, có không gian đọc sách yên tĩnh',
      capacity: 25,
      location: 'Tầng 2, Nhà văn hóa Tổ dân phố 7',
      building: 'Nhà văn hóa',
      floor: 2,
      room: 'Phòng 204',
      area: 45.0,
      yearBuilt: 2018,
      amenities: JSON.stringify(['Điều hòa', 'Tủ sách', 'Bàn đọc', 'Đèn bàn', 'WiFi', 'Máy tính']),
      imageUrl: '/assets/images/center/phong-thu-vien.jpg'
    }
  })

  // Tạo khuôn viên nhà văn hóa - Sân bên ngoài
  await prisma.culturalCenter.create({
    data: {
      id: 'center-8',
      name: 'Sân cầu lông',
      description: 'Sân cầu lông ngoài trời trong khuôn viên nhà văn hóa, có lưới và vạch kẻ sân đầy đủ',
      capacity: 8,
      location: 'Khuôn viên nhà văn hóa Tổ dân phố 7',
      building: 'Khuôn viên',
      floor: null,
      room: 'Sân cầu lông 1',
      area: 81.0,
      yearBuilt: 2019,
      amenities: JSON.stringify(['Lưới cầu lông', 'Vạch kẻ sân', 'Đèn chiếu sáng', 'Ghế ngồi', 'Mái che']),
      imageUrl: '/assets/images/center/san-cau-long-1.jpg'
    }
  })

  await prisma.culturalCenter.create({
    data: {
      id: 'center-9',
      name: 'Sân cầu lông 2',
      description: 'Sân cầu lông thứ hai trong khuôn viên, phục vụ nhu cầu tập luyện và thi đấu',
      capacity: 8,
      location: 'Khuôn viên nhà văn hóa Tổ dân phố 7',
      building: 'Khuôn viên',
      floor: null,
      room: 'Sân cầu lông 2',
      area: 81.0,
      yearBuilt: 2019,
      amenities: JSON.stringify(['Lưới cầu lông', 'Vạch kẻ sân', 'Đèn chiếu sáng', 'Ghế ngồi', 'Mái che']),
      imageUrl: '/assets/images/center/san-cau-long-2.jpg'
    }
  })

  await prisma.culturalCenter.create({
    data: {
      id: 'center-10',
      name: 'Sân bóng chuyền',
      description: 'Sân bóng chuyền ngoài trời trong khuôn viên, có lưới và vạch kẻ sân tiêu chuẩn',
      capacity: 14,
      location: 'Khuôn viên nhà văn hóa Tổ dân phố 7',
      building: 'Khuôn viên',
      floor: null,
      room: 'Sân bóng chuyền',
      area: 162.0,
      yearBuilt: 2019,
      amenities: JSON.stringify(['Lưới bóng chuyền', 'Vạch kẻ sân', 'Đèn chiếu sáng', 'Ghế ngồi', 'Mái che', 'Bóng chuyền']),
      imageUrl: '/assets/images/center/san-bong-chuyen.jpg'
    }
  })

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
      userId: teamLeader.id
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
      userId: teamLeader.id
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
      userId: teamLeader.id
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
      userId: teamLeader.id
    }
  })

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
      userId: teamLeader.id,
      householdId: household1.id
    }
  })

  // Tạo tài sản nhà văn hóa mẫu
  try {
    // Tài sản cho Hội trường tầng 1
    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Bàn ghế',
        category: 'Nội thất',
        quantity: 50,
        condition: 'GOOD',
        location: 'Hội trường tầng 1',
        culturalCenterId: 'center-1',
        notes: 'Bàn ghế di động, có thể xếp gọn',
        goodQuantity: 40,
        fairQuantity: 7,
        poorQuantity: 2,
        damagedQuantity: 1,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/ban-ghe.jpg',
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
        notes: 'Loa công suất lớn, phục vụ sự kiện',
        goodQuantity: 3,
        fairQuantity: 1,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/loa.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Màn hình LED',
        category: 'Thiết bị điện tử',
        quantity: 2,
        condition: 'GOOD',
        location: 'Hội trường tầng 1',
        culturalCenterId: 'center-1',
        notes: 'Màn hình LED lớn, hiển thị rõ nét',
        goodQuantity: 2,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/man-hinh-led.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Micro không dây',
        category: 'Thiết bị âm thanh',
        quantity: 6,
        condition: 'GOOD',
        location: 'Hội trường tầng 1',
        culturalCenterId: 'center-1',
        notes: 'Micro không dây, pin sạc',
        goodQuantity: 5,
        fairQuantity: 1,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/micro-khong-day.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Máy chiếu',
        category: 'Thiết bị điện tử',
        quantity: 1,
        condition: 'GOOD',
        location: 'Hội trường tầng 1',
        culturalCenterId: 'center-1',
        notes: 'Máy chiếu độ phân giải cao',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/may-chieu.jpg',
        lastChecked: new Date()
      }
    })

    // Tài sản cho các phòng chức năng
    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Máy chiếu',
        category: 'Thiết bị điện tử',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng chức năng 1',
        culturalCenterId: 'center-2',
        notes: 'Máy chiếu cầm tay',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/may-chieu.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Bàn ghế',
        category: 'Nội thất',
        quantity: 25,
        condition: 'GOOD',
        location: 'Phòng chức năng 1',
        culturalCenterId: 'center-2',
        notes: 'Bàn ghế học tập',
        goodQuantity: 20,
        fairQuantity: 4,
        poorQuantity: 1,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/ban-ghe.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Bảng trắng',
        category: 'Nội thất',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng chức năng 1',
        culturalCenterId: 'center-2',
        notes: 'Bảng trắng lớn, phục vụ họp và giảng dạy',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/bang-trang.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Điều hòa',
        category: 'Thiết bị điện tử',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng chức năng 1',
        culturalCenterId: 'center-2',
        notes: 'Điều hòa công suất lớn',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/dieu-hoa.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Wifi',
        category: 'Thiết bị mạng',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng chức năng 1',
        culturalCenterId: 'center-2',
        notes: 'Wifi tốc độ cao',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/wifi.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Máy chiếu',
        category: 'Thiết bị điện tử',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng chức năng 2',
        culturalCenterId: 'center-3',
        notes: 'Máy chiếu cầm tay',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/may-chieu.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Bàn ghế',
        category: 'Nội thất',
        quantity: 15,
        condition: 'GOOD',
        location: 'Phòng chức năng 2',
        culturalCenterId: 'center-3',
        notes: 'Bàn ghế học tập',
        goodQuantity: 12,
        fairQuantity: 2,
        poorQuantity: 1,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/ban-ghe.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Bảng trắng',
        category: 'Nội thất',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng chức năng 2',
        culturalCenterId: 'center-3',
        notes: 'Bảng trắng lớn, phục vụ họp và giảng dạy',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/bang-trang.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Điều hòa',
        category: 'Thiết bị điện tử',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng chức năng 2',
        culturalCenterId: 'center-3',
        notes: 'Điều hòa công suất lớn',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/dieu-hoa.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Wifi',
        category: 'Thiết bị mạng',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng chức năng 2',
        culturalCenterId: 'center-3',
        notes: 'Wifi tốc độ cao',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/wifi.jpg',
        lastChecked: new Date()
      }
    })


    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Máy chiếu',
        category: 'Thiết bị điện tử',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng chức năng 3',
        culturalCenterId: 'center-4',
        notes: 'Máy chiếu cầm tay',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/may-chieu.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Tủ sách',
        category: 'Nội thất',
        quantity: 3,
        condition: 'GOOD',
        location: 'Phòng chức năng 3',
        culturalCenterId: 'center-4',
        notes: 'Tủ sách gỗ, nhiều ngăn',
        goodQuantity: 2,
        fairQuantity: 1,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/tu-sach.jpg',
        lastChecked: new Date()
      }
    })

    // Tài sản cho phòng đa năng
    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Gương tập',
        category: 'Thiết bị thể thao',
        quantity: 2,
        condition: 'GOOD',
        location: 'Phòng đa năng tầng 3',
        culturalCenterId: 'center-5',
        notes: 'Gương lớn, an toàn',
        goodQuantity: 2,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/guong-tap.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Loa Bluetooth',
        category: 'Thiết bị âm thanh',
        quantity: 2,
        condition: 'GOOD',
        location: 'Phòng đa năng tầng 3',
        culturalCenterId: 'center-5',
        notes: 'Loa Bluetooth, pin sạc',
        goodQuantity: 2,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/loa-bluetooth.jpg',
        lastChecked: new Date()
      }
    })

    // Tài sản cho phòng họp nhỏ tầng 1
    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Máy chiếu',
        category: 'Thiết bị điện tử',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng họp nhỏ tầng 1',
        culturalCenterId: 'center-6',
        notes: 'Máy chiếu mini',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/may-chieu.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Bàn họp',
        category: 'Nội thất',
        quantity: 1,
        condition: 'GOOD',
        location: 'Phòng họp nhỏ tầng 1',
        culturalCenterId: 'center-6',
        notes: 'Bàn họp hình chữ nhật',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/ban-hop.jpg',
        lastChecked: new Date()
      }
    })

    // Tài sản cho phòng thư viện
    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Tủ sách',
        category: 'Nội thất',
        quantity: 8,
        condition: 'GOOD',
        location: 'Phòng thư viện',
        culturalCenterId: 'center-7',
        notes: 'Tủ sách nhiều ngăn',
        goodQuantity: 6,
        fairQuantity: 2,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/tu-sach.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Máy tính',
        category: 'Thiết bị điện tử',
        quantity: 3,
        condition: 'GOOD',
        location: 'Phòng thư viện',
        culturalCenterId: 'center-7',
        notes: 'Máy tính để bàn',
        goodQuantity: 2,
        fairQuantity: 1,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/may-tinh.jpg',
        lastChecked: new Date()
      }
    })

    // Tài sản cho sân cầu lông 1
    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Lưới cầu lông',
        category: 'Thiết bị thể thao',
        quantity: 2,
        condition: 'GOOD',
        location: 'Sân cầu lông 1',
        culturalCenterId: 'center-8',
        notes: 'Lưới tiêu chuẩn',
        goodQuantity: 2,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/luoi-cau-long.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Vợt cầu lông',
        category: 'Thiết bị thể thao',
        quantity: 8,
        condition: 'GOOD',
        location: 'Sân cầu lông 1',
        culturalCenterId: 'center-8',
        notes: 'Vợt cầu lông chuyên nghiệp',
        goodQuantity: 6,
        fairQuantity: 2,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/vot-cau-long.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Cầu lông',
        category: 'Thiết bị thể thao',
        quantity: 24,
        condition: 'GOOD',
        location: 'Sân cầu lông 1',
        culturalCenterId: 'center-8',
        notes: 'Cầu lông tiêu chuẩn',
        goodQuantity: 20,
        fairQuantity: 3,
        poorQuantity: 1,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/cau-long.jpg',
        lastChecked: new Date()
      }
    })

    // Tài sản cho sân cầu lông 2
    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Lưới cầu lông',
        category: 'Thiết bị thể thao',
        quantity: 2,
        condition: 'GOOD',
        location: 'Sân cầu lông 2',
        culturalCenterId: 'center-9',
        notes: 'Lưới tiêu chuẩn',
        goodQuantity: 2,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/luoi-cau-long.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Vợt cầu lông',
        category: 'Thiết bị thể thao',
        quantity: 8,
        condition: 'GOOD',
        location: 'Sân cầu lông 2',
        culturalCenterId: 'center-9',
        notes: 'Vợt cầu lông chuyên nghiệp',
        goodQuantity: 7,
        fairQuantity: 1,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/vot-cau-long.jpg',
        lastChecked: new Date()
      }
    })

    // Tài sản cho sân bóng chuyền
    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Lưới bóng chuyền',
        category: 'Thiết bị thể thao',
        quantity: 1,
        condition: 'GOOD',
        location: 'Sân bóng chuyền',
        culturalCenterId: 'center-10',
        notes: 'Lưới bóng chuyền tiêu chuẩn',
        goodQuantity: 1,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/luoi-bong-chuyen.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Đèn chiếu sáng',
        category: 'Thiết bị ánh sáng',
        quantity: 2,
        condition: 'GOOD',
        location: 'Sân bóng chuyền',
        culturalCenterId: 'center-10',
        notes: 'Đèn chiếu sáng',
        goodQuantity: 2,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/den-chieu-sang.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Ghế ngồi',
        category: 'Nội thất',
        quantity: 10,
        condition: 'GOOD',
        location: 'Sân bóng chuyền',
        culturalCenterId: 'center-10',
        notes: 'Đèn chiếu sáng',
        goodQuantity: 10,
        fairQuantity: 0,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/ghe-ngoi.jpg',
        lastChecked: new Date()
      }
    })

    await prisma.culturalCenterAsset.create({
      data: {
        name: 'Bóng chuyền',
        category: 'Thiết bị thể thao',
        quantity: 6,
        condition: 'GOOD',
        location: 'Sân bóng chuyền',
        culturalCenterId: 'center-10',
        notes: 'Bóng chuyền da',
        goodQuantity: 5,
        fairQuantity: 1,
        poorQuantity: 0,
        damagedQuantity: 0,
        repairingQuantity: 0,
        imageUrl: '/assets/images/center/bong-chuyen.jpg',
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
  console.log('👤 Tổ trưởng: totruong@gmail.com / 123456')
  console.log('👤 Tổ phó: topho@gmail.com / 123456')
  console.log('👤 QL CSVC: quanlycsvc@gmail.com / 123456')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi tạo dữ liệu mẫu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })