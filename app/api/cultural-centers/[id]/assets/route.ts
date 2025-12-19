import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Lấy danh sách tài sản của nhà văn hóa
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const assets = await prisma.culturalCenterAsset.findMany({
      where: {
        culturalCenterId: params.id
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(assets)
  } catch (error) {
    console.error('Error fetching assets:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi lấy danh sách tài sản' },
      { status: 500 }
    )
  }
}

// Thêm tài sản mới
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name, category, quantity, condition, location, notes } = await request.json()

    if (!name || !quantity) {
      return NextResponse.json(
        { message: 'Tên tài sản và số lượng là bắt buộc' },
        { status: 400 }
      )
    }

    const asset = await prisma.culturalCenterAsset.create({
      data: {
        name,
        category: category || null,
        quantity: parseInt(quantity),
        condition: condition || 'GOOD',
        location: location || null,
        culturalCenterId: params.id,
        notes: notes || null,
        lastChecked: new Date()
      }
    })

    return NextResponse.json(asset, { status: 201 })
  } catch (error) {
    console.error('Error creating asset:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi thêm tài sản' },
      { status: 500 }
    )
  }
}





