'use client'

import { Calendar, XCircle, Eye, EyeOff } from 'lucide-react'
import { Booking, CulturalCenter, BookingFormData } from '../types'

interface BookingModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  formData: BookingFormData
  setFormData: (data: BookingFormData) => void
  centers: CulturalCenter[]
  editingBooking: Booking | null
}

export default function BookingModal({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  centers,
  editingBooking
}: BookingModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity backdrop-blur-sm" 
          onClick={onClose} 
        />
        
        <div className="relative inline-block align-bottom bg-white rounded-[15px] text-left overflow-hidden shadow-drop-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-navy-1 to-navy-2 px-6 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Calendar className="h-6 w-6" />
                {editingBooking ? 'Chỉnh sửa lịch đặt' : 'Đặt lịch mới'}
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <XCircle className="h-6 w-6" />
              </button>
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <div className="bg-white px-6 py-6">
              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Tiêu đề *
                  </label>
                  <input
                    type="text"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Nhập tiêu đề sự kiện"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Mô tả
                  </label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200 resize-none"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Nhập mô tả sự kiện (tùy chọn)"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nhà văn hóa *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200 cursor-pointer"
                    value={formData.culturalCenterId}
                    onChange={(e) => setFormData({ ...formData, culturalCenterId: e.target.value })}
                  >
                    <option value="">Chọn nhà văn hóa</option>
                    {centers.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thời gian bắt đầu *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                      value={formData.startTime}
                      onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Thời gian kết thúc *
                    </label>
                    <input
                      type="datetime-local"
                      required
                      className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                      value={formData.endTime}
                      onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Chế độ hiển thị
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center p-3 border border-gray-200 rounded-[8px] hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="visibility"
                        value="PUBLIC"
                        checked={formData.visibility === 'PUBLIC'}
                        onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' })}
                        className="mr-3 text-navy-1 focus:ring-navy-1"
                      />
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-green-600" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Công khai</span>
                          <p className="text-xs text-gray-500">Mọi người có thể xem lịch đặt này</p>
                        </div>
                      </div>
                    </label>
                    <label className="flex items-center p-3 border border-gray-200 rounded-[8px] hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="radio"
                        name="visibility"
                        value="PRIVATE"
                        checked={formData.visibility === 'PRIVATE'}
                        onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' })}
                        className="mr-3 text-navy-1 focus:ring-navy-1"
                      />
                      <div className="flex items-center gap-2">
                        <EyeOff className="h-4 w-4 text-gray-400" />
                        <div>
                          <span className="text-sm font-medium text-gray-900">Riêng tư</span>
                          <p className="text-xs text-gray-500">Chỉ bạn có thể xem lịch đặt này</p>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-200">
              <button
                type="submit"
                className="px-6 py-2.5 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {editingBooking ? 'Cập nhật' : 'Đặt lịch'}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-[8px] font-medium hover:bg-gray-50 transition-all duration-200"
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

