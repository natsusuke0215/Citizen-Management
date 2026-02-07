import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { message: 'Token không hợp lệ' },
        { status: 401 }
      )
    }

    // Only ADMIN, TEAM_LEADER, LEADER, DEPUTY can view all households
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_LEADER' && user.role !== 'LEADER' && user.role !== 'DEPUTY') {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 403 }
      )
    }

    const households = await prisma.household.findMany({
      include: {
        districtRelation: true,
        persons: {
          where: {
            status: 'ACTIVE'
          },
          orderBy: {
            fullName: 'asc'
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(households)
  } catch (error) {
    console.error('Error fetching households:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách hộ khẩu' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value
    if (!token) {
      return NextResponse.json(
        { message: 'Không có quyền truy cập' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { message: 'Token không hợp lệ' },
        { status: 401 }
      )
    }

    // Only ADMIN, TEAM_LEADER, LEADER, DEPUTY can create households
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_LEADER' && user.role !== 'LEADER' && user.role !== 'DEPUTY') {
      return NextResponse.json(
        { message: 'Không có quyền tạo hộ khẩu' },
        { status: 403 }
      )
    }

    const { 
      householdId, 
      ownerName, 
      address, 
      street, 
      ward, 
      district, 
      districtId,
      householdType,
      issueDate,
      members
    } = await request.json()

    if (!householdId || !ownerName || !address || !ward || !district || !districtId || !householdType || !issueDate) {
      return NextResponse.json(
        { message: 'Vui lòng điền đầy đủ thông tin bắt buộc' },
        { status: 400 }
      )
    }

    // Check if household ID already exists
    const existingHousehold = await prisma.household.findUnique({
      where: { householdId }
    })

    if (existingHousehold) {
      return NextResponse.json(
        { message: 'Số hộ khẩu đã tồn tại' },
        { status: 400 }
      )
    }

    // Validate members - must have at least one member
    if (!members || !Array.isArray(members) || members.length === 0) {
      return NextResponse.json(
        { message: 'Vui lòng thêm ít nhất một thành viên cho hộ khẩu' },
        { status: 400 }
      )
    }

    // Validate each member
    for (let i = 0; i < members.length; i++) {
      const member = members[i]
      if (!member.fullName || !member.fullName.trim()) {
        return NextResponse.json(
          { message: `Thành viên ${i + 1}: Vui lòng nhập họ và tên` },
          { status: 400 }
        )
      }
      if (!member.dateOfBirth) {
        return NextResponse.json(
          { message: `Thành viên ${i + 1}: Vui lòng chọn ngày sinh` },
          { status: 400 }
        )
      }
      if (!member.gender) {
        return NextResponse.json(
          { message: `Thành viên ${i + 1}: Vui lòng chọn giới tính` },
          { status: 400 }
        )
      }
      if (!member.relationship) {
        return NextResponse.json(
          { message: `Thành viên ${i + 1}: Vui lòng chọn quan hệ với chủ hộ` },
          { status: 400 }
        )
      }
    }

    // Create household
    // Ensure we don't pass auto-generated fields
    const householdData: any = {
      householdId,
      ownerName,
      address,
      street: street || null,
      ward,
      district,
      districtId,
    }
    
    // Only add householdType if it's a valid value
    if (householdType && householdType.trim() !== '') {
      householdData.householdType = householdType.trim()
    }
    
    // Only add issueDate if provided and valid
    if (issueDate) {
      try {
        const parsedDate = new Date(issueDate)
        if (!isNaN(parsedDate.getTime())) {
          householdData.issueDate = parsedDate
        }
      } catch (error) {
        console.error('Error parsing issueDate:', error)
      }
    }

    const household = await prisma.household.create({
      data: householdData,
      include: {
        districtRelation: true
      }
    })

    // Create persons (members)
    if (members && Array.isArray(members) && members.length > 0) {
      for (const member of members) {
        // Check if ID number already exists (if provided)
        if (member.idNumber) {
          const existingPerson = await prisma.person.findUnique({
            where: { idNumber: member.idNumber }
          })

          if (existingPerson) {
            // Rollback household creation
            await prisma.household.delete({ where: { id: household.id } })
            return NextResponse.json(
              { message: `Số CCCD ${member.idNumber} đã tồn tại trong hệ thống` },
              { status: 400 }
            )
          }
        }

        // Prepare person data
        const personData = {
          fullName: String(member.fullName).trim(),
          dateOfBirth: new Date(member.dateOfBirth),
          gender: String(member.gender).trim(),
          relationship: member.relationship === 'Chủ hộ' ? null : String(member.relationship).trim(),
          idNumber: member.idNumber ? String(member.idNumber).trim() : null,
          origin: member.origin ? String(member.origin).trim() : null,
          ethnicity: member.ethnicity ? String(member.ethnicity).trim() : null,
          religion: member.religion ? String(member.religion).trim() : null,
          nationality: member.nationality ? String(member.nationality).trim() : null,
          education: member.education ? String(member.education).trim() : null,
          householdId: household.id,
          status: 'ACTIVE' as const
        }

        const person = await prisma.person.create({
          data: personData
        })

        // Ghi lịch sử thay đổi nhân khẩu
        await prisma.personChangeHistory.create({
          data: {
            personId: person.id,
            changeType: 'ADD',
            changeDate: new Date(),
            description: `Thêm nhân khẩu mới: ${member.fullName}`,
            newData: JSON.stringify(person)
          }
        })
      }
    }

    // Ghi lịch sử thay đổi hộ khẩu
    await prisma.householdChangeHistory.create({
      data: {
        householdId: household.id,
        changeType: 'CREATE',
        changeDate: new Date(),
        description: `Tạo hộ khẩu mới: ${householdId}`,
        newData: JSON.stringify(household)
      }
    })

    // Fetch complete household with persons
    const completeHousehold = await prisma.household.findUnique({
      where: { id: household.id },
      include: {
        districtRelation: true,
        persons: true
      }
    })

    return NextResponse.json(completeHousehold, { status: 201 })
  } catch (error: any) {
    console.error('Error creating household:', error)
    
    // Return more specific error messages
    if (error.code === 'P2002') {
      return NextResponse.json(
        { message: 'Số hộ khẩu đã tồn tại trong hệ thống' },
        { status: 400 }
      )
    }
    
    if (error.code === 'P2003') {
      return NextResponse.json(
        { message: 'Khu phố không tồn tại. Vui lòng chọn lại khu phố' },
        { status: 400 }
      )
    }
    
    // Return the actual error message if available
    const errorMessage = error.message || 'Có lỗi xảy ra khi tạo hộ khẩu'
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}
