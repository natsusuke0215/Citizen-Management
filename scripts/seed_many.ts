import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function randInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const firstNames = ['Nguyễn', 'Trần', 'Lê', 'Phạm', 'Hoàng', 'Vũ', 'Đặng', 'Bùi', 'Phan', 'Trương']
<<<<<<< HEAD
const givenNames = ['Văn', 'Thị', 'Hùng', 'Lan', 'An', 'Bảo', 'Minh', 'Hạnh', 'Huỳnh', 'Dũng', 'Huy']
const lastNames = ['An', 'Bình', 'Cường', 'Dũng', 'Hùng', 'Hương', 'Linh', 'Mai', 'Nga', 'Phương', 'Quang', 'Sơn', 'Trang']
const streets = ['Đường A', 'Đường B', 'Đường C', 'Đường D', 'Đường E', 'Đường F', 'Đường G', 'Đường H']
const wards = ['Phường La Khê', 'Phường X', 'Phường Y', 'Phường Z']
const districts = ['Quận Hà Đông', 'Quận Thanh Xuân', 'Quận Hoàn Kiếm', 'Quận Cầu Giấy']
=======
const givenNames = ['Văn', 'Thị', 'Hùng', 'Lan', 'An', 'Bảo', 'Minh', 'Hạnh', 'Huỳnh', 'Dũng', 'Huy', 'Thanh', 'Quốc', 'Đức']
const lastNames = ['An', 'Bình', 'Cường', 'Dũng', 'Hùng', 'Hương', 'Linh', 'Mai', 'Nga', 'Phương', 'Quang', 'Sơn', 'Trang', 'Tuấn', 'Tú', 'Vy']
const streets = ['Quang Trung', 'Lê Lợi', 'Trần Hưng Đạo', 'Nguyễn Trãi', 'Vạn Phúc', 'Tố Hữu', 'Lê Trọng Tấn', 'Phùng Hưng']
const wards = ['Phường La Khê', 'Phường Yết Kiêu', 'Phường Quang Trung', 'Phường Nguyễn Trãi']
const districts = ['Quận Hà Đông']
const occupations = ['Giáo viên', 'Kỹ sư', 'Bác sĩ', 'Công nhân', 'Sinh viên', 'Học sinh', 'Kinh doanh tự do', 'Nội trợ', 'Hưu trí']
const origins = ['Hà Nội', 'Hà Nam', 'Nam Định', 'Thái Bình', 'Hưng Yên', 'Hải Dương', 'Nghệ An', 'Thanh Hóa']
>>>>>>> stable

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

<<<<<<< HEAD
function randomDateBetween(startYear = 1950, endYear = 2019) {
=======
function randomDateBetween(startYear = 1950, endYear = 2023) {
>>>>>>> stable
  const year = randInt(startYear, endYear)
  const month = randInt(0, 11)
  const day = randInt(1, 28)
  return new Date(year, month, day)
}

<<<<<<< HEAD
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

  for (let i = 1; i <= totalHouseholds; i++) {
=======
function randomIdNumber() {
  let id = ''
  for (let i = 0; i < 12; i++) {
    id += randInt(0, 9)
  }
  return id
}

async function main() {
  // --- PHẦN 1: XÓA DỮ LIỆU CŨ ---
  console.log('🧹 Đang xóa dữ liệu cũ (Cleanup)...')
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
    await prisma.person.deleteMany()
    await prisma.user.deleteMany() 
    await prisma.household.deleteMany()
    await prisma.district.deleteMany()
  } catch (error) {
    console.log('⚠️  Lỗi khi xóa dữ liệu cũ:', error)
  }

  // --- PHẦN 2: TẠO USERS ---
  console.log('👤 Tạo dữ liệu users...')
  const admin = await prisma.user.create({
    data: {
      email: 'admin@example.com',
      password: 'admin123',
      name: 'Quản trị viên',
      role: 'ADMIN'
    }
  })
  
  await prisma.user.create({
    data: {
      email: 'totruong@gmail.com',
      password: '123456',
      name: 'Nguyễn Văn Tổ Trưởng',
      role: 'TEAM_LEADER'
    }
  })

  await prisma.user.create({
    data: {
      email: 'topho@gmail.com',
      password: '123456',
      name: 'Trần Thị Tổ Phó',
      role: 'DEPUTY'
    }
  })

  await prisma.user.create({
    data: {
      email: 'quanlycsvc@gmail.com',
      password: '123456',
      name: 'Lê Văn Quản Lý',
      role: 'FACILITY_MANAGER'
    }
  })

  // --- PHẦN 3: TẠO NHÀ VĂN HÓA (Full 10 items) ---
  console.log('🏛️  Tạo dữ liệu nhà văn hóa (Full)...')
  const centers = [
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
    },
    {
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
  ]

  for (const c of centers) {
    await prisma.culturalCenter.create({ data: c })
  }

  // --- PHẦN 3b: TẠO TÀI SẢN (ASSETS) ---
  console.log('💼 Tạo dữ liệu tài sản & thiết bị...')
  const assets = [
    // Hội trường tầng 1
    { name: 'Bàn ghế', category: 'Nội thất', quantity: 50, condition: 'GOOD', location: 'Hội trường tầng 1', culturalCenterId: 'center-1', goodQuantity: 40, fairQuantity: 7, poorQuantity: 2, damagedQuantity: 1, imageUrl: '/assets/images/center/ban-ghe.jpg' },
    { name: 'Loa', category: 'Thiết bị âm thanh', quantity: 4, condition: 'GOOD', location: 'Hội trường tầng 1', culturalCenterId: 'center-1', goodQuantity: 3, fairQuantity: 1, imageUrl: '/assets/images/center/loa.jpg' },
    { name: 'Màn hình LED', category: 'Thiết bị điện tử', quantity: 2, condition: 'GOOD', location: 'Hội trường tầng 1', culturalCenterId: 'center-1', goodQuantity: 2, imageUrl: '/assets/images/center/man-hinh-led.jpg' },
    { name: 'Micro không dây', category: 'Thiết bị âm thanh', quantity: 6, condition: 'GOOD', location: 'Hội trường tầng 1', culturalCenterId: 'center-1', goodQuantity: 5, fairQuantity: 1, imageUrl: '/assets/images/center/micro-khong-day.jpg' },
    { name: 'Máy chiếu', category: 'Thiết bị điện tử', quantity: 1, condition: 'GOOD', location: 'Hội trường tầng 1', culturalCenterId: 'center-1', goodQuantity: 1, imageUrl: '/assets/images/center/may-chieu.jpg' },
    
    // Phòng chức năng 1
    { name: 'Máy chiếu', category: 'Thiết bị điện tử', quantity: 1, condition: 'GOOD', location: 'Phòng chức năng 1', culturalCenterId: 'center-2', goodQuantity: 1, imageUrl: '/assets/images/center/may-chieu.jpg' },
    { name: 'Bàn ghế', category: 'Nội thất', quantity: 25, condition: 'GOOD', location: 'Phòng chức năng 1', culturalCenterId: 'center-2', goodQuantity: 20, fairQuantity: 4, poorQuantity: 1, imageUrl: '/assets/images/center/ban-ghe.jpg' },
    { name: 'Bảng trắng', category: 'Nội thất', quantity: 1, condition: 'GOOD', location: 'Phòng chức năng 1', culturalCenterId: 'center-2', goodQuantity: 1, imageUrl: '/assets/images/center/bang-trang.jpg' },
    { name: 'Điều hòa', category: 'Thiết bị điện tử', quantity: 1, condition: 'GOOD', location: 'Phòng chức năng 1', culturalCenterId: 'center-2', goodQuantity: 1, imageUrl: '/assets/images/center/dieu-hoa.jpg' },
    { name: 'Wifi', category: 'Thiết bị mạng', quantity: 1, condition: 'GOOD', location: 'Phòng chức năng 1', culturalCenterId: 'center-2', goodQuantity: 1, imageUrl: '/assets/images/center/wifi.jpg' },

    // Phòng chức năng 2
    { name: 'Máy chiếu', category: 'Thiết bị điện tử', quantity: 1, condition: 'GOOD', location: 'Phòng chức năng 2', culturalCenterId: 'center-3', goodQuantity: 1, imageUrl: '/assets/images/center/may-chieu.jpg' },
    { name: 'Bàn ghế', category: 'Nội thất', quantity: 15, condition: 'GOOD', location: 'Phòng chức năng 2', culturalCenterId: 'center-3', goodQuantity: 12, fairQuantity: 2, poorQuantity: 1, imageUrl: '/assets/images/center/ban-ghe.jpg' },
    { name: 'Bảng trắng', category: 'Nội thất', quantity: 1, condition: 'GOOD', location: 'Phòng chức năng 2', culturalCenterId: 'center-3', goodQuantity: 1, imageUrl: '/assets/images/center/bang-trang.jpg' },
    { name: 'Điều hòa', category: 'Thiết bị điện tử', quantity: 1, condition: 'GOOD', location: 'Phòng chức năng 2', culturalCenterId: 'center-3', goodQuantity: 1, imageUrl: '/assets/images/center/dieu-hoa.jpg' },
    { name: 'Wifi', category: 'Thiết bị mạng', quantity: 1, condition: 'GOOD', location: 'Phòng chức năng 2', culturalCenterId: 'center-3', goodQuantity: 1, imageUrl: '/assets/images/center/wifi.jpg' },

    // Phòng chức năng 3
    { name: 'Máy chiếu', category: 'Thiết bị điện tử', quantity: 1, condition: 'GOOD', location: 'Phòng chức năng 3', culturalCenterId: 'center-4', goodQuantity: 1, imageUrl: '/assets/images/center/may-chieu.jpg' },
    { name: 'Tủ sách', category: 'Nội thất', quantity: 3, condition: 'GOOD', location: 'Phòng chức năng 3', culturalCenterId: 'center-4', goodQuantity: 2, fairQuantity: 1, imageUrl: '/assets/images/center/tu-sach.jpg' },

    // Phòng đa năng tầng 3
    { name: 'Gương tập', category: 'Thiết bị thể thao', quantity: 2, condition: 'GOOD', location: 'Phòng đa năng tầng 3', culturalCenterId: 'center-5', goodQuantity: 2, imageUrl: '/assets/images/center/guong-tap.jpg' },
    { name: 'Loa Bluetooth', category: 'Thiết bị âm thanh', quantity: 2, condition: 'GOOD', location: 'Phòng đa năng tầng 3', culturalCenterId: 'center-5', goodQuantity: 2, imageUrl: '/assets/images/center/loa-bluetooth.jpg' },

    // Phòng họp nhỏ tầng 1
    { name: 'Máy chiếu', category: 'Thiết bị điện tử', quantity: 1, condition: 'GOOD', location: 'Phòng họp nhỏ tầng 1', culturalCenterId: 'center-6', goodQuantity: 1, imageUrl: '/assets/images/center/may-chieu.jpg' },
    { name: 'Bàn họp', category: 'Nội thất', quantity: 1, condition: 'GOOD', location: 'Phòng họp nhỏ tầng 1', culturalCenterId: 'center-6', goodQuantity: 1, imageUrl: '/assets/images/center/ban-hop.jpg' },

    // Phòng thư viện
    { name: 'Tủ sách', category: 'Nội thất', quantity: 8, condition: 'GOOD', location: 'Phòng thư viện', culturalCenterId: 'center-7', goodQuantity: 6, fairQuantity: 2, imageUrl: '/assets/images/center/tu-sach.jpg' },
    { name: 'Máy tính', category: 'Thiết bị điện tử', quantity: 3, condition: 'GOOD', location: 'Phòng thư viện', culturalCenterId: 'center-7', goodQuantity: 2, fairQuantity: 1, imageUrl: '/assets/images/center/may-tinh.jpg' },

    // Sân cầu lông 1
    { name: 'Lưới cầu lông', category: 'Thiết bị thể thao', quantity: 2, condition: 'GOOD', location: 'Sân cầu lông 1', culturalCenterId: 'center-8', goodQuantity: 2, imageUrl: '/assets/images/center/luoi-cau-long.jpg' },
    { name: 'Vợt cầu lông', category: 'Thiết bị thể thao', quantity: 8, condition: 'GOOD', location: 'Sân cầu lông 1', culturalCenterId: 'center-8', goodQuantity: 6, fairQuantity: 2, imageUrl: '/assets/images/center/vot-cau-long.jpg' },
    { name: 'Cầu lông', category: 'Thiết bị thể thao', quantity: 24, condition: 'GOOD', location: 'Sân cầu lông 1', culturalCenterId: 'center-8', goodQuantity: 20, fairQuantity: 3, poorQuantity: 1, imageUrl: '/assets/images/center/cau-long.jpg' },

    // Sân cầu lông 2
    { name: 'Lưới cầu lông', category: 'Thiết bị thể thao', quantity: 2, condition: 'GOOD', location: 'Sân cầu lông 2', culturalCenterId: 'center-9', goodQuantity: 2, imageUrl: '/assets/images/center/luoi-cau-long.jpg' },
    { name: 'Vợt cầu lông', category: 'Thiết bị thể thao', quantity: 8, condition: 'GOOD', location: 'Sân cầu lông 2', culturalCenterId: 'center-9', goodQuantity: 7, fairQuantity: 1, imageUrl: '/assets/images/center/vot-cau-long.jpg' },

    // Sân bóng chuyền
    { name: 'Lưới bóng chuyền', category: 'Thiết bị thể thao', quantity: 1, condition: 'GOOD', location: 'Sân bóng chuyền', culturalCenterId: 'center-10', goodQuantity: 1, imageUrl: '/assets/images/center/luoi-bong-chuyen.jpg' },
    { name: 'Đèn chiếu sáng', category: 'Thiết bị ánh sáng', quantity: 2, condition: 'GOOD', location: 'Sân bóng chuyền', culturalCenterId: 'center-10', goodQuantity: 2, imageUrl: '/assets/images/center/den-chieu-sang.jpg' },
    { name: 'Ghế ngồi', category: 'Nội thất', quantity: 10, condition: 'GOOD', location: 'Sân bóng chuyền', culturalCenterId: 'center-10', goodQuantity: 10, imageUrl: '/assets/images/center/ghe-ngoi.jpg' },
    { name: 'Bóng chuyền', category: 'Thiết bị thể thao', quantity: 6, condition: 'GOOD', location: 'Sân bóng chuyền', culturalCenterId: 'center-10', goodQuantity: 5, fairQuantity: 1, imageUrl: '/assets/images/center/bong-chuyen.jpg' },
  ]

  for (const asset of assets) {
    await prisma.culturalCenterAsset.create({
      data: {
        ...asset,
        lastChecked: new Date()
      }
    })
  }

  // --- PHẦN 4: TẠO DÂN CƯ (500 HỘ) ---
  console.log('🌱 Tạo dữ liệu 500 hộ khẩu...')
  const districtIds = []
  for (let i = 0; i < 4; i++) {
    const d = await prisma.district.create({
      data: { name: `Khu phố ${i+1}`, description: `Khu phố mẫu ${i+1}` }
    })
    districtIds.push(d.id)
  }

  // Khởi tạo biến household để dùng cho phần request
  let firstHouseholdId = ''

  for (let i = 1; i <= 500; i++) {
>>>>>>> stable
    const householdId = `HK${String(i).padStart(4, '0')}`
    const ownerName = randomName()
    const { address, street, ward, district } = randomAddress()
    const districtId = districtIds[randInt(0, districtIds.length - 1)]
<<<<<<< HEAD

    const household = await prisma.household.upsert({
      where: { householdId },
      update: {},
      create: {
=======
    const origin = origins[randInt(0, origins.length - 1)]

    const household = await prisma.household.create({
      data: {
>>>>>>> stable
        householdId,
        ownerName,
        address,
        street,
        ward,
        district,
        districtId,
<<<<<<< HEAD
      }
    })

    // create 1-5 persons
    const personCount = randInt(1, 5)
    for (let p = 0; p < personCount; p++) {
      const fullName = randomName()
      const dob = randomDateBetween(1950, 2015)
      await prisma.person.create({
        data: {
          fullName,
          dateOfBirth: dob,
          gender: Math.random() < 0.5 ? 'Nam' : 'Nữ',
          householdId: household.id
=======
        householdType: 'THƯỜNG_TRÚ',
        issueDate: randomDateBetween(2010, 2023)
      }
    })

    if (i === 1) firstHouseholdId = household.id

    const personCount = randInt(2, 5)
    for (let p = 0; p < personCount; p++) {
      const isOwner = p === 0
      const dob = isOwner ? randomDateBetween(1960, 1990) : randomDateBetween(1995, 2023)
      await prisma.person.create({
        data: {
          fullName: isOwner ? ownerName : randomName(),
          dateOfBirth: dob,
          gender: randInt(0, 1) === 0 ? 'Nam' : 'Nữ',
          householdId: household.id,
          relationship: isOwner ? null : (p === 1 ? 'Vợ/Chồng' : 'Con'),
          idNumber: isOwner || (new Date().getFullYear() - dob.getFullYear() > 14) ? randomIdNumber() : null,
          idType: 'CCCD',
          origin,
          ethnicity: 'Kinh',
          religion: 'Không',
          nationality: 'Việt Nam',
          occupation: isOwner ? occupations[randInt(0, occupations.length - 1)] : (new Date().getFullYear() - dob.getFullYear() < 18 ? 'Học sinh' : 'Sinh viên'),
          status: 'ACTIVE'
>>>>>>> stable
        }
      })
    }

<<<<<<< HEAD
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


=======
    if (i % 50 === 0) console.log(`  - Đã tạo ${i} hộ khẩu`)
  }

  // --- PHẦN 5: TẠO HOẠT ĐỘNG, ĐẶT LỊCH & REQUESTS ---
  console.log('📅 Tạo lịch trình & hoạt động mẫu...')
  
  // Activity from original seed
  await prisma.culturalCenterActivity.create({
    data: {
      title: 'Họp sinh hoạt tổ dân phố tháng 12',
      description: 'Cuộc họp định kỳ hàng tháng',
      activityType: 'MEETING',
      startDate: new Date('2024-12-15T09:00:00Z'),
      endDate: new Date('2024-12-15T11:00:00Z'),
      culturalCenterId: 'center-1',
      organizer: 'Tổ trưởng',
      participantCount: 50
    }
  })

  // Additional sample activity
  await prisma.culturalCenterActivity.create({
    data: {
      title: 'Họp triển khai kế hoạch năm mới',
      description: 'Họp bàn về kế hoạch năm 2025',
      activityType: 'MEETING',
      startDate: new Date('2025-01-15T19:00:00Z'),
      endDate: new Date('2025-01-15T21:00:00Z'),
      culturalCenterId: 'center-1',
      organizer: 'Ban quản lý tổ dân phố'
    }
  })

  // Bookings from original seed
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
      culturalCenterId: 'center-1',
      userId: admin.id
    }
  })

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
      userId: admin.id
    }
  })

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
      culturalCenterId: 'center-2',
      userId: admin.id
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
      userId: admin.id
    }
  })

  // Request from original seed
  if (firstHouseholdId) {
    await prisma.request.create({
      data: {
        id: 'request-1',
        type: 'HOUSEHOLD_UPDATE',
        description: 'Cập nhật địa chỉ hộ khẩu',
        data: JSON.stringify({
          oldAddress: '123 Đường ABC cũ',
          newAddress: '123 Đường ABC mới'
        }),
        userId: admin.id,
        householdId: firstHouseholdId
      }
    })
  }

  console.log('✅ Hoàn thành toàn bộ quy trình Seed dữ liệu mẫu!')
}

main()
  .catch(e => { console.error(e); process.exit(1) })
  .finally(async () => { await prisma.$disconnect() })
>>>>>>> stable
