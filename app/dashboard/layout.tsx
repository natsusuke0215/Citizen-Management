'use client'

import { useState, useCallback, useEffect } from 'react'
import { X } from 'lucide-react'
import AudioPlayer from '@/components/AudioPlayer'
import Sidebar from './components/LayoutSidebar'
import TopBar from './components/LayoutTopBar'
import { useUser } from './components/useLayoutUser'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, loading } = useUser()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const [notifications, setNotifications] = useState(0)

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await fetch('/api/notifications')
        if (response.ok) {
          const data = await response.json()
          const unreadCount = data.filter((n: { read: boolean }) => !n.read).length
          setNotifications(unreadCount)
        }
      } catch (error) {
        console.error('Error fetching notifications:', error)
      }
    }

    if (user) {
      fetchNotifications()
      // Refresh notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user])

  const toggleMenu = useCallback((menuName: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(menuName)) {
        newSet.delete(menuName)
      } else {
        newSet.add(menuName)
      }
      return newSet
    })
  }, [])

  if (loading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-2 via-white to-yellow-2 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 lg:flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div
          className="fixed inset-0 bg-gray-900 dark:bg-black bg-opacity-50 dark:bg-opacity-70 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
        <div className={`relative flex-1 flex flex-col w-80 max-w-[85vw] bg-white dark:bg-gray-900 h-full transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px] shadow-drop">
                <X className="h-6 w-6 text-white" />
              </div>
            </div>
            <button
              type="button"
              className="p-2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-[8px] transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          <Sidebar
            user={user}
            expandedMenus={expandedMenus}
            onToggleMenu={toggleMenu}
            onClose={() => setSidebarOpen(false)}
            isMobile={true}
          />
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 sidebar h-full">
          <Sidebar
            user={user}
            expandedMenus={expandedMenus}
            onToggleMenu={toggleMenu}
          />
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen lg:pl-72">
        <TopBar
          userName={user.name}
          notifications={notifications}
          onMenuClick={() => setSidebarOpen(true)}
        />

        <main className="flex-1 bg-gradient-to-br from-yellow-2 via-white to-yellow-2 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 min-h-screen">
          <div className="px-4 sm:px-6 md:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Dashboard Background Music Player - UI hidden, controlled by TopBar */}
      <AudioPlayer
        src="/assets/audio/background-dashboard.mp3"
        storageKey="dashboardMusicEnabled"
        loop={true}
        volume={0.3}
        hideUI={true}
      />
    </div>
  )
}
