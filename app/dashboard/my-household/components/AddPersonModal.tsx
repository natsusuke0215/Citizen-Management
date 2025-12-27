'use client'

import { PersonFormData } from '../types'

interface AddPersonModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  formData: PersonFormData
  setFormData: (data: PersonFormData) => void
}

export default function AddPersonModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData
}: AddPersonModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={onSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Thêm nhân khẩu mới
              </h3>
              
              <div className="space-y-4">
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
                    placeholder="Nhập họ và tên đầy đủ"
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
                      required
                      className="mt-1 input"
                      value={formData.gender}
                      onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    >
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Số CMND/CCCD *
                  </label>
                  <input
                    type="text"
                    required
                    className="mt-1 input"
                    value={formData.idNumber}
                    onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                    placeholder="Nhập số CMND/CCCD"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quan hệ với chủ hộ *
                  </label>
                  <select
                    required
                    className="mt-1 input"
                    value={formData.relationship}
                    onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                  >
                    <option value="">Chọn quan hệ</option>
                    <option value="Chủ hộ">Chủ hộ</option>
                    <option value="Vợ/Chồng">Vợ/Chồng</option>
                    <option value="Con">Con</option>
                    <option value="Cha/Mẹ">Cha/Mẹ</option>
                    <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                    <option value="Khác">Khác</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="submit"
                className="btn btn-primary sm:ml-3"
              >
                Gửi yêu cầu
              </button>
              <button
                type="button"
                onClick={onClose}
                className="btn btn-secondary mt-3 sm:mt-0"
              >
                Hủy
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

