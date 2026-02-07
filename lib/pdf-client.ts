'use client'

/**
 * PDF Utility - Sử dụng Puppeteer (HTML → PDF)
 * 
 * Đã chuyển sang sử dụng Puppeteer để render PDF từ HTML template.
 * Giải pháp này hỗ trợ tiếng Việt hoàn hảo, không cần lo về font encoding.
 * 
 * Backward compatibility: Re-export từ pdf-puppeteer
 */

// Re-export từ Puppeteer implementation
export {
  exportHouseholdPdf,
  exportTemporaryAbsencePdf,
  exportTemporaryResidencePdf,
} from './pdf-puppeteer'

// Re-export types
export type { HouseholdData, TemporaryAbsenceData, TemporaryResidenceData } from './pdf-puppeteer'

// Legacy interfaces for backward compatibility
export interface Household {
  householdId: string
  ownerName: string
  address: string
  ward: string
  district: string
  province?: string
  members: Citizen[]
  issueDate?: string
}

export interface Citizen {
  fullName: string
  dateOfBirth: string
  idNumber: string
  permanentAddress: string
  gender?: string
  relationship?: string
}

// Legacy code removed - using Puppeteer implementation instead
// All PDF generation now uses HTML templates rendered via Puppeteer

// Keep legacy interfaces for backward compatibility
// Note: exportHouseholdPdf and exportTemporaryAbsencePdf are now exported from pdf-puppeteer

// Legacy jsPDF functions (kept for other PDF types that haven't been migrated yet)
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { ROBOTO_REGULAR_BASE64, FONT_NAME, FONT_STYLE, FONT_FILE_NAME } from './fonts'

function loadVietnameseFont(doc: jsPDF): void {
  try {
    if (!ROBOTO_REGULAR_BASE64 || ROBOTO_REGULAR_BASE64.includes('DEMO_BASE64_STRING_PLACEHOLDER')) {
      doc.setFont('helvetica')
      return
    }
    doc.addFileToVFS(FONT_FILE_NAME, ROBOTO_REGULAR_BASE64)
    doc.addFont(FONT_FILE_NAME, FONT_NAME, FONT_STYLE)
    doc.setFont(FONT_NAME, FONT_STYLE)
  } catch (error) {
    doc.setFont('helvetica')
  }
}

function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString
    }
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return dateString
  }
}

function encodeVietnameseText(text: string): string {
  return text
}

// Legacy function - REMOVED: exportHouseholdPdf is now in pdf-puppeteer
// This function is kept for reference but not exported
function _legacyExportHouseholdPdf(data: Household): void {
  // Tạo document PDF với kích thước A4 (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Nạp font tiếng Việt và đặt làm mặc định
  loadVietnameseFont(doc)

  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const margin = 20
  let currentY = margin

  // ========== HEADER ==========
  // Dòng 1: "Mẫu CT01 ban hành kèm theo Thông tư số 66/2023/TT-BCA..."
  doc.setFontSize(9)
  doc.setTextColor(0, 0, 0)
  doc.text(
    'Mẫu CT01 ban hành kèm theo Thông tư số 66/2023/TT-BCA ngày 17/11/2023 của Bộ trưởng Bộ Công an',
    margin,
    currentY,
    { align: 'left' }
  )
  currentY += 8

  // Dòng 2: "CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM" (căn giữa, in đậm)
  doc.setFontSize(12)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 6

  // Dòng 3: "Độc lập – Tự do – Hạnh phúc" (căn giữa, in đậm, gạch chân)
  doc.setFontSize(11)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('Độc lập – Tự do – Hạnh phúc', pageWidth / 2, currentY, {
    align: 'center',
  })
  // Vẽ gạch chân
  const underlineText = 'Độc lập – Tự do – Hạnh phúc'
  const textWidth = doc.getTextWidth(underlineText)
  doc.line(
    pageWidth / 2 - textWidth / 2,
    currentY + 1,
    pageWidth / 2 + textWidth / 2,
    currentY + 1
  )
  currentY += 10

  // ========== TITLE ==========
  // "PHIẾU KHAI BÁO THÔNG TIN HỘ KHẨU" (căn giữa, in đậm, lớn)
  doc.setFontSize(14)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('PHIẾU KHAI BÁO THÔNG TIN HỘ KHẨU', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 12

  // ========== BODY - THÔNG TIN CHUNG CỦA HỘ ==========
  doc.setFontSize(11)
  doc.setFont(FONT_NAME, 'normal')

  // Thông tin hộ khẩu
  const fullAddress = [
    data.address,
    data.ward,
    data.district,
    data.province || '',
  ]
    .filter(Boolean)
    .join(', ')

  const householdInfo = [
    ['Số hộ khẩu:', data.householdId],
    ['Chủ hộ:', data.ownerName],
    ['Địa chỉ:', fullAddress],
  ]

  householdInfo.forEach(([label, value]) => {
    doc.setFont(FONT_NAME, 'bold')
    doc.text(label, margin, currentY)
    doc.setFont(FONT_NAME, 'normal')
    const labelWidth = doc.getTextWidth(label)
    // Chia text nếu quá dài
    const maxWidth = pageWidth - margin * 2 - labelWidth - 5
    const lines = doc.splitTextToSize(String(value), maxWidth)
    doc.text(lines, margin + labelWidth + 2, currentY)
    currentY += lines.length * 6 + 2
  })

  currentY += 5

  // ========== TABLE - DANH SÁCH THÀNH VIÊN ==========
  // Tiêu đề bảng
  doc.setFontSize(12)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('DANH SÁCH THÀNH VIÊN TRONG HỘ', margin, currentY)
  currentY += 8

  // Chuẩn bị dữ liệu cho bảng
  const tableData = data.members.map((member, index) => [
    (index + 1).toString(), // STT
    member.fullName || '', // Họ tên
    member.relationship || '', // Quan hệ với chủ hộ
    formatDate(member.dateOfBirth), // Ngày sinh
    member.idNumber || '', // Số CCCD
    member.gender || '', // Giới tính
  ])

  // Vẽ bảng sử dụng autoTable
  autoTable(doc, {
    startY: currentY,
    head: [['STT', 'Họ tên', 'Quan hệ với chủ hộ', 'Ngày sinh', 'Số CCCD', 'Giới tính']],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fillColor: [255, 255, 255],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 10,
      font: FONT_NAME, // Sử dụng font tiếng Việt
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [0, 0, 0],
      font: FONT_NAME, // Sử dụng font tiếng Việt
    },
    styles: {
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
      font: FONT_NAME, // Sử dụng font tiếng Việt cho toàn bộ bảng
    },
    margin: { left: margin, right: margin },
  })

  // Lấy vị trí Y sau khi vẽ bảng
  const finalY = (doc as any).lastAutoTable?.finalY || currentY + 50
  currentY = finalY + 10

  // Kiểm tra nếu cần thêm trang mới
  if (currentY > pageHeight - 40) {
    doc.addPage()
    currentY = margin
  }

  // ========== FOOTER - PHẦN KÝ TÊN ==========
  currentY = pageHeight - 50

  // Phần ký tên bên trái: Chủ hộ
  doc.setFontSize(11)
  doc.setFont(FONT_NAME, 'normal')
  doc.text('Chủ hộ', margin, currentY)
  doc.text('(Ký và ghi rõ họ tên)', margin, currentY + 15)

  // Phần ký tên bên phải: Cán bộ công an
  doc.text('Cán bộ công an', pageWidth - margin - 40, currentY, {
    align: 'right',
  })
  doc.text('(Ký và ghi rõ họ tên)', pageWidth - margin - 40, currentY + 15, {
    align: 'right',
  })

  // Thêm ngày tháng
  const today = new Date()
  const dateStr = `Ngày ${today.getDate()} tháng ${today.getMonth() + 1} năm ${today.getFullYear()}`
  doc.text(dateStr, pageWidth / 2, currentY + 25, { align: 'center' })

  // ========== XUẤT FILE ==========
  const filename = `phieu-khai-bao-ho-khau-${data.householdId}.pdf`
  doc.save(filename)
}

/**
 * Hàm xuất PDF cho form "TỜ KHAI THAY ĐỔI THÔNG TIN CƯ TRÚ"
 */
export function exportChangeResidenceInfoPdf(data: {
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string
  phone?: string
  email?: string
  ownerName: string
  relationship: string
  ownerIdNumber: string
  recipient: string
}): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Nạp font tiếng Việt và đặt làm mặc định
  loadVietnameseFont(doc)

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let currentY = margin

  // Header
  doc.setFontSize(9)
  doc.text(
    'Mẫu CT01 ban hành kèm theo Thông tư số 66/2023/TT-BCA ngày 17/11/2023 của Bộ trưởng Bộ Công an',
    margin,
    currentY
  )
  currentY += 8

  doc.setFontSize(12)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 6

  doc.setFontSize(11)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('Độc lập – Tự do – Hạnh phúc', pageWidth / 2, currentY, {
    align: 'center',
  })
  const underlineText = 'Độc lập – Tự do – Hạnh phúc'
  const textWidth = doc.getTextWidth(underlineText)
  doc.line(
    pageWidth / 2 - textWidth / 2,
    currentY + 1,
    pageWidth / 2 + textWidth / 2,
    currentY + 1
  )
  currentY += 10

  // Title
  doc.setFontSize(14)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('TỜ KHAI THAY ĐỔI THÔNG TIN CƯ TRÚ', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 12

  // Kính gửi
  doc.setFontSize(11)
  doc.setFont(FONT_NAME, 'normal')
  doc.text(`Kính gửi(1): ${data.recipient}`, margin, currentY)
  currentY += 10

  // Form fields
  const fields = [
    ['1. Họ, chữ đệm và tên:', data.fullName],
    ['2. Ngày, tháng, năm sinh:', formatDate(data.dateOfBirth)],
    ['3. Giới tính:', data.gender],
    ['4. Số định danh cá nhân:', data.idNumber],
    ['5. Số điện thoại liên hệ:', data.phone || ''],
    ['6. Email:', data.email || ''],
    ['7. Họ, chữ đệm và tên chủ hộ:', data.ownerName],
    ['8. Mối quan hệ với chủ hộ:', data.relationship],
    ['9. Số định danh cá nhân của chủ hộ:', data.ownerIdNumber],
  ]

  fields.forEach(([label, value]) => {
    doc.setFont(FONT_NAME, 'normal')
    doc.text(label, margin, currentY)
    const labelWidth = doc.getTextWidth(label)
    // Vẽ đường gạch ngang cho phần điền
    const lineLength = 100
    doc.line(
      margin + labelWidth + 2,
      currentY - 3,
      margin + labelWidth + 2 + lineLength,
      currentY - 3
    )
    if (value) {
      doc.text(value, margin + labelWidth + 3, currentY)
    }
    currentY += 8
  })

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight()
  currentY = pageHeight - 40
  doc.text('Người khai', margin, currentY)
  doc.text('(Ký và ghi rõ họ tên)', margin, currentY + 15)

  const filename = `to-khai-thay-doi-thong-tin-cu-tru-${data.idNumber}.pdf`
  doc.save(filename)
}

/**
 * Hàm xuất PDF cho form "PHIẾU KHAI BÁO TẠM TRÚ"
 * REMOVED - Now exported from pdf-puppeteer
 * This function is kept for reference but not exported
 */
function _legacyExportTemporaryResidencePdf(data: {
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string
  permanentAddress: string
  temporaryAddress: string
  recipient?: string
}): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Nạp font tiếng Việt và đặt làm mặc định
  loadVietnameseFont(doc)

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let currentY = margin

  // Header
  doc.setFontSize(9)
  doc.text(
    'Mẫu CT02 ban hành kèm theo Thông tư số 66/2023/TT-BCA ngày 17/11/2023 của Bộ trưởng Bộ Công an',
    margin,
    currentY
  )
  currentY += 8

  doc.setFontSize(12)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 6

  doc.setFontSize(11)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('Độc lập – Tự do – Hạnh phúc', pageWidth / 2, currentY, {
    align: 'center',
  })
  const underlineText = 'Độc lập – Tự do – Hạnh phúc'
  const textWidth = doc.getTextWidth(underlineText)
  doc.line(
    pageWidth / 2 - textWidth / 2,
    currentY + 1,
    pageWidth / 2 + textWidth / 2,
    currentY + 1
  )
  currentY += 10

  // Title
  doc.setFontSize(14)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('PHIẾU KHAI BÁO TẠM TRÚ', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 12

  // Kính gửi (nếu có)
  if (data.recipient) {
    doc.setFontSize(11)
    doc.setFont(FONT_NAME, 'normal')
    doc.text(`Kính gửi(1): ${data.recipient}`, margin, currentY)
    currentY += 8
  }

  // Form fields
  doc.setFontSize(11)
  const fields = [
    ['1. Họ, chữ đệm và tên:', data.fullName],
    ['2. Ngày, tháng, năm sinh:', formatDate(data.dateOfBirth)],
    ['3. Giới tính:', data.gender],
    ['4. Số định danh cá nhân/CMND:', data.idNumber],
    ['5. Nơi thường trú:', data.permanentAddress],
    ['6. Nơi tạm trú:', data.temporaryAddress],
  ]

  fields.forEach(([label, value]) => {
    // Use current font (either Vietnamese font or helvetica)
    const currentFont = doc.getFont().fontName
    doc.setFont(currentFont, 'normal')
    doc.text(label, margin, currentY)
    const labelWidth = doc.getTextWidth(label)
    const lineLength = 100
    doc.line(
      margin + labelWidth + 2,
      currentY - 3,
      margin + labelWidth + 2 + lineLength,
      currentY - 3
    )
    if (value) {
      // Encode Vietnamese text properly
      const encodedValue = encodeVietnameseText(value)
      try {
        // Try to use current font (may be Vietnamese font or helvetica)
        const currentFont = doc.getFont().fontName
        if (currentFont === 'helvetica' || currentFont === 'Helvetica') {
          // For helvetica, we need to handle Vietnamese characters differently
          // Split text and render character by character if needed
          doc.text(encodedValue, margin + labelWidth + 3, currentY)
        } else {
          // For custom font, should work fine
          doc.text(encodedValue, margin + labelWidth + 3, currentY)
        }
      } catch (e) {
        console.warn('Error rendering text:', e)
        // Fallback: try without encoding
        doc.text(encodedValue, margin + labelWidth + 3, currentY)
      }
    }
    currentY += 8
  })

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight()
  currentY = pageHeight - 40
  doc.text('Người khai', margin, currentY)
  doc.text('(Ký và ghi rõ họ tên)', margin, currentY + 15)

  // Ensure filename is properly encoded
  const safeIdNumber = (data.idNumber || 'unknown').replace(/[^a-zA-Z0-9]/g, '_')
  const filename = `phieu-khai-bao-tam-tru-${safeIdNumber}.pdf`
  
  try {
    doc.save(filename, { returnPromise: true })
  } catch (error) {
    console.error('Error saving PDF:', error)
    doc.save(filename)
  }
}

/**
 * Hàm xuất PDF cho form "PHIẾU KHAI BÁO TẠM VẮNG"
 * REMOVED - Now exported from pdf-puppeteer
 * This function is kept for reference but not exported
 */
function _legacyExportTemporaryAbsencePdf(data: {
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string
  permanentAddress: string
  temporaryAddress: string
  recipient?: string
}): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Nạp font tiếng Việt và đặt làm mặc định
  loadVietnameseFont(doc)

  const pageWidth = doc.internal.pageSize.getWidth()
  const margin = 20
  let currentY = margin

  // Header
  doc.setFontSize(9)
  doc.text(
    'Mẫu CT03 ban hành kèm theo Thông tư số 66/2023/TT-BCA ngày 17/11/2023 của Bộ trưởng Bộ Công an',
    margin,
    currentY
  )
  currentY += 8

  doc.setFontSize(12)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 6

  doc.setFontSize(11)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('Độc lập – Tự do – Hạnh phúc', pageWidth / 2, currentY, {
    align: 'center',
  })
  const underlineText = 'Độc lập – Tự do – Hạnh phúc'
  const textWidth = doc.getTextWidth(underlineText)
  doc.line(
    pageWidth / 2 - textWidth / 2,
    currentY + 1,
    pageWidth / 2 + textWidth / 2,
    currentY + 1
  )
  currentY += 10

  // Title
  doc.setFontSize(14)
  doc.setFont(FONT_NAME, 'bold')
  doc.text('PHIẾU KHAI BÁO TẠM VẮNG', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 12

  // Kính gửi (nếu có)
  if (data.recipient) {
    doc.setFontSize(11)
    doc.setFont(FONT_NAME, 'normal')
    doc.text(`Kính gửi(1): ${data.recipient}`, margin, currentY)
    currentY += 8
  }

  // Form fields
  doc.setFontSize(11)
  const fields = [
    ['1. Họ, chữ đệm và tên:', data.fullName],
    ['2. Ngày, tháng, năm sinh:', formatDate(data.dateOfBirth)],
    ['3. Giới tính:', data.gender],
    ['4. Số định danh cá nhân/CMND:', data.idNumber],
    ['5. Nơi thường trú:', data.permanentAddress],
    ['6. Nơi tạm trú:', data.temporaryAddress],
  ]

  fields.forEach(([label, value]) => {
    // Use current font (either Vietnamese font or helvetica)
    const currentFont = doc.getFont().fontName
    doc.setFont(currentFont, 'normal')
    doc.text(label, margin, currentY)
    const labelWidth = doc.getTextWidth(label)
    const lineLength = 100
    doc.line(
      margin + labelWidth + 2,
      currentY - 3,
      margin + labelWidth + 2 + lineLength,
      currentY - 3
    )
    if (value) {
      // Encode Vietnamese text properly
      const encodedValue = encodeVietnameseText(value)
      try {
        // Try to use current font (may be Vietnamese font or helvetica)
        const currentFont = doc.getFont().fontName
        if (currentFont === 'helvetica' || currentFont === 'Helvetica') {
          // For helvetica, we need to handle Vietnamese characters differently
          // Split text and render character by character if needed
          doc.text(encodedValue, margin + labelWidth + 3, currentY)
        } else {
          // For custom font, should work fine
          doc.text(encodedValue, margin + labelWidth + 3, currentY)
        }
      } catch (e) {
        console.warn('Error rendering text:', e)
        // Fallback: try without encoding
        doc.text(encodedValue, margin + labelWidth + 3, currentY)
      }
    }
    currentY += 8
  })

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight()
  currentY = pageHeight - 40
  doc.text('Người khai', margin, currentY)
  doc.text('(Ký và ghi rõ họ tên)', margin, currentY + 15)

  // Ensure filename is properly encoded
  const safeIdNumber = (data.idNumber || 'unknown').replace(/[^a-zA-Z0-9]/g, '_')
  const filename = `phieu-khai-bao-tam-vang-${safeIdNumber}.pdf`
  
  try {
    doc.save(filename, { returnPromise: true })
  } catch (error) {
    console.error('Error saving PDF:', error)
    doc.save(filename)
  }
}

