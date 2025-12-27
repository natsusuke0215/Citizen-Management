'use client'

import { useState, useEffect } from 'react'
import { Check } from 'lucide-react'
import toast from 'react-hot-toast'
import NotificationStatistics from './components/NotificationStatistics'
import NotificationList from './components/NotificationList'

interface Notification {
  id: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data)
        setUnreadCount(data.filter((n: Notification) => !n.read).length)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải thông báo')
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (id: string) => {
    try {
      const response = await fetch(`/api/notifications/${id}/read`, {
        method: 'PATCH'
      })

      if (response.ok) {
        setNotifications(prev => 
          prev.map(n => n.id === id ? { ...n, read: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông báo')
    }
  }

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.read)
      await Promise.all(
        unreadNotifications.map(n => 
          fetch(`/api/notifications/${n.id}/read`, { method: 'PATCH' })
        )
      )
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      )
      setUnreadCount(0)
      toast.success('Đã đánh dấu tất cả thông báo là đã đọc')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thông báo')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Thông báo</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý thông báo và cập nhật từ hệ thống
          </p>
        </div>
        {unreadCount > 0 && (
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <button
              onClick={markAllAsRead}
              className="btn btn-secondary inline-flex items-center"
            >
              <Check className="h-4 w-4 mr-2" />
              Đánh dấu tất cả đã đọc
            </button>
          </div>
        )}
      </div>

      {/* Stats */}
      <NotificationStatistics
        totalNotifications={notifications.length}
        unreadCount={unreadCount}
        readCount={notifications.length - unreadCount}
      />

      {/* Notifications List */}
      <NotificationList
        notifications={notifications}
        onMarkAsRead={markAsRead}
      />
    </div>
  )
}
