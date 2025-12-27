'use client'

import { User } from 'lucide-react'

interface PersonalInfoFormProps {
  form: {
    fullName: string
    dateOfBirth: string
    gender: string
    idType: string
    idNumber: string
  }
  setForm: (form: any) => void
}

export default function PersonalInfoForm({ form, setForm }: PersonalInfoFormProps) {
  return (
    <div className="bg-gray-50 rounded-[12px] p-5 border border-gray-200 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <User className="h-5 w-5 text-navy-1" />
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
  )
}

