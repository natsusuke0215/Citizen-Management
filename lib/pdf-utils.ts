import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

// Interface định nghĩa thông tin công dân
export interface Citizen {
  fullName: string // Họ tên
  dateOfBirth: string // Ngày sinh (format: YYYY-MM-DD)
  idNumber: string // Số CCCD/CMND
  permanentAddress: string // Địa chỉ thường trú
  gender?: string // Giới tính
  relationship?: string // Quan hệ với chủ hộ
}

// Interface định nghĩa thông tin hộ khẩu
export interface Household {
  householdId: string // Số hộ khẩu
  ownerName: string // Họ tên chủ hộ
  address: string // Địa chỉ (số nhà, đường phố)
  ward: string // Phường/Xã
  district: string // Quận/Huyện
  province?: string // Tỉnh/Thành phố
  members: Citizen[] // Danh sách thành viên trong hộ
  issueDate?: string // Ngày cấp
}

// Font Roboto-Regular hỗ trợ tiếng Việt (Base64)
// Lưu ý: Đây là một phần của font Roboto-Regular được encode Base64
// Trong thực tế, bạn nên tải file font .ttf và convert sang Base64
// Có thể sử dụng tool: https://everythingfonts.com/base64
// Hoặc: https://www.fontsquirrel.com/tools/webfont-generator

// Font Roboto-Regular Base64 (rút gọn - cần file đầy đủ trong production)
// Để có font đầy đủ, bạn cần:
// 1. Tải file Roboto-Regular.ttf từ Google Fonts
// 2. Convert sang Base64 bằng tool online hoặc script
// 3. Thay thế chuỗi dưới đây

// Ví dụ Base64 font (đây chỉ là placeholder - cần thay bằng font thật)
const ROBOTO_REGULAR_BASE64 = `
AAEAAAAOAIAAAwBgT1MvMj3hSQEAAADsAAAATmNtYXDQEhm3AAABPAAAAUpjdnQgBkQFRgAAApQAAAAKZnBnbYoKeDsAAAKsAAANkWdhc3AAAAAQAAACjgAAAAAjZ2x5ZgA3
... (font base64 đầy đủ sẽ rất dài, cần file thực tế)
`

// Hàm helper để load font từ Base64
function loadVietnameseFont(doc: jsPDF): void {
  try {
    // Thêm font vào jsPDF
    // Lưu ý: jsPDF không hỗ trợ trực tiếp Base64 font trong browser
    // Cần sử dụng cách khác: tải font file hoặc sử dụng font có sẵn
    
    // Giải pháp: Sử dụng font có sẵn và encoding đúng
    // jsPDF hỗ trợ một số font Unicode, nhưng cần cấu hình đúng
    
    // Cách tốt nhất: Sử dụng file font .ttf và addFont
    // doc.addFont('path/to/Roboto-Regular.ttf', 'Roboto', 'normal')
    
    // Tạm thời sử dụng font mặc định với encoding UTF-8
    // Trong production, cần implement đầy đủ font loading
  } catch (error) {
    console.error('Error loading Vietnamese font:', error)
  }
}

/**
 * Hàm xuất PDF thông tin hộ khẩu theo format văn bản hành chính Việt Nam
 * @param data - Dữ liệu hộ khẩu
 */
export function exportHouseholdPdf(data: Household): void {
  // Tạo document PDF với kích thước A4 (210mm x 297mm)
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  // Thiết lập font (tạm thời dùng font mặc định)
  // Trong production cần load font tiếng Việt đầy đủ
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
  doc.setFont(undefined, 'bold')
  doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 6

  // Dòng 3: "Độc lập – Tự do – Hạnh phúc" (căn giữa, in đậm, gạch chân)
  doc.setFontSize(11)
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
  doc.setFont(undefined, 'bold')
  doc.text('PHIẾU KHAI BÁO THÔNG TIN HỘ KHẨU', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 12

  // ========== BODY - THÔNG TIN CHUNG CỦA HỘ ==========
  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')

  // Thông tin hộ khẩu
  const householdInfo = [
    ['Số hộ khẩu:', data.householdId],
    ['Chủ hộ:', data.ownerName],
    [
      'Địa chỉ:',
      [
        data.address,
        data.ward,
        data.district,
        data.province || '',
      ]
        .filter(Boolean)
        .join(', '),
    ],
  ]

  householdInfo.forEach(([label, value]) => {
    doc.setFont(undefined, 'bold')
    doc.text(label, margin, currentY)
    doc.setFont(undefined, 'normal')
    const labelWidth = doc.getTextWidth(label)
    doc.text(String(value), margin + labelWidth + 2, currentY)
    currentY += 7
  })

  currentY += 5

  // ========== TABLE - DANH SÁCH THÀNH VIÊN ==========
  // Tiêu đề bảng
  doc.setFontSize(12)
  doc.setFont(undefined, 'bold')
  doc.text('DANH SÁCH THÀNH VIÊN TRONG HỘ', margin, currentY)
  currentY += 8

  // Chuẩn bị dữ liệu cho bảng
  const tableData = data.members.map((member, index) => [
    (index + 1).toString(), // STT
    member.fullName, // Họ tên
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
    },
    bodyStyles: {
      fontSize: 10,
      textColor: [0, 0, 0],
    },
    styles: {
      cellPadding: 3,
      lineColor: [0, 0, 0],
      lineWidth: 0.1,
    },
    margin: { left: margin, right: margin },
  })

  // Lấy vị trí Y sau khi vẽ bảng
  const finalY = (doc as any).lastAutoTable.finalY || currentY + 50
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
  doc.setFont(undefined, 'normal')
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
 * Hàm format ngày tháng từ YYYY-MM-DD sang DD/MM/YYYY
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    const day = String(date.getDate()).padStart(2, '0')
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch {
    return dateString
  }
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
  doc.setFont(undefined, 'bold')
  doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 6

  doc.setFontSize(11)
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
  doc.text('TỜ KHAI THAY ĐỔI THÔNG TIN CƯ TRÚ', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 12

  // Kính gửi
  doc.setFontSize(11)
  doc.setFont(undefined, 'normal')
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
    doc.setFont(undefined, 'normal')
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
    doc.text(value, margin + labelWidth + 3, currentY)
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
 * Hàm xuất PDF cho form "PHIẾU KHAI BÁO TẠM VẮNG"
 */
export function exportTemporaryAbsencePdf(data: {
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
  doc.setFont(undefined, 'bold')
  doc.text('CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 6

  doc.setFontSize(11)
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
  doc.text('PHIẾU KHAI BÁO TẠM VẮNG', pageWidth / 2, currentY, {
    align: 'center',
  })
  currentY += 12

  // Kính gửi (nếu có)
  if (data.recipient) {
    doc.setFontSize(11)
    doc.setFont(undefined, 'normal')
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
    doc.setFont(undefined, 'normal')
    doc.text(label, margin, currentY)
    const labelWidth = doc.getTextWidth(label)
    const lineLength = 100
    doc.line(
      margin + labelWidth + 2,
      currentY - 3,
      margin + labelWidth + 2 + lineLength,
      currentY - 3
    )
    doc.text(value, margin + labelWidth + 3, currentY)
    currentY += 8
  })

  // Footer
  const pageHeight = doc.internal.pageSize.getHeight()
  currentY = pageHeight - 40
  doc.text('Người khai', margin, currentY)
  doc.text('(Ký và ghi rõ họ tên)', margin, currentY + 15)

  const filename = `phieu-khai-bao-tam-vang-${data.idNumber}.pdf`
  doc.save(filename)
}

