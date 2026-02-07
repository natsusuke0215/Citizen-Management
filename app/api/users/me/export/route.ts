import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { message: 'Không tìm thấy token' },
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

    // Get user data with related information
    const userData = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        household: {
          include: {
            districtRelation: true,
            persons: true
          }
        },
        requests: {
          orderBy: {
            createdAt: 'desc'
          }
        },
        bookings: {
          include: {
            culturalCenter: true
          },
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    })

    if (!userData) {
      return NextResponse.json(
        { message: 'Người dùng không tồn tại' },
        { status: 404 }
      )
    }

    // Remove password from export
    const { password, ...exportData } = userData

    // Get format from query params (default: json)
    const format = request.nextUrl.searchParams.get('format') || 'json'

    if (format === 'csv') {
      // Convert to CSV format
      const csvRows: string[] = []
      
      // User info
      csvRows.push('Field,Value')
      csvRows.push(`ID,${exportData.id}`)
      csvRows.push(`Email,${exportData.email}`)
      csvRows.push(`Name,${exportData.name}`)
      csvRows.push(`Role,${exportData.role}`)
      csvRows.push(`Phone,${exportData.phone || ''}`)
      csvRows.push(`Address,${exportData.address || ''}`)
      csvRows.push(`Created At,${exportData.createdAt}`)
      csvRows.push(`Updated At,${exportData.updatedAt}`)
      
      if (exportData.household) {
        csvRows.push(`Household ID,${exportData.household.householdId}`)
        csvRows.push(`Household Owner,${exportData.household.ownerName}`)
        csvRows.push(`Household Address,${exportData.household.address}`)
      }

      const csvContent = csvRows.join('\n')
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
      
      return new NextResponse(blob, {
        headers: {
          'Content-Type': 'text/csv;charset=utf-8;',
          'Content-Disposition': `attachment; filename="user-data-${user.id}.csv"`
        }
      })
    } else {
      // JSON format
      const jsonContent = JSON.stringify(exportData, null, 2)
      const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' })
      
      return new NextResponse(blob, {
        headers: {
          'Content-Type': 'application/json;charset=utf-8;',
          'Content-Disposition': `attachment; filename="user-data-${user.id}.json"`
        }
      })
    }
  } catch (error) {
    console.error('Export data error:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xuất dữ liệu' },
      { status: 500 }
    )
  }
}

