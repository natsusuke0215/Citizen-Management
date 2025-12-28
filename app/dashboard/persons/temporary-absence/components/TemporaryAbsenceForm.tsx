'use client'

import { useState, useEffect, useRef } from 'react'
import { FileDown, CheckCircle, Users } from 'lucide-react'

interface Person {
  id: string
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string | null
  household: {
    id: string
    householdId: string
    address: string
    street?: string | null
    ward?: string | null
    district?: string | null
    districtRelation?: {
      id: string
      name: string
    } | null
  }
}

interface TemporaryAbsenceFormProps {
  selectedPerson: Person | null
  form: {
    startDate: string
    endDate: string
    reason: string
    destination: string
  }
  setForm: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
}

export default function TemporaryAbsenceForm({
  selectedPerson,
  form,
  setForm,
  onSubmit
}: TemporaryAbsenceFormProps) {
  // Local state for text inputs to prevent lag
  const [localReason, setLocalReason] = useState(form.reason)
  const [localDestination, setLocalDestination] = useState(form.destination)
  const debounceTimer = useRef<NodeJS.Timeout | null>(null)

  // Sync local state with form prop
  useEffect(() => {
    setLocalReason(form.reason)
    setLocalDestination(form.destination)
  }, [form.reason, form.destination])

  // Debounced update for reason field
  const handleReasonChange = (value: string) => {
    setLocalReason(value)
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      setForm({ ...form, reason: value })
    }, 300)
  }

  // Debounced update for destination field
  const handleDestinationChange = (value: string) => {
    setLocalDestination(value)
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current)
    }
    debounceTimer.current = setTimeout(() => {
      setForm({ ...form, destination: value })
    }, 300)
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimer.current) {
        clearTimeout(debounceTimer.current)
      }
    }
  }, [])

  if (!selectedPerson) {
    return (
      <div className="h-full flex flex-col items-center justify-center py-12 text-center">
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-1 to-navy-2 opacity-10 rounded-full blur-2xl"></div>
          <Users className="h-16 w-16 text-gray-400 relative" />
        </div>
        <p className="text-sm font-medium text-gray-700 mb-1">Chưa chọn nhân khẩu</p>
        <p className="text-xs text-gray-500">Vui lòng chọn một nhân khẩu ở danh sách bên trái</p>
      </div>
    )
  }

  const household = selectedPerson.household
  const addressParts = [
    household?.address,
    household?.street,
    household?.ward,
    household?.district,
    household?.districtRelation?.name
  ].filter(Boolean)
  const permanentAddress = addressParts.length > 0 ? addressParts.join(', ') : 'N/A'

  return (
    <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[10px]">
          <FileDown className="h-6 w-6 text-navy-1" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Thông tin giấy tạm vắng</h2>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[10px] p-4 shadow-drop">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5" />
            <div className="font-semibold text-lg">{selectedPerson.fullName}</div>
          </div>
          <div className="text-sm opacity-90">
            Ngày sinh: {new Date(selectedPerson.dateOfBirth).toLocaleDateString('vi-VN')} - Giới tính: {selectedPerson.gender}
          </div>
          {selectedPerson.idNumber && (
            <div className="text-sm opacity-90 mt-1">
              CMND/CCCD: {selectedPerson.idNumber}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ngày bắt đầu tạm vắng <span className="text-red-500">*</span>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc (nếu có)</label>
            <input
              type="date"
              className="input"
              value={form.endDate}
              onChange={(e) => setForm({ ...form, endDate: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Lý do tạm vắng</label>
          <textarea
            className="input"
            rows={3}
            value={localReason}
            onChange={(e) => handleReasonChange(e.target.value)}
            onBlur={(e) => {
              // Update immediately on blur
              if (debounceTimer.current) {
                clearTimeout(debounceTimer.current)
              }
              setForm({ ...form, reason: e.target.value })
            }}
            placeholder="Ví dụ: đi công tác, học tập, chữa bệnh..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Nơi tạm vắng</label>
          <input
            type="text"
            className="input"
            value={localDestination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            onBlur={(e) => {
              // Update immediately on blur
              if (debounceTimer.current) {
                clearTimeout(debounceTimer.current)
              }
              setForm({ ...form, destination: e.target.value })
            }}
            placeholder="Nhập địa chỉ nơi tạm vắng"
          />
        </div>

        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-[10px] p-4">
          <p className="text-xs text-blue-800">
            <strong>Lưu ý:</strong> Sau khi bấm <strong>Lưu và tải PDF</strong>, hệ thống sẽ tạo bản ghi tạm vắng và tự động tải file giấy xác nhận tạm vắng.
          </p>
        </div>

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button 
            type="submit" 
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 inline-flex items-center"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Lưu và tải PDF
          </button>
        </div>
      </form>
    </div>
  )
}

