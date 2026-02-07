'use client'

import { memo } from 'react'
import { Menu, Bell, LogOut } from 'lucide-react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import VolumeControl from './VolumeControl'

interface TopBarProps {
  userName: string
  notifications: number
  onMenuClick: () => void
}

function TopBar({ userName, notifications, onMenuClick }: TopBarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Đăng xuất thành công!')
      router.push('/')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất!')
    }
  }

  return (
    <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <button
        type="button"
        className="px-4 border-r border-gray-200 dark:border-gray-800 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>
      <div className="flex-1 px-6 flex items-center justify-between">
        <div className="flex items-center">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Chào mừng, <span className="text-navy-1 dark:text-navy-3 font-semibold">{userName}</span>!
          </span>
        </div>
        <div className="flex items-center gap-3">
          <VolumeControl 
            storageKey="dashboardMusicEnabled"
            initialVolume={0.3}
          />
          <button
            type="button"
            onClick={() => router.push('/dashboard/notifications')}
            className="relative p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-[8px] transition-all duration-200"
            title="Thông báo"
          >
            <Bell className="h-5 w-5" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {notifications}
              </span>
            )}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-[8px] transition-all duration-200"
            title="Đăng xuất"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(TopBar)

