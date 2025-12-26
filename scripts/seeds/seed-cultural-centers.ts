import { PrismaClient } from '@prisma/client'

export async function seedCulturalCenters(prisma: PrismaClient) {
  console.log('🏛️  Đang tạo cultural centers...')

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
}

