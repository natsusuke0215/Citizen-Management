'use client'

import { UserPlus, X } from 'lucide-react'

interface AddPersonModalProps {
  formData: {
    fullName: string
    dateOfBirth: string
    gender: string
    idType: string
    idNumber: string
    householdId: string
  }
  setFormData: (data: any) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export default function AddPersonModal({
  formData,
  setFormData,
  onSubmit,
  onClose
}: AddPersonModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center py-8 px-4">
      <div className="relative w-full max-w-2xl bg-white rounded-[15px] shadow-drop-lg border border-gray-200 my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-1 to-navy-2 p-6 rounded-t-[15px] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <UserPlus className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">Thêm nhân khẩu mới</h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Họ và tên *
              </label>
              <input
                type="text"
                required
                className="mt-1 input"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ngày sinh *
                </label>
                <input
                  type="date"
                  required
                  className="mt-1 input"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Giới tính *
                </label>
                <select
                  className="mt-1 input"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loại giấy tờ
                </label>
                <select
                  className="mt-1 input"
                  value={formData.idType}
                  onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                >
                  <option value="CCCD">CCCD</option>
                  <option value="CMND">CMND</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Số CCCD/CMND
                </label>
                <input
                  type="text"
                  className="mt-1 input"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="0123456789"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                ID hộ khẩu *
              </label>
              <input
                type="text"
                required
                className="mt-1 input"
                value={formData.householdId}
                onChange={(e) => setFormData({ ...formData, householdId: e.target.value })}
                placeholder="Nhập ID hộ khẩu (khóa kỹ thuật)"
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Thêm mới
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

