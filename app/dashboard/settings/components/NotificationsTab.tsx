'use client'

import { Bell, Mail } from 'lucide-react'

interface NotificationsTabProps {
  notifications: {
    email: boolean
    push: boolean
  }
  onToggle: (key: 'email' | 'push', value: boolean) => void
}

export default function NotificationsTab({ notifications, onToggle }: NotificationsTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[15px] shadow-drop p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Bell className="h-6 w-6 text-navy-1" />
            Cài đặt thông báo
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Chọn cách bạn muốn nhận thông báo từ hệ thống
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[10px] hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-navy-1/10 rounded-[6px]">
                <Mail className="h-4 w-4 text-navy-1" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notification</p>
                <p className="text-xs text-gray-500">Nhận thông báo qua email</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.email}
                onChange={(e) => onToggle('email', e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-1"></div>
            </label>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[10px] hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-navy-1/10 rounded-[6px]">
                <Bell className="h-4 w-4 text-navy-1" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">System Notification</p>
                <p className="text-xs text-gray-500">Thông báo trên trình duyệt</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={notifications.push}
                onChange={(e) => onToggle('push', e.target.checked)}
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

