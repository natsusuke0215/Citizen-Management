'use client'

import { MapPin } from 'lucide-react'

interface AddressInfoFormProps {
  form: {
    originalAddress: string
    temporaryAddress: string
  }
  setForm: (form: any) => void
}

export default function AddressInfoForm({ form, setForm }: AddressInfoFormProps) {
  return (
    <div className="bg-gray-50 rounded-[12px] p-5 border border-gray-200 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <MapPin className="h-5 w-5 text-navy-1" />
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
  )
}

