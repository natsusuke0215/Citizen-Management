/**
 * HTML Templates cho các loại PDF văn bản nhà nước
 * Sử dụng với Puppeteer để render PDF
 */

export interface HouseholdData {
  householdId: string
  ownerName: string
  address: string
  ward: string
  district: string
  province?: string
  members: Array<{
    fullName: string
    relationship: string
    dateOfBirth: string
    idNumber: string
    gender: string
  }>
}

export interface TemporaryAbsenceData {
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string
  permanentAddress: string // Nơi thường trú (full address string)
  temporaryAddress: string // Nơi tạm trú / destination
  recipient?: string // Kính gửi (optional)
}

export interface TemporaryResidenceData {
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string
  originalAddress: string // Nơi thường trú (full address string)
  temporaryAddress: string // Nơi tạm trú
  recipient?: string // Kính gửi (optional)
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

function getTodayDate(): string {
  const today = new Date()
  const day = String(today.getDate()).padStart(2, '0')
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const year = today.getFullYear()
  return `Ngày ${day} tháng ${month} năm ${year}`
}

/**
 * Template HTML cho PHIẾU KHAI BÁO THÔNG TIN HỘ KHẨU
 */
export function generateHouseholdTemplate(data: HouseholdData): string {
  const fullAddress = [data.address, data.ward, data.district, data.province]
    .filter(Boolean)
    .join(', ')

  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phiếu khai báo thông tin hộ khẩu</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      line-height: 1.5;
      color: #000;
    }
    
    .header-note {
      font-size: 9pt;
      text-align: left;
      margin-bottom: 8px;
    }
    
    .header-title {
      text-align: center;
      font-weight: bold;
      font-size: 12pt;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    
    .header-subtitle {
      text-align: center;
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 10px;
      text-decoration: underline;
    }
    
    .main-title {
      text-align: center;
      font-weight: bold;
      font-size: 14pt;
      margin: 12px 0;
      text-transform: uppercase;
    }
    
    .info-section {
      margin-bottom: 10px;
    }
    
    .info-label {
      font-weight: bold;
      display: inline-block;
      min-width: 120px;
    }
    
    .info-value {
      display: inline-block;
    }
    
    .table-title {
      font-weight: bold;
      font-size: 12pt;
      margin: 8px 0;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 10px 0;
      font-size: 11pt;
    }
    
    table th,
    table td {
      border: 1px solid #000;
      padding: 5px;
      text-align: left;
    }
    
    table th {
      background-color: #fff;
      font-weight: bold;
      text-align: center;
    }
    
    .footer {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
    }
    
    .signature-section {
      text-align: center;
    }
    
    .date-section {
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header-note">
    Mẫu CT01 ban hành kèm theo Thông tư số 66/2023/TT-BCA ngày 17/11/2023 của Bộ trưởng Bộ Công an
  </div>
  
  <div class="header-title">
    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
  </div>
  
  <div class="header-subtitle">
    Độc lập – Tự do – Hạnh phúc
  </div>
  
  <div class="main-title">
    PHIẾU KHAI BÁO THÔNG TIN HỘ KHẨU
  </div>
  
  <div class="info-section">
    <span class="info-label">Số hộ khẩu:</span>
    <span class="info-value">${data.householdId}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">Chủ hộ:</span>
    <span class="info-value">${data.ownerName}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">Địa chỉ:</span>
    <span class="info-value">${fullAddress}</span>
  </div>
  
  <div class="table-title">DANH SÁCH THÀNH VIÊN TRONG HỘ</div>
  
  <table>
    <thead>
      <tr>
        <th>STT</th>
        <th>Họ tên</th>
        <th>Quan hệ với chủ hộ</th>
        <th>Ngày sinh</th>
        <th>Số CCCD</th>
        <th>Giới tính</th>
      </tr>
    </thead>
    <tbody>
      ${data.members
        .map(
          (member, index) => `
      <tr>
        <td style="text-align: center;">${index + 1}</td>
        <td>${member.fullName || ''}</td>
        <td>${member.relationship || ''}</td>
        <td>${formatDate(member.dateOfBirth)}</td>
        <td>${member.idNumber || ''}</td>
        <td>${member.gender || ''}</td>
      </tr>
      `
        )
        .join('')}
    </tbody>
  </table>
  
  <div class="footer">
    <div class="signature-section">
      <div>Chủ hộ</div>
      <div style="margin-top: 15px;">(Ký và ghi rõ họ tên)</div>
    </div>
    
    <div class="signature-section">
      <div>Cán bộ công an</div>
      <div style="margin-top: 15px;">(Ký và ghi rõ họ tên)</div>
    </div>
  </div>
  
  <div class="date-section">
    ${getTodayDate()}
  </div>
</body>
</html>
  `.trim()
}

/**
 * Template HTML cho PHIẾU KHAI BÁO TẠM VẮNG
 */
export function generateTemporaryAbsenceTemplate(data: TemporaryAbsenceData): string {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phiếu khai báo tạm vắng</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      line-height: 1.5;
      color: #000;
    }
    
    .header-note {
      font-size: 9pt;
      text-align: left;
      margin-bottom: 8px;
    }
    
    .header-title {
      text-align: center;
      font-weight: bold;
      font-size: 12pt;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    
    .header-subtitle {
      text-align: center;
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 10px;
      text-decoration: underline;
    }
    
    .main-title {
      text-align: center;
      font-weight: bold;
      font-size: 14pt;
      margin: 12px 0;
      text-transform: uppercase;
    }
    
    .info-section {
      margin-bottom: 8px;
    }
    
    .info-label {
      font-weight: bold;
      display: inline-block;
      min-width: 150px;
    }
    
    .info-value {
      display: inline-block;
    }
    
    .footer {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
    }
    
    .signature-section {
      text-align: center;
    }
    
    .date-section {
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header-note">
    Mẫu CT03 ban hành kèm theo Thông tư số 66/2023/TT-BCA ngày 17/11/2023 của Bộ trưởng Bộ Công an
  </div>
  
  <div class="header-title">
    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
  </div>
  
  <div class="header-subtitle">
    Độc lập – Tự do – Hạnh phúc
  </div>
  
  <div class="main-title">
    PHIẾU KHAI BÁO TẠM VẮNG
  </div>
  
  ${data.recipient ? `<div class="info-section"><span class="info-label">Kính gửi(1):</span><span class="info-value">${data.recipient}</span></div>` : ''}
  
  <div class="info-section">
    <span class="info-label">1. Họ, chữ đệm và tên:</span>
    <span class="info-value">${data.fullName}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">2. Ngày, tháng, năm sinh:</span>
    <span class="info-value">${formatDate(data.dateOfBirth)}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">3. Giới tính:</span>
    <span class="info-value">${data.gender}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">4. Số định danh cá nhân/CMND/CCCD:</span>
    <span class="info-value">${data.idNumber}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">5. Nơi thường trú:</span>
    <span class="info-value">${data.permanentAddress}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">6. Nơi tạm trú:</span>
    <span class="info-value">${data.temporaryAddress}</span>
  </div>
  
  <div class="footer">
    <div class="signature-section">
      <div>Người khai báo</div>
      <div style="margin-top: 15px;">(Ký và ghi rõ họ tên)</div>
    </div>
    
    <div class="signature-section">
      <div>Cán bộ công an</div>
      <div style="margin-top: 15px;">(Ký và ghi rõ họ tên)</div>
    </div>
  </div>
  
  <div class="date-section">
    ${getTodayDate()}
  </div>
</body>
</html>
  `.trim()
}

/**
 * Template HTML cho PHIẾU KHAI BÁO TẠM TRÚ
 */
export function generateTemporaryResidenceTemplate(data: TemporaryResidenceData): string {
  return `
<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Phiếu khai báo tạm trú</title>
  <style>
    @page {
      size: A4;
      margin: 20mm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 13pt;
      line-height: 1.5;
      color: #000;
    }
    
    .header-note {
      font-size: 9pt;
      text-align: left;
      margin-bottom: 8px;
    }
    
    .header-title {
      text-align: center;
      font-weight: bold;
      font-size: 12pt;
      margin-bottom: 6px;
      text-transform: uppercase;
    }
    
    .header-subtitle {
      text-align: center;
      font-weight: bold;
      font-size: 11pt;
      margin-bottom: 10px;
      text-decoration: underline;
    }
    
    .main-title {
      text-align: center;
      font-weight: bold;
      font-size: 14pt;
      margin: 12px 0;
      text-transform: uppercase;
    }
    
    .info-section {
      margin-bottom: 8px;
    }
    
    .info-label {
      font-weight: bold;
      display: inline-block;
      min-width: 150px;
    }
    
    .info-value {
      display: inline-block;
    }
    
    .footer {
      margin-top: 30px;
      display: flex;
      justify-content: space-between;
    }
    
    .signature-section {
      text-align: center;
    }
    
    .date-section {
      text-align: center;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="header-note">
    Mẫu CT02 ban hành kèm theo Thông tư số 66/2023/TT-BCA ngày 17/11/2023 của Bộ trưởng Bộ Công an
  </div>
  
  <div class="header-title">
    CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
  </div>
  
  <div class="header-subtitle">
    Độc lập – Tự do – Hạnh phúc
  </div>
  
  <div class="main-title">
    PHIẾU KHAI BÁO TẠM TRÚ
  </div>
  
  ${data.recipient ? `<div class="info-section"><span class="info-label">Kính gửi(1):</span><span class="info-value">${data.recipient}</span></div>` : ''}
  
  <div class="info-section">
    <span class="info-label">1. Họ, chữ đệm và tên:</span>
    <span class="info-value">${data.fullName}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">2. Ngày, tháng, năm sinh:</span>
    <span class="info-value">${formatDate(data.dateOfBirth)}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">3. Giới tính:</span>
    <span class="info-value">${data.gender}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">4. Số định danh cá nhân/CMND/CCCD:</span>
    <span class="info-value">${data.idNumber}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">5. Nơi thường trú:</span>
    <span class="info-value">${data.originalAddress}</span>
  </div>
  
  <div class="info-section">
    <span class="info-label">6. Nơi tạm trú:</span>
    <span class="info-value">${data.temporaryAddress}</span>
  </div>
  
  <div class="footer">
    <div class="signature-section">
      <div>Người khai báo</div>
      <div style="margin-top: 15px;">(Ký và ghi rõ họ tên)</div>
    </div>
    
    <div class="signature-section">
      <div>Cán bộ công an</div>
      <div style="margin-top: 15px;">(Ký và ghi rõ họ tên)</div>
    </div>
  </div>
  
  <div class="date-section">
    ${getTodayDate()}
  </div>
</body>
</html>
  `.trim()
}

