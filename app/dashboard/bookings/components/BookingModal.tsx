'use client'

import { useMemo } from 'react'
import { Calendar, XCircle } from 'lucide-react'
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
 
  const rateMap: Record<string, number> = {
    'Hội trường tầng 1': 120000,
    'Phòng chức năng 3': 120000,
    'Sân bóng chuyền': 60000,
    'Sân cầu lông': 50000,
    'Sân cầu lông 2': 50000,
    'Phòng họp nhỏ tầng 1': 70000,
    'Phòng đa năng tầng 3': 70000,
    'Phòng chức năng 1': 40000,
    'Phòng chức năng 2': 40000,
    'Phòng thư viện': 30000
  }

  const {
    hours,
    unit,
    rawTotal,
    roundedTotal,
    hoursDisplay,
    unitDisplay,
    totalDisplay
  } = useMemo(() => {
    const selected = centers.find(c => c.id === formData.culturalCenterId) || null
    const unitRate = selected ? (rateMap[selected.name] ?? selected.baseHourlyRate ?? 0) : 0

    if (!formData.startTime || !formData.endTime || !selected) {
      return {
        hours: null,
        unit: unitRate,
        rawTotal: 0,
        roundedTotal: 0,
        hoursDisplay: '—',
        unitDisplay: unitRate ? `${new Intl.NumberFormat('vi-VN').format(unitRate)}đ` : '—',
        totalDisplay: '—'
      }
    }

    const start = new Date(formData.startTime)
    const end = new Date(formData.endTime)
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || end <= start) {
      return {
        hours: null,
        unit: unitRate,
        rawTotal: 0,
        roundedTotal: 0,
        hoursDisplay: '—',
        unitDisplay: unitRate ? `${new Intl.NumberFormat('vi-VN').format(unitRate)}đ` : '—',
        totalDisplay: '—'
      }
    }

    const hrs = (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    const raw = hrs * unitRate
    const rounded = Math.ceil(raw / 1000) * 1000

    return {
      hours: hrs,
      unit: unitRate,
      rawTotal: raw,
      roundedTotal: rounded,
      hoursDisplay: hrs % 1 === 0 ? `${hrs}` : `${hrs.toFixed(2)}`,
      unitDisplay: `${new Intl.NumberFormat('vi-VN').format(unitRate)}đ`,
      totalDisplay: `${new Intl.NumberFormat('vi-VN').format(rounded)}đ`
    }
  }, [formData.startTime, formData.endTime, formData.culturalCenterId, centers])

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
                  {/* Unit price info */}
                  {formData.culturalCenterId && (
                    <div className="mt-2 text-sm text-gray-600">
                      {(() => {
                        const rateMap: Record<string, number> = {
                          'Hội trường tầng 1': 120000,
                          'Phòng chức năng 3': 120000,
                          'Sân bóng chuyền': 60000,
                          'Sân cầu lông': 50000,
                          'Sân cầu lông 2': 50000,
                          'Phòng họp nhỏ tầng 1': 70000,
                          'Phòng đa năng tầng 3': 70000,
                          'Phòng chức năng 1': 40000,
                          'Phòng chức năng 2': 40000,
                          'Phòng thư viện': 30000
                        }

                        const selected = centers.find(c => c.id === formData.culturalCenterId)
                        const unit = selected ? (rateMap[selected.name] ?? selected.baseHourlyRate ?? 0) : 0
                        return `Đơn giá: ${new Intl.NumberFormat('vi-VN').format(unit)}đ/giờ`
                      })()}
                    </div>
                  )}
                </div>
                
                {/* Booker info */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Người đặt (tên)</label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                      value={formData.bookerName || ''}
                      onChange={(e) => setFormData({ ...formData, bookerName: e.target.value })}
                      placeholder="Tên người đặt"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Số điện thoại</label>
                    <input
                      type="tel"
                      className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                      value={formData.bookerPhone || ''}
                      onChange={(e) => setFormData({ ...formData, bookerPhone: e.target.value })}
                      placeholder="Số điện thoại người đặt"
                    />
                  </div>
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
              </div>
            </div>
            
            {/* Payment summary */}
            <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
              <div className="max-w-3xl mx-auto">
                <div className="text-sm text-gray-600 mb-3">Tóm tắt thanh toán</div>
                <div className="bg-white p-4 rounded-[10px] border flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                  <div className="flex gap-8 items-center">
                    <div>
                      <div className="text-sm text-gray-500">Số giờ thuê</div>
                      <div className="text-2xl font-semibold text-gray-900">{hoursDisplay}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Đơn giá</div>
                      <div className="text-2xl font-semibold text-gray-900">{unitDisplay}</div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto text-right">
                    <div className="text-sm text-gray-500">Tổng cộng</div>
                    <div className="text-3xl font-bold text-black">{totalDisplay}</div>
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

