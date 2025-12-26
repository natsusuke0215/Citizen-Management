'use client'

import { RequestFormData, REQUEST_TYPES } from '../types'

interface CreateRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  formData: RequestFormData
  setFormData: (data: RequestFormData) => void
}

export default function CreateRequestModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData
}: CreateRequestModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <form onSubmit={onSubmit}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Tạo yêu cầu mới
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Loại yêu cầu *
                  </label>
                  <select
                    required
                    className="mt-1 input"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value as RequestFormData['type'] })}
                  >
                    {Object.entries(REQUEST_TYPES).map(([key, value]) => (
                      <option key={key} value={key}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Mô tả yêu cầu *
                  </label>
                  <textarea
                    required
                    className="mt-1 input"
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Mô tả chi tiết yêu cầu của bạn..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Thông tin bổ sung
                  </label>
                  <textarea
                    className="mt-1 input"
                    rows={3}
                    value={formData.additionalData}
                    onChange={(e) => setFormData({ ...formData, additionalData: e.target.value })}
                    placeholder="Thông tin bổ sung (tùy chọn)..."
                  />
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

