import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

async function generateTemporaryAbsencePdf(absenceId: string) {
  const absence = await prisma.temporaryAbsence.findUnique({
    where: { id: absenceId },
    include: {
      person: true,
    },
  })

  if (!absence) {
    return null
  }

  const person = absence.person

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
  drawText('GIẤY XÁC NHẬN TẠM VẮNG', margin, currentY, 18)
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

  if (absence.destination) {
    drawText(`Nơi tạm vắng: ${absence.destination}`, margin, currentY)
    currentY -= 20
  }

  drawText(
    `Thời gian tạm vắng: từ ${absence.startDate.toLocaleDateString('vi-VN')}` +
      (absence.endDate ? ` đến ${absence.endDate.toLocaleDateString('vi-VN')}` : ''),
    margin,
    currentY,
  )
  currentY -= 20

  if (absence.reason) {
    drawText(`Lý do tạm vắng: ${absence.reason}`, margin, currentY)
    currentY -= 20
  }

  currentY -= 20
  drawText('Xác nhận người trên đang tạm vắng khỏi địa bàn.', margin, currentY)

  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const pdfBytes = await generateTemporaryAbsencePdf(params.id)

    if (!pdfBytes) {
      return NextResponse.json({ message: 'Không tìm thấy giấy tạm vắng' }, { status: 404 })
    }

    return new NextResponse(pdfBytes, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="giay-tam-vang-${params.id}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating temporary absence PDF:', error)
    return NextResponse.json(
      { message: 'Có lỗi xảy ra khi tạo file PDF tạm vắng' },
      { status: 500 },
    )
  }
}


