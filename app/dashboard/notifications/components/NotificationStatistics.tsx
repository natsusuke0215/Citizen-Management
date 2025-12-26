'use client'

import { Bell, Clock, Check } from 'lucide-react'

interface NotificationStatisticsProps {
  totalNotifications: number
  unreadCount: number
  readCount: number
}

export default function NotificationStatistics({
  totalNotifications,
  unreadCount,
  readCount
}: NotificationStatisticsProps) {
  return (
    <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-3">
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-lg bg-blue-100">
              <Bell className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Tổng thông báo
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {totalNotifications}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-lg bg-yellow-100">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Chưa đọc
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {unreadCount}
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-lg bg-green-100">
              <Check className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Đã đọc
            </h3>
            <p className="text-2xl font-bold text-gray-900">
              {readCount}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

