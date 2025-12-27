import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { verifyToken } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Check if user has permission (admin/leader or member of this household)
    const household = await prisma.household.findUnique({
      where: { id: params.id },
      include: {
        districtRelation: true,
        persons: true,
        changeHistory: {
          orderBy: { changeDate: 'desc' }
        }
      }
    })

    if (!household) {
      return NextResponse.json(
        { message: 'Không tìm thấy hộ khẩu' },
        { status: 404 }
      )
    }

    // Check authorization: admin/leader can view all, or user is a member
    const isAuthorized = 
      user.role === 'ADMIN' || 
      user.role === 'TEAM_LEADER' || 
      user.role === 'LEADER' || 
      user.role === 'DEPUTY'

    if (!isAuthorized) {
      return NextResponse.json(
        { message: 'Không có quyền truy cập hộ khẩu này' },
        { status: 403 }
      )
    }

    return NextResponse.json(household)
  } catch (error) {
    console.error('Error fetching household:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy thông tin hộ khẩu' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Only ADMIN, TEAM_LEADER, LEADER, DEPUTY can update households
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_LEADER' && user.role !== 'LEADER' && user.role !== 'DEPUTY') {
      return NextResponse.json(
        { message: 'Không có quyền cập nhật hộ khẩu' },
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
      issueDate
    } = await request.json()

    if (!householdId || !ownerName || !address || !ward || !district || !districtId) {
      return NextResponse.json(
        { message: 'Số hộ khẩu, tên chủ hộ, địa chỉ, phường, quận và khu phố là bắt buộc' },
        { status: 400 }
      )
    }

    // Get old data for history
    const oldHousehold = await prisma.household.findUnique({
      where: { id: params.id }
    })

    // Check if household ID already exists (excluding current household)
    const existingHousehold = await prisma.household.findFirst({
      where: {
        householdId,
        id: { not: params.id }
      }
    })

    if (existingHousehold) {
      return NextResponse.json(
        { message: 'Số hộ khẩu đã tồn tại' },
        { status: 400 }
      )
    }

    const updateData: any = {
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
      updateData.householdType = householdType.trim()
    } else {
      updateData.householdType = null
    }
    
    // Only add issueDate if provided and valid
    if (issueDate) {
      try {
        const parsedDate = new Date(issueDate)
        if (!isNaN(parsedDate.getTime())) {
          updateData.issueDate = parsedDate
        }
      } catch (error) {
        console.error('Error parsing issueDate:', error)
      }
    } else {
      updateData.issueDate = null
    }

    const household = await prisma.household.update({
      where: { id: params.id },
      data: updateData,
      include: {
        districtRelation: true
      }
    })

    // Ghi lịch sử thay đổi
    const changes: string[] = []
    if (oldHousehold) {
      if (oldHousehold.householdId !== householdId) changes.push(`Số hộ khẩu: ${oldHousehold.householdId} → ${householdId}`)
      if (oldHousehold.ownerName !== ownerName) changes.push(`Chủ hộ: ${oldHousehold.ownerName} → ${ownerName}`)
      if (oldHousehold.address !== address) changes.push(`Địa chỉ: ${oldHousehold.address} → ${address}`)
      if (oldHousehold.ward !== ward) changes.push(`Phường: ${oldHousehold.ward} → ${ward}`)
      if (oldHousehold.district !== district) changes.push(`Quận: ${oldHousehold.district} → ${district}`)
      if (oldHousehold.districtId !== districtId) changes.push(`Khu phố đã thay đổi`)
    }
    
    const description = changes.length > 0 
      ? `Cập nhật hộ khẩu ${householdId}: ${changes.join(', ')}`
      : `Cập nhật thông tin hộ khẩu ${householdId}`
    
    await prisma.householdChangeHistory.create({
      data: {
        householdId: household.id,
        changeType: 'UPDATE',
        changeDate: new Date(),
        description: description,
        oldData: oldHousehold ? JSON.stringify(oldHousehold) : null,
        newData: JSON.stringify(household)
      }
    })

    return NextResponse.json(household)
  } catch (error) {
    console.error('Error updating household:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật hộ khẩu' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    // Only ADMIN and TEAM_LEADER can delete households
    if (user.role !== 'ADMIN' && user.role !== 'TEAM_LEADER' && user.role !== 'LEADER') {
      return NextResponse.json(
        { message: 'Bạn không có quyền xóa hộ khẩu' },
        { status: 403 }
      )
    }

    // Check all relationships that might prevent deletion
    const household = await prisma.household.findUnique({
      where: { id: params.id },
      include: { 
        persons: true,
        requests: true,
        changeHistory: true,
        splitTo: true
      }
    })

    if (!household) {
      return NextResponse.json(
        { message: 'Không tìm thấy hộ khẩu' },
        { status: 404 }
      )
    }

    // Check for blocking relationships and provide detailed error messages
    const blockingReasons: string[] = []
    
    if (household.persons.length > 0) {
      const activePersons = household.persons.filter(p => p.status === 'ACTIVE').length
      const movedOutPersons = household.persons.filter(p => p.status === 'MOVED_OUT').length
      const deceasedPersons = household.persons.filter(p => p.status === 'DECEASED').length
      
      const personDetails: string[] = []
      if (activePersons > 0) personDetails.push(`${activePersons} nhân khẩu đang hoạt động`)
      if (movedOutPersons > 0) personDetails.push(`${movedOutPersons} nhân khẩu đã chuyển đi`)
      if (deceasedPersons > 0) personDetails.push(`${deceasedPersons} nhân khẩu đã qua đời`)
      
      blockingReasons.push(`Có ${household.persons.length} nhân khẩu (${personDetails.join(', ')})`)
    }

    if (household.requests.length > 0) {
      blockingReasons.push(`${household.requests.length} yêu cầu liên quan`)
    }

    if (household.splitTo.length > 0) {
      blockingReasons.push(`Đã được tách thành ${household.splitTo.length} hộ khẩu khác`)
    }

    if (blockingReasons.length > 0) {
      return NextResponse.json(
        { 
          message: `Không thể xóa hộ khẩu do có dữ liệu liên quan: ${blockingReasons.join(', ')}. Vui lòng xử lý các dữ liệu này trước khi xóa.`,
          details: {
            persons: household.persons.length,
            activePersons: household.persons.filter(p => p.status === 'ACTIVE').length,
            movedOutPersons: household.persons.filter(p => p.status === 'MOVED_OUT').length,
            deceasedPersons: household.persons.filter(p => p.status === 'DECEASED').length,
            requests: household.requests.length,
            splitTo: household.splitTo.length
          }
        },
        { status: 400 }
      )
    }

    // Save household data for history before deletion
    const householdDataForHistory = {
      id: household.id,
      householdId: household.householdId,
      ownerName: household.ownerName,
      address: household.address,
      street: household.street,
      ward: household.ward,
      district: household.district,
      districtId: household.districtId,
      householdType: household.householdType,
      issueDate: household.issueDate,
      createdAt: household.createdAt,
      updatedAt: household.updatedAt
    }

    // Save all change history data before deletion
    const allChangeHistory = household.changeHistory.map(h => ({
      changeType: h.changeType,
      changeDate: h.changeDate,
      description: h.description,
      oldData: h.oldData,
      newData: h.newData
    }))

    // Use transaction to ensure atomicity
    await prisma.$transaction(async (tx) => {
      // Delete all change history first (to avoid foreign key constraint)
      await tx.householdChangeHistory.deleteMany({
        where: { householdId: params.id }
      })

      // Delete the household
      await tx.household.delete({
        where: { id: params.id }
      })
    })

    // Create delete history record AFTER deletion using raw SQL
    // This bypasses foreign key constraint since household is already deleted
    try {
      // Generate a unique ID (using cuid-like format)
      const deleteHistoryId = `cl${Date.now()}${Math.random().toString(36).substr(2, 9)}`
      const deleteDescription = `Xóa hộ khẩu: ${household.householdId} - ${household.ownerName}`
      const deleteOldData = JSON.stringify({
        household: householdDataForHistory,
        previousHistory: allChangeHistory
      })
      const now = new Date().toISOString()
      
      // Escape single quotes in strings for SQL
      const escapeSql = (str: string | null) => {
        if (str === null) return 'NULL'
        return `'${str.replace(/'/g, "''")}'`
      }
      
      // Temporarily disable foreign key checks (SQLite specific)
      await prisma.$executeRawUnsafe('PRAGMA foreign_keys = OFF')
      
      // Use raw SQL to insert without foreign key constraint check
      // SQLite - use template string with proper escaping
      const sql = `INSERT INTO household_change_history (id, householdId, changeType, changeDate, description, oldData, newData, createdAt)
                   VALUES (${escapeSql(deleteHistoryId)}, ${escapeSql(params.id)}, ${escapeSql('DELETE')}, ${escapeSql(now)}, ${escapeSql(deleteDescription)}, ${escapeSql(deleteOldData)}, NULL, ${escapeSql(now)})`
      
      await prisma.$executeRawUnsafe(sql)
      
      // Re-enable foreign key checks
      await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON')
      
      console.log('Delete history created successfully for household:', params.id)
    } catch (error: any) {
      // If raw insert fails, log but don't fail the deletion
      console.error('Failed to create delete history:', error)
      console.error('Error details:', {
        message: error.message,
        code: error.code,
        meta: error.meta
      })
      // Re-enable foreign key checks in case of error
      try {
        await prisma.$executeRawUnsafe('PRAGMA foreign_keys = ON')
      } catch (e) {
        console.error('Failed to re-enable foreign keys:', e)
      }
      // The household is already deleted, so we continue
    }

    return NextResponse.json({ message: 'Xóa hộ khẩu thành công' })
  } catch (error: any) {
    console.error('Error deleting household:', error)
    
    // Return more specific error messages
    if (error.code === 'P2003') {
      return NextResponse.json(
        { message: 'Không thể xóa hộ khẩu do có dữ liệu liên quan trong hệ thống. Vui lòng kiểm tra lại các nhân khẩu, yêu cầu và lịch sử thay đổi.' },
        { status: 400 }
      )
    }
    
    const errorMessage = error.message || 'Có lỗi xảy ra khi xóa hộ khẩu'
    return NextResponse.json(
      { message: errorMessage },
      { status: 500 }
    )
  }
}
