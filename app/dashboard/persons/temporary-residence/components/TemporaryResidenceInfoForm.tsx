'use client'

import { Calendar } from 'lucide-react'

interface TemporaryResidenceInfoFormProps {
  form: {
    startDate: string
    endDate: string
    reason: string
  }
  setForm: (form: any) => void
}

export default function TemporaryResidenceInfoForm({ form, setForm }: TemporaryResidenceInfoFormProps) {
  return (
    <div className="bg-gray-50 rounded-[12px] p-5 border border-gray-200 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Calendar className="h-5 w-5 text-navy-1" />
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
  )
}

