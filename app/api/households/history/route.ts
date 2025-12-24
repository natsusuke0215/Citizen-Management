import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Lấy tất cả lịch sử thay đổi hộ khẩu (có thể filter theo householdId)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const householdId = searchParams.get('householdId')
    const changeType = searchParams.get('changeType')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const where: any = {}
    
    if (householdId) {
      where.householdId = householdId
    }
    
    if (changeType) {
      where.changeType = changeType
    }
    
    if (startDate || endDate) {
      where.changeDate = {}
      if (startDate) {
        where.changeDate.gte = new Date(startDate)
      }
      if (endDate) {
        where.changeDate.lte = new Date(endDate)
      }
    }

    // Fetch history - handle deleted households gracefully
    // Use a more defensive approach to handle cases where household might not exist
    let history
    try {
      history = await prisma.householdChangeHistory.findMany({
        where,
        include: {
          household: {
            select: {
              id: true,
              householdId: true,
              ownerName: true
            }
          }
        },
        orderBy: {
          changeDate: 'desc'
        },
        take: 1000 // Limit to prevent too large responses
      })
    } catch (includeError) {
      // If include fails (e.g., due to foreign key issues), try without include
      console.warn('Error with include, trying without:', includeError)
      history = await prisma.householdChangeHistory.findMany({
        where,
        orderBy: {
          changeDate: 'desc'
        },
        take: 1000
      })
      
      // Manually fetch households for records that have valid householdId
      const householdIds = [...new Set(history.map(h => h.householdId).filter(Boolean))]
      let households: any[] = []
      if (householdIds.length > 0) {
        households = await prisma.household.findMany({
          where: {
            id: { in: householdIds }
          },
          select: {
            id: true,
            householdId: true,
            ownerName: true
          }
        })
      }
      
      const householdMap = new Map(households.map(h => [h.id, h]))
      history = history.map(item => ({
        ...item,
        household: householdMap.get(item.householdId) || null
      }))
    }

    // For deleted households, extract info from oldData if household is null
    const historyWithDeletedHouseholds = history.map((item) => {
      if (!item.household && item.oldData) {
        try {
          const oldData = JSON.parse(item.oldData)
          
          // Handle new structure: { household: {...}, previousHistory: [...] }
          // or old structure: { id, householdId, ownerName, ... }
          let householdInfo
          if (oldData.household) {
            // New structure with nested household object
            householdInfo = oldData.household
          } else {
            // Old structure - oldData is the household object directly
            householdInfo = oldData
          }
          
          return {
            ...item,
            household: {
              id: householdInfo.id || item.householdId,
              householdId: householdInfo.householdId || item.householdId || 'N/A',
              ownerName: householdInfo.ownerName || 'Đã xóa'
            }
          }
        } catch (error) {
          // If parsing fails, return with basic info from householdId
          console.error('Error parsing oldData for deleted household:', error, item.oldData)
          return {
            ...item,
            household: {
              id: item.householdId,
              householdId: item.householdId || 'N/A',
              ownerName: 'Đã xóa'
            }
          }
        }
      }
      return item
    })

    return NextResponse.json(historyWithDeletedHouseholds)
  } catch (error: any) {
    console.error('Error fetching household history:', error)
    console.error('Error details:', {
      message: error?.message,
      code: error?.code,
      meta: error?.meta
    })
    return NextResponse.json(
      { 
        message: 'Có lỗi xảy ra khi lấy lịch sử thay đổi',
        error: process.env.NODE_ENV === 'development' ? error?.message : undefined
      },
      { status: 500 }
    )
  }
}


