'use client'

import { Shield } from 'lucide-react'

interface PrivacyTabProps {
  isPublicProfile: boolean
  onToggle: (value: boolean) => void
}

export default function PrivacyTab({ isPublicProfile, onToggle }: PrivacyTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[15px] shadow-drop p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-6 w-6 text-navy-1" />
            Quyền riêng tư
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Kiểm soát thông tin cá nhân và quyền riêng tư của bạn
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[10px]">
            <div>
              <p className="text-sm font-medium text-gray-900">Public Profile</p>
              <p className="text-xs text-gray-500 mt-1">Cho phép người khác xem thông tin của bạn</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={isPublicProfile}
                onChange={(e) => onToggle(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-1"></div>
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

