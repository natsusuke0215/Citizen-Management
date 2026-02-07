'use client'

import { User, Mail, Phone, MapPin, Save, RefreshCw } from 'lucide-react'
import AvatarUpload from './AvatarUpload'

interface ProfileTabProps {
  user: {
    name: string
    email: string
    avatarUrl?: string
  } | null
  profileData: {
    name: string
    email: string
    phone: string
    address: string
  }
  setProfileData: (data: any) => void
  saving: boolean
  onSave: () => void
}

export default function ProfileTab({
  user,
  profileData,
  setProfileData,
  saving,
  onSave
}: ProfileTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[15px] shadow-drop p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <User className="h-6 w-6 text-navy-1" />
              Thông tin cá nhân
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Cập nhật thông tin cá nhân và ảnh đại diện
            </p>
          </div>
        </div>

        {/* Avatar Section */}
        <AvatarUpload
          userName={user?.name || ''}
          userEmail={user?.email || ''}
          avatarUrl={user?.avatarUrl}
        />

        {/* Form Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Họ và tên *
            </label>
            <input
              type="text"
              className="input w-full"
              value={profileData.name}
              onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
              placeholder="Nhập họ và tên"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="email"
                className="input w-full !pl-10"
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="email@example.com"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Số điện thoại
            </label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="tel"
                className="input w-full !pl-10"
                value={profileData.phone}
                onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                placeholder="0123456789"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Địa chỉ
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none z-10" />
              <input
                type="text"
                className="input w-full !pl-10"
                value={profileData.address}
                onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                placeholder="Nhập địa chỉ"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
          <button
            onClick={onSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Lưu thay đổi
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

