'use client'

import { District } from '../types'

interface HouseholdFormData {
  householdId: string
  ownerName: string
  address: string
  street: string
  ward: string
  district: string
  districtId: string
  householdType: string
  issueDate: string
}

interface HouseholdFormFieldsProps {
  formData: HouseholdFormData
  setFormData: (data: HouseholdFormData) => void
  districts: District[]
}

export default function HouseholdFormFields({
  formData,
  setFormData,
  districts
}: HouseholdFormFieldsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Mã số hộ khẩu <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="input w-full"
          value={formData.householdId}
          onChange={(e) => setFormData({ ...formData, householdId: e.target.value })}
          placeholder="HK001"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Họ và tên chủ hộ <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="input w-full"
          value={formData.ownerName}
          onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
          placeholder="Nguyễn Văn A"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Địa chỉ thường trú - Số nhà <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="input w-full"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          placeholder="123"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Đường phố (ấp)
        </label>
        <input
          type="text"
          className="input w-full"
          value={formData.street}
          onChange={(e) => setFormData({ ...formData, street: e.target.value })}
          placeholder="Đường ABC"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Phường (xã, thị trấn) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="input w-full"
          value={formData.ward}
          onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
          placeholder="Phường 1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Quận (huyện) <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          required
          className="input w-full"
          value={formData.district}
          onChange={(e) => setFormData({ ...formData, district: e.target.value })}
          placeholder="Quận 1"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Khu phố <span className="text-red-500">*</span>
        </label>
        <select
          required
          className="input w-full"
          value={formData.districtId}
          onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
        >
          <option value="">Chọn khu phố</option>
          {districts.map((district) => (
            <option key={district.id} value={district.id}>
              {district.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Loại hộ <span className="text-red-500">*</span>
        </label>
        <select
          required
          className="input w-full"
          value={formData.householdType}
          onChange={(e) => setFormData({ ...formData, householdType: e.target.value })}
          disabled
        >
          <option value="THƯỜNG_TRÚ">Thường trú</option>
        </select>
        <p className="mt-1 text-xs text-gray-500">
          Tạm trú và Tạm vắng được quản lý trong phần quản lý nhân khẩu
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ngày cấp/Ngày đăng ký <span className="text-red-500">*</span>
        </label>
        <input
          type="date"
          required
          className="input w-full"
          value={formData.issueDate}
          onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
        />
      </div>
    </div>
  )
}

