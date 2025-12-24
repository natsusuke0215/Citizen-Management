'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Home, 
  Users, 
  Building, 
  Calendar, 
  FileText, 
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  ChevronDown,
  ChevronRight,
  Plus,
  Split,
  Trash2,
  ArrowRightLeft,
  History,
  UserPlus,
  FileDown
} from 'lucide-react'
import toast from 'react-hot-toast'
import AudioPlayer from '@/components/AudioPlayer'

interface User {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
}

interface NavigationSubItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

interface NavigationItem {
  name: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  subItems?: NavigationSubItem[]
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [user, setUser] = useState<User | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [notifications, setNotifications] = useState(0)
  const [expandedMenus, setExpandedMenus] = useState<Set<string>>(new Set())
  const router = useRouter()

  useEffect(() => {
    // Get user info from API
    const fetchUser = async () => {
      try {
        console.log('Fetching user info...')
        const response = await fetch('/api/auth/me', {
          credentials: 'include'
        })
        
        if (response.ok) {
          const userData = await response.json()
          console.log('User data received:', userData)
          setUser(userData)
        } else {
          console.log('Failed to get user info, redirecting to login')
          router.push('/login')
        }
      } catch (error) {
        console.log('Error fetching user info:', error)
        router.push('/login')
      }
    }

    fetchUser()
  }, [router])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      toast.success('Đăng xuất thành công!')
      router.push('/')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng xuất!')
    }
  }

  const toggleMenu = (menuName: string) => {
    setExpandedMenus(prev => {
      const newSet = new Set(prev)
      if (newSet.has(menuName)) {
        newSet.delete(menuName)
      } else {
        newSet.add(menuName)
      }
      return newSet
    })
  }

  const householdSubMenu: NavigationSubItem[] = [
    { name: 'Thêm hộ khẩu', href: '/dashboard/households/add', icon: Plus },
    { name: 'Đăng ký thường trú', href: '/dashboard/households/register-permanent', icon: UserPlus },
    { name: 'Tách hộ khẩu', href: '/dashboard/households/split', icon: Split },
    { name: 'Xóa hộ khẩu', href: '/dashboard/households/delete', icon: Trash2 },
    { name: 'Chuyển hộ khẩu', href: '/dashboard/households/transfer', icon: ArrowRightLeft },
    { name: 'Lịch sử thay đổi', href: '/dashboard/households/history', icon: History },
  ]

  const personSubMenu: NavigationSubItem[] = [
    { name: 'Danh sách nhân khẩu', href: '/dashboard/persons', icon: Users },
    { name: 'Cấp giấy tạm trú', href: '/dashboard/persons/temporary-residence', icon: FileDown },
    { name: 'Cấp giấy tạm vắng', href: '/dashboard/persons/temporary-absence', icon: FileDown },
  ]

  const navigation: NavigationItem[] = user?.role === 'ADMIN' ? [
    { name: 'Tổng quan', href: '/dashboard', icon: Home },
    { 
      name: 'Quản lý hộ khẩu', 
      href: '/dashboard/households', 
      icon: Users,
      subItems: householdSubMenu
    },
    { 
      name: 'Quản lý nhân khẩu',
      href: '/dashboard/persons',
      icon: Users,
      subItems: personSubMenu
    },
    { name: 'Nhà văn hóa', href: '/dashboard/cultural-centers', icon: Building },
    // Chỉ admin mới có thể thêm lịch
    { name: 'Thêm lịch', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Cài đặt', href: '/dashboard/settings', icon: Settings },
  ] : [
    { name: 'Tổng quan', href: '/dashboard', icon: Home },
    { name: 'Hộ khẩu của tôi', href: '/dashboard/my-household', icon: Users },
    { name: 'Nhà văn hóa', href: '/dashboard/cultural-centers', icon: Building },
    { name: 'Cài đặt', href: '/dashboard/settings', icon: Settings },
  ]

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-2 via-white to-yellow-2 lg:flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)} />
        <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
          <div className="absolute top-0 right-0 -mr-12 pt-2">
            <button
              type="button"
              className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6 text-white" />
            </button>
          </div>
          <div className="flex-1 h-0 pt-5 pb-4 overflow-y-auto">
            <div className="flex-shrink-0 flex items-center px-4">
              <Building className="h-8 w-8 text-navy-1" />
              <span className="ml-2 text-xl font-bold text-gray-900">Quản lý nhân khẩu</span>
            </div>
            <nav className="mt-5 px-2 space-y-1">
              {navigation.map((item) => (
                <div key={item.name}>
                  {item.subItems ? (
                    <>
                      <div className="flex items-center">
                        <Link
                          href={item.href}
                          className="nav-link group flex-1 flex items-center px-2 py-2 text-base font-medium rounded-md"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon className="mr-4 h-6 w-6" />
                          {item.name}
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleMenu(item.name)
                          }}
                          className="px-2 py-2 text-gray-400 hover:text-gray-600"
                        >
                          {expandedMenus.has(item.name) ? (
                            <ChevronDown className="h-5 w-5" />
                          ) : (
                            <ChevronRight className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                      {expandedMenus.has(item.name) && (
                        <div className="ml-4 mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="nav-link group flex items-center px-2 py-2 text-sm font-medium rounded-md"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <subItem.icon className="mr-3 h-5 w-5" />
                              {subItem.name}
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="nav-link group flex items-center px-2 py-2 text-base font-medium rounded-md"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="mr-4 h-6 w-6" />
                      {item.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
        </div>
      </div>

      {/* Desktop sidebar - Scrolls with page content */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64 sidebar sticky top-0 self-start">
          {/* Sidebar Header */}
          <div className="flex-shrink-0 flex items-center px-4 py-5 border-b border-gray-200 bg-white">
            <Building className="h-8 w-8 text-navy-1" />
            <span className="ml-2 text-xl font-bold text-gray-900">Quản lý nhân khẩu</span>
          </div>
          
          {/* Navigation Menu */}
          <nav className="px-3 py-4 space-y-1">
            {navigation.map((item) => (
              <div key={item.name}>
                {item.subItems ? (
                  <>
                    <div className="flex items-center">
                      <Link
                        href={item.href}
                        className="nav-link-enhanced group flex-1 flex items-center px-3 py-2.5 text-sm font-medium rounded-[8px]"
                      >
                        <item.icon className="mr-3 h-5 w-5" />
                        {item.name}
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMenu(item.name)
                        }}
                        className="px-2 py-2 text-gray-400 hover:text-navy-1 transition-colors"
                      >
                        {expandedMenus.has(item.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {expandedMenus.has(item.name) && (
                      <div className="ml-6 mt-1 space-y-0.5">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="nav-link-sub group flex items-center px-3 py-2 text-sm font-medium rounded-[8px]"
                          >
                            <subItem.icon className="mr-3 h-4 w-4" />
                            {subItem.name}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="nav-link-enhanced group flex items-center px-3 py-2.5 text-sm font-medium rounded-[8px]"
                  >
                    <item.icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          
          {/* User Profile Footer */}
          <div className="flex-shrink-0 flex border-t border-gray-200 p-4 bg-white">
            <div className="flex items-center w-full">
              <div className="flex-shrink-0">
                <div className="h-10 w-10 rounded-full bg-navy-1 flex items-center justify-center shadow-drop">
                  <span className="text-sm font-medium text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3 flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500">{user.role === 'ADMIN' ? 'Quản trị viên' : 'Người dùng'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white shadow-drop">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-4 flex justify-between">
            <div className="flex-1 flex">
              <div className="w-full flex md:ml-0">
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                  <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <span className="text-sm text-gray-500">Chào mừng, {user.name}!</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="ml-4 flex items-center md:ml-6">
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <Bell className="h-6 w-6" />
                {notifications > 0 && (
                  <span className="absolute -mt-1 -mr-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <button
                onClick={handleLogout}
                className="ml-3 bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                <LogOut className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 bg-gradient-to-br from-yellow-2 via-white to-yellow-2 min-h-screen">
          <div className="px-4 sm:px-6 md:px-8 py-6">
            {children}
          </div>
        </main>
      </div>

      {/* Dashboard Background Music Player */}
      <AudioPlayer 
        src="/assets/audio/background-dashboard.mp3"
        storageKey="dashboardMusicEnabled"
        loop={true}
        volume={0.3}
      />
    </div>
  )
}
