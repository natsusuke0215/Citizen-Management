'use client'

import { Building2 } from 'lucide-react'

interface NewHouseholdFormData {
  newHouseholdId: string
  ownerName: string
  address: string
  street: string
  ward: string
  district: string
  splitReason: string
  splitDate: string
}

interface NewHouseholdFormProps {
  formData: NewHouseholdFormData
  setFormData: (data: NewHouseholdFormData) => void
}

export default function NewHouseholdForm({ formData, setFormData }: NewHouseholdFormProps) {
  return (
    <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
          <Building2 className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Thông tin hộ khẩu mới</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số hộ khẩu mới <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="input"
            value={formData.newHouseholdId}
            onChange={(e) => setFormData({ ...formData, newHouseholdId: e.target.value })}
            placeholder="Nhập số hộ khẩu mới"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Họ tên chủ hộ mới <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="input"
            value={formData.ownerName}
            onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
            placeholder="Nhập họ tên chủ hộ mới"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Số nhà <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="input"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            placeholder="Nhập số nhà"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đường phố (ấp)
          </label>
          <input
            type="text"
            className="input"
            value={formData.street}
            onChange={(e) => setFormData({ ...formData, street: e.target.value })}
            placeholder="Nhập đường phố"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phường (xã, thị trấn) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="input"
            value={formData.ward}
            onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
            placeholder="Nhập phường"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Quận (huyện) <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="input"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
            placeholder="Nhập quận"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lý do tách hộ
          </label>
          <textarea
            className="input"
            rows={3}
            value={formData.splitReason}
            onChange={(e) => setFormData({ ...formData, splitReason: e.target.value })}
            placeholder="Nhập lý do tách hộ (nếu có)"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Ngày tách hộ
          </label>
          <input
            type="date"
            className="input"
            value={formData.splitDate}
            onChange={(e) => setFormData({ ...formData, splitDate: e.target.value })}
          />
        </div>
      </div>
    </div>
  )
}

