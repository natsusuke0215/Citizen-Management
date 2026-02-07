/**
 * PDF Client sử dụng Puppeteer (HTML → PDF)
 * Giải pháp tốt hơn cho tiếng Việt, không cần lo về font encoding
 */

import {
  generateHouseholdTemplate,
  generateTemporaryAbsenceTemplate,
  generateTemporaryResidenceTemplate,
  type HouseholdData,
  type TemporaryAbsenceData,
  type TemporaryResidenceData,
} from './pdf-templates'

/**
 * Generate PDF từ HTML template sử dụng Puppeteer API
 */
async function generatePdfFromHtml(html: string, filename: string): Promise<void> {
  try {
    const response = await fetch('/api/pdf/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html,
        filename,
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to generate PDF')
    }

    // Get PDF blob
    const blob = await response.blob()
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Error generating PDF:', error)
    throw error
  }
}

/**
 * Export PDF thông tin hộ khẩu
 * Compatible với signature từ pdf-client.ts (Household interface)
 */
export async function exportHouseholdPdf(data: {
  householdId: string
  ownerName: string
  address: string
  ward: string
  district: string
  province?: string
  members: Array<{
    fullName: string
    relationship?: string
    dateOfBirth: string
    idNumber: string
    gender?: string
  }>
}): Promise<void> {
  // Map to HouseholdData format
  const householdData: HouseholdData = {
    householdId: data.householdId,
    ownerName: data.ownerName,
    address: data.address,
    ward: data.ward,
    district: data.district,
    province: data.province,
    members: data.members.map((m) => ({
      fullName: m.fullName || '',
      relationship: m.relationship || '',
      dateOfBirth: m.dateOfBirth,
      idNumber: m.idNumber || '',
      gender: m.gender || '',
    })),
  }
  
  const html = generateHouseholdTemplate(householdData)
  const filename = `phieu-khai-bao-ho-khau-${data.householdId}.pdf`
  await generatePdfFromHtml(html, filename)
}

/**
 * Export PDF phiếu khai báo tạm vắng
 * Compatible với signature cũ từ pdf-client.ts
 */
export async function exportTemporaryAbsencePdf(data: {
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string
  permanentAddress: string
  temporaryAddress: string
  recipient?: string
}): Promise<void> {
  const html = generateTemporaryAbsenceTemplate(data as TemporaryAbsenceData)
  const safeIdNumber = (data.idNumber || 'unknown').replace(/[^a-zA-Z0-9]/g, '_')
  const filename = `phieu-khai-bao-tam-vang-${safeIdNumber}.pdf`
  await generatePdfFromHtml(html, filename)
}

/**
 * Export PDF phiếu khai báo tạm trú
 * Compatible với signature cũ từ pdf-client.ts
 * Frontend có thể truyền permanentAddress hoặc originalAddress
 */
export async function exportTemporaryResidencePdf(data: {
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string
  permanentAddress?: string // Từ frontend
  originalAddress?: string // Từ frontend
  temporaryAddress: string
  recipient?: string
}): Promise<void> {
  // Map permanentAddress (từ frontend) thành originalAddress (cho template)
  const residenceData: TemporaryResidenceData = {
    fullName: data.fullName,
    dateOfBirth: data.dateOfBirth,
    gender: data.gender,
    idNumber: data.idNumber,
    originalAddress: data.originalAddress || data.permanentAddress || '',
    temporaryAddress: data.temporaryAddress,
    recipient: data.recipient,
  }
  
  const html = generateTemporaryResidenceTemplate(residenceData)
  const safeIdNumber = (data.idNumber || 'unknown').replace(/[^a-zA-Z0-9]/g, '_')
  const filename = `phieu-khai-bao-tam-tru-${safeIdNumber}.pdf`
  await generatePdfFromHtml(html, filename)
}

// Re-export types for convenience
export type { HouseholdData, TemporaryAbsenceData, TemporaryResidenceData }

