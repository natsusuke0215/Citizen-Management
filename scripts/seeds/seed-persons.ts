import { PrismaClient } from '@prisma/client'

export async function seedPersons(prisma: PrismaClient, household1Id: string) {
  console.log('👥 Đang tạo persons...')

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
      householdId: household1Id
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
      householdId: household1Id
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
      householdId: household1Id
    }
  })
}

