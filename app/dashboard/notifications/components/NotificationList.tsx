'use client'

import { Bell, Check, X, Clock, AlertCircle } from 'lucide-react'

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

interface NotificationListProps {
  notifications: Notification[]
  onMarkAsRead: (id: string) => void
}

export default function NotificationList({
  notifications,
  onMarkAsRead
}: NotificationListProps) {
  const getNotificationIcon = (title: string) => {
    if (title.includes('duyệt') || title.includes('thành công')) {
      return Check
    } else if (title.includes('từ chối') || title.includes('lỗi')) {
      return X
    } else if (title.includes('chờ')) {
      return Clock
    } else {
      return AlertCircle
    }
  }

  const getNotificationColor = (title: string) => {
    if (title.includes('duyệt') || title.includes('thành công')) {
      return 'text-green-600 bg-green-100'
    } else if (title.includes('từ chối') || title.includes('lỗi')) {
      return 'text-red-600 bg-red-100'
    } else if (title.includes('chờ')) {
      return 'text-yellow-600 bg-yellow-100'
    } else {
      return 'text-blue-600 bg-blue-100'
    }
  }

  if (notifications.length === 0) {
    return (
      <div className="text-center py-12">
        <Bell className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có thông báo nào</h3>
        <p className="mt-1 text-sm text-gray-500">
          Bạn chưa có thông báo nào từ hệ thống.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-4">
      {notifications.map((notification) => {
        const Icon = getNotificationIcon(notification.title)
        return (
          <div 
            key={notification.id} 
            className={`card ${!notification.read ? 'border-l-4 border-l-primary-500 bg-primary-50' : ''}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className={`p-3 rounded-lg ${getNotificationColor(notification.title)}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className={`text-lg font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-600'}`}>
                    {notification.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {new Date(notification.createdAt).toLocaleString('vi-VN')}
                  </p>
                </div>
              </div>
              {!notification.read && (
                <button
                  onClick={() => onMarkAsRead(notification.id)}
                  className="text-primary-600 hover:text-primary-900 text-sm font-medium"
                >
                  Đánh dấu đã đọc
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

