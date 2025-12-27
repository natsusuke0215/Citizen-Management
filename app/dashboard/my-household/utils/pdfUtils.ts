import { exportHouseholdPdf, type Household as PdfHousehold, type Citizen } from '@/lib/pdf-client'
import { Household, Person } from '../types'

export const exportHouseholdToPdf = (household: Household, persons: Person[]) => {
  if (!household || persons.length === 0) {
    throw new Error('Không có dữ liệu để xuất PDF')
  }

  // Tìm chủ hộ
  const owner = persons.find(p => !p.relationship || p.relationship === 'Chủ hộ') || persons[0]
  
  // Lấy thông tin địa chỉ
  const districtName = household.districtRelation?.name || (typeof household.district === 'string' ? household.district : '') || ''
  const wardName = household.ward || ''
  const streetName = household.street || ''
  
  // Chuyển đổi dữ liệu từ API sang format PDF
  const pdfData: PdfHousehold = {
    householdId: household.householdId,
    ownerName: owner.fullName,
    address: [household.address, streetName].filter(Boolean).join(', '),
    ward: wardName,
    district: districtName,
    members: persons.map((person): Citizen => ({
      fullName: person.fullName,
      dateOfBirth: person.dateOfBirth,
      idNumber: person.idNumber,
      permanentAddress: [household.address, streetName, wardName, districtName].filter(Boolean).join(', '),
      gender: person.gender,
      relationship: person.relationship || 'Chủ hộ',
    })),
  }

  exportHouseholdPdf(pdfData)
}

