'use client'

import { CheckCircle } from 'lucide-react'
import { Household } from '../types'

interface SelectedHouseholdInfoProps {
  household: Household
}

export default function SelectedHouseholdInfo({ household }: SelectedHouseholdInfoProps) {
  return (
    <div className="mt-4 p-4 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] shadow-drop">
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle className="h-5 w-5" />
        <h3 className="font-semibold">Hộ khẩu đã chọn</h3>
      </div>
      <div className="space-y-1 text-sm">
        <p><strong>Số hộ khẩu:</strong> {household.householdId}</p>
        <p><strong>Chủ hộ:</strong> {household.ownerName}</p>
        <p><strong>Địa chỉ:</strong> {household.address}, {household.street || ''}, {household.ward}, {household.district}</p>
        <p><strong>Số thành viên:</strong> {household.persons.length} người</p>
      </div>
    </div>
  )
}

