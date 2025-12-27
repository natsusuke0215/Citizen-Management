'use client'

import { MapPin } from 'lucide-react'
import { District } from '../../shared/types'

interface TransferFormData {
  newAddress: string
  newStreet: string
  newWard: string
  newDistrict: string
  newDistrictId: string
  transferReason: string
  transferDate: string
}

interface TransferFormProps {
  formData: TransferFormData
  setFormData: (data: TransferFormData) => void
  districts: District[]
  loading: boolean
  onSubmit: (e: React.FormEvent) => void
  onCancel: () => void
}

export default function TransferForm({
  formData,
  setFormData,
  districts,
  loading,
  onSubmit,
  onCancel
}: TransferFormProps) {
  return (
    <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[10px]">
          <MapPin className="h-6 w-6 text-navy-1" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Địa chỉ mới</h2>
      </div>
      <form onSubmit={onSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Số nhà mới <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.newAddress}
              onChange={(e) => setFormData({ ...formData, newAddress: e.target.value })}
              placeholder="Nhập số nhà mới"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Đường phố (ấp) mới
            </label>
            <input
              type="text"
              className="input"
              value={formData.newStreet}
              onChange={(e) => setFormData({ ...formData, newStreet: e.target.value })}
              placeholder="Nhập đường phố mới"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phường (xã, thị trấn) mới <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.newWard}
              onChange={(e) => setFormData({ ...formData, newWard: e.target.value })}
              placeholder="Nhập phường mới"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Quận (huyện) mới <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              className="input"
              value={formData.newDistrict}
              onChange={(e) => setFormData({ ...formData, newDistrict: e.target.value })}
              placeholder="Nhập quận mới"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Khu phố mới <span className="text-red-500">*</span>
            </label>
            <select
              required
              className="input"
              value={formData.newDistrictId}
              onChange={(e) => setFormData({ ...formData, newDistrictId: e.target.value })}
            >
              <option value="">Chọn khu phố mới</option>
              {districts.map((district) => (
                <option key={district.id} value={district.id}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày chuyển
            </label>
            <input
              type="date"
              className="input"
              value={formData.transferDate}
              onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lý do chuyển
            </label>
            <textarea
              className="input"
              rows={3}
              value={formData.transferReason}
              onChange={(e) => setFormData({ ...formData, transferReason: e.target.value })}
              placeholder="Nhập lý do chuyển hộ khẩu (nếu có)"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all duration-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center"
          >
            {loading ? 'Đang xử lý...' : 'Chuyển hộ khẩu'}
          </button>
        </div>
      </form>
    </div>
  )
}

