'use client'

import { useState } from 'react'
import { FileDown, User, Calendar, CreditCard, MapPin } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportTemporaryResidencePdf } from '@/lib/pdf-client'

export default function TemporaryResidencePage() {
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    // Thông tin người tạm trú
    fullName: '',
    dateOfBirth: '',
    gender: '',
    idType: 'CCCD',
    idNumber: '',
    // Thông tin tạm trú
    temporaryAddress: '', // Địa chỉ tạm trú tại địa phương này
    originalAddress: '', // Địa chỉ thường trú gốc (nơi họ đang thường trú)
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    reason: '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    // Validate
    if (!form.fullName || !form.dateOfBirth || !form.gender) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Ngày sinh, Giới tính)')
      setLoading(false)
      return
    }

    if (!form.startDate) {
      toast.error('Vui lòng chọn ngày bắt đầu tạm trú')
      setLoading(false)
      return
    }

    try {
      // Lưu vào database
      const res = await fetch('/api/temporary-residences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Thông tin người tạm trú (tạo mới hoặc tìm theo CMND/CCCD)
          fullName: form.fullName,
          dateOfBirth: form.dateOfBirth,
          gender: form.gender,
          idType: form.idType,
          idNumber: form.idNumber || null,
          // Thông tin tạm trú
          temporaryAddress: form.temporaryAddress || null,
          originalAddress: form.originalAddress || null,
          startDate: form.startDate,
          endDate: form.endDate || null,
          reason: form.reason || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || 'Có lỗi xảy ra khi cấp giấy tạm trú')
      }

      const created = await res.json()
      
      // Tạo và tải PDF sử dụng jsPDF
      exportTemporaryResidencePdf({
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        idNumber: form.idNumber || '',
        permanentAddress: form.originalAddress || '',
        temporaryAddress: form.temporaryAddress || '',
      })
      
      toast.success('Đã cấp giấy tạm trú và tải file PDF')
      
      // Reset form
      setForm({
        fullName: '',
        dateOfBirth: '',
        gender: '',
        idType: 'CCCD',
        idNumber: '',
        temporaryAddress: '',
        originalAddress: '',
        startDate: new Date().toISOString().split('T')[0],
        endDate: '',
        reason: '',
      })
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Có lỗi xảy ra khi cấp giấy tạm trú')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Cấp giấy tạm trú</h1>
          <p className="mt-2 text-sm text-gray-700">
            Điền thông tin người từ nơi khác đến tạm trú tại địa phương này. Sau khi lưu, hệ thống sẽ tự động tải file PDF.
          </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <FileDown className="h-5 w-5 text-primary-600" />
          Thông tin người tạm trú
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cá nhân */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="h-4 w-4 text-primary-600" />
              Thông tin cá nhân
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={form.fullName}
                  onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="input"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="input"
                  value={form.gender}
                  onChange={(e) => setForm({ ...form, gender: e.target.value })}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Loại giấy tờ
                  </label>
                  <select
                    className="input"
                    value={form.idType}
                    onChange={(e) => setForm({ ...form, idType: e.target.value })}
                  >
                    <option value="CCCD">CCCD</option>
                    <option value="CMND">CMND</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số CMND/CCCD
                  </label>
                  <input
                    type="text"
                    className="input"
                    value={form.idNumber}
                    onChange={(e) => setForm({ ...form, idNumber: e.target.value })}
                    placeholder="Nhập số CMND/CCCD (nếu có)"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Thông tin địa chỉ */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary-600" />
              Thông tin địa chỉ
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ thường trú gốc <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={form.originalAddress}
                  onChange={(e) => setForm({ ...form, originalAddress: e.target.value })}
                  placeholder="Nhập địa chỉ thường trú hiện tại (nơi đang đăng ký thường trú)"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Địa chỉ nơi người này đang đăng ký thường trú (từ nơi khác đến)
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ tạm trú tại địa phương này
                </label>
                <input
                  type="text"
                  className="input"
                  value={form.temporaryAddress}
                  onChange={(e) => setForm({ ...form, temporaryAddress: e.target.value })}
                  placeholder="Nhập địa chỉ nơi sẽ tạm trú tại địa phương này"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Địa chỉ nơi người này sẽ tạm trú tại địa phương này
                </p>
              </div>
            </div>
          </div>

          {/* Thông tin tạm trú */}
          <div>
            <h3 className="text-md font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="h-4 w-4 text-primary-600" />
              Thông tin tạm trú
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày bắt đầu tạm trú <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="input"
                  value={form.startDate}
                  onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày kết thúc (nếu có)
                </label>
                <input
                  type="date"
                  className="input"
                  value={form.endDate}
                  onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do tạm trú
              </label>
              <textarea
                className="input"
                rows={3}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                placeholder="Ví dụ: đi làm ăn xa, học tập, công tác, thăm thân..."
              />
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
            <p className="text-sm text-blue-800">
              <strong>Lưu ý:</strong> Sau khi bấm <strong>Lưu và tải PDF</strong>, hệ thống sẽ:
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Tạo bản ghi nhân khẩu tạm trú (nếu chưa có trong hệ thống)</li>
                <li>Tạo giấy xác nhận tạm trú</li>
                <li>Tự động tải file PDF giấy tạm trú</li>
              </ul>
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t">
            <button 
              type="submit" 
              disabled={loading}
              className="btn btn-primary inline-flex items-center"
            >
              <FileDown className="h-4 w-4 mr-2" />
              {loading ? 'Đang xử lý...' : 'Lưu và tải PDF'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}


