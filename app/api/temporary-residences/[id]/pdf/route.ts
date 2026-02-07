import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

async function generateTemporaryResidencePdf(residenceId: string) {
  const residence = await prisma.temporaryResidence.findUnique({
    where: { id: residenceId },
    include: {
      person: true,
    },
  })

  if (!residence) {
    return null
  }

  const person = residence.person

  const pdfDoc = await PDFDocument.create()
  const page = pdfDoc.addPage()
  const { width, height } = page.getSize()

  const font = await pdfDoc.embedFont(StandardFonts.Helvetica)

  const drawText = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0) })
  }

  const margin = 50
  let currentY = height - margin

  // Header
  drawText('GIẤY XÁC NHẬN TẠM TRÚ', margin, currentY, 18)
  currentY -= 30

  drawText(`Họ và tên: ${person.fullName}`, margin, currentY)
  currentY -= 20
  drawText(
    `Ngày sinh: ${person.dateOfBirth.toLocaleDateString('vi-VN')}    Giới tính: ${person.gender}`,
    margin,
    currentY,
  )
  currentY -= 20

  if (person.idNumber) {
    drawText(`Số CMND/CCCD: ${person.idNumber}`, margin, currentY)
    currentY -= 20
  }

  if (residence.originalAddress) {
    drawText(`Địa chỉ thường trú: ${residence.originalAddress}`, margin, currentY)
    currentY -= 20
  }

  drawText(
    `Thời gian tạm trú: từ ${residence.startDate.toLocaleDateString('vi-VN')}` +
      (residence.endDate ? ` đến ${residence.endDate.toLocaleDateString('vi-VN')}` : ''),
    margin,
    currentY,
  )
  currentY -= 20

  if (residence.reason) {
    drawText(`Lý do tạm trú: ${residence.reason}`, margin, currentY)
    currentY -= 20
  }

  currentY -= 20
  drawText('Xác nhận người trên đang tạm trú tại địa bàn.', margin, currentY)

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const pdfBytes = await generateTemporaryResidencePdf(params.id)

    if (!pdfBytes) {
      return NextResponse.json({ message: 'Không tìm thấy giấy tạm trú' }, { status: 404 })
    }

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="giay-tam-tru-${params.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating temporary residence PDF:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo file PDF tạm trú' },
      { status: 500 },
    )
  }
}


