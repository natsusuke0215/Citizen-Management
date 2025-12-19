import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Cập nhật tài sản
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; assetId: string } }
) {
  try {
    const { name, category, quantity, condition, location, notes } = await request.json()

    const asset = await prisma.culturalCenterAsset.update({
      where: { id: params.assetId },
      data: {
        name,
        category: category || null,
        quantity: quantity ? parseInt(quantity) : undefined,
        condition: condition || undefined,
        location: location || null,
        notes: notes || null,
        lastChecked: new Date()
      }
    })

    return NextResponse.json(asset)
  } catch (error) {
    console.error('Error updating asset:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi cập nhật tài sản' },
      { status: 500 }
    )
  }
}

// Xóa tài sản
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; assetId: string } }
) {
  try {
    await prisma.culturalCenterAsset.delete({
      where: { id: params.assetId }
    })

    return NextResponse.json({ message: 'Xóa tài sản thành công' })
  } catch (error) {
    console.error('Error deleting asset:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi xóa tài sản' },
      { status: 500 }
    )
  }
}





