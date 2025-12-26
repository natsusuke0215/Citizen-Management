import { PrismaClient } from '@prisma/client'

export async function seedCulturalCenterAssets(prisma: PrismaClient) {
  console.log('💼 Đang tạo cultural center assets...')

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
}

