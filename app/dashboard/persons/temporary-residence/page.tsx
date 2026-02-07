'use client'

import { useState } from 'react'
import { FileText, User, FileDown, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportTemporaryResidencePdf } from '@/lib/pdf-client'
import PersonalInfoForm from './components/PersonalInfoForm'
import AddressInfoForm from './components/AddressInfoForm'
import TemporaryResidenceInfoForm from './components/TemporaryResidenceInfoForm'

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
      
      // Tạo và tải PDF sử dụng Puppeteer (hỗ trợ font tiếng Việt)
      exportTemporaryResidencePdf({
        fullName: form.fullName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender,
        idNumber: form.idNumber || '',
        originalAddress: form.originalAddress || '',
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
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-8 w-8 text-navy-1" />
            Cấp giấy tạm trú
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Điền thông tin người từ nơi khác đến tạm trú tại địa phương này. Sau khi lưu, hệ thống sẽ tự động tải file PDF.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
            <User className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Thông tin người tạm trú</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Thông tin cá nhân */}
          <PersonalInfoForm form={form} setForm={setForm} />

          {/* Thông tin địa chỉ */}
          <AddressInfoForm form={form} setForm={setForm} />

          {/* Thông tin tạm trú */}
          <TemporaryResidenceInfoForm form={form} setForm={setForm} />

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-[10px] p-5">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-blue-500 rounded-[8px]">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-blue-900 mb-2">
                  Lưu ý:
                </p>
                <p className="text-sm text-blue-800 mb-3">
                  Sau khi bấm <strong>Lưu và tải PDF</strong>, hệ thống sẽ:
                </p>
                <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                  <li>Tạo bản ghi nhân khẩu tạm trú (nếu chưa có trong hệ thống)</li>
                  <li>Tạo giấy xác nhận tạm trú</li>
                  <li>Tự động tải file PDF giấy tạm trú</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button 
              type="submit" 
              disabled={loading}
              className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center"
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
