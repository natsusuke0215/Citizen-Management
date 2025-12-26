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
  FileDown,
  Shield
} from 'lucide-react'
import toast from 'react-hot-toast'
import AudioPlayer from '@/components/AudioPlayer'

interface User {
  id: string
  email: string
  name: string
  role: string
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

  // Define all menu sub-items
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

  // Define ALL menu items (complete list)
  const allMenuItems: NavigationItem[] = [
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
    { name: 'Quản lý tài khoản', href: '/dashboard/accounts', icon: Shield },
    { name: 'Nhà văn hóa', href: '/dashboard/cultural-centers', icon: Building },
    { name: 'Thêm lịch', href: '/dashboard/bookings', icon: Calendar },
    { name: 'Cài đặt', href: '/dashboard/settings', icon: Settings },
  ]

  // Filter function based on role
  const filterMenuByRole = (role: string): NavigationItem[] => {
    // ADMIN: Dashboard, Account Management, Settings only
    if (role === 'ADMIN') {
      const allowedItems = ['Tổng quan', 'Quản lý tài khoản', 'Cài đặt']
      return allMenuItems.filter(item => allowedItems.includes(item.name))
    }

    // TEAM_LEADER (Tổ trưởng): Has access to ALL modules EXCEPT Account Management
    if (role === 'TEAM_LEADER' || role === 'LEADER') {
      return allMenuItems.filter(item => item.name !== 'Quản lý tài khoản')
    }

    // DEPUTY (Tổ phó): Has access to everything EXCEPT 'Account Mgmt'
    if (role === 'DEPUTY') {
      return allMenuItems.filter(item => item.name !== 'Quản lý tài khoản')
    }

    // CALENDAR_MANAGER: Dashboard, Calendar Management (Thêm lịch), Settings
    // Should NOT see "Nhà văn hóa" (Cultural Centers)
    if (role === 'CALENDAR_MANAGER') {
      const allowedItems = ['Tổng quan', 'Thêm lịch', 'Cài đặt']
      return allMenuItems.filter(item => allowedItems.includes(item.name))
    }

    // FACILITY_MANAGER: Dashboard, Cultural Centers (Nhà văn hóa), Settings
    // Should NOT see "Thêm lịch" (Bookings/Calendar)
    if (role === 'FACILITY_MANAGER') {
      const allowedItems = ['Tổng quan', 'Nhà văn hóa', 'Cài đặt']
      return allMenuItems.filter(item => allowedItems.includes(item.name))
    }

    // Fallback: Return basic menu for unknown roles
    return [
      { name: 'Tổng quan', href: '/dashboard', icon: Home },
      { name: 'Cài đặt', href: '/dashboard/settings', icon: Settings },
    ]
  }

  const getNavigation = (role: string): NavigationItem[] => {
    return filterMenuByRole(role)
  }

  const navigation: NavigationItem[] = user ? getNavigation(user.role) : []

  if (!user) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-2 via-white to-yellow-2 lg:flex">
      {/* Mobile sidebar */}
      <div className={`fixed inset-0 z-50 lg:hidden transition-opacity duration-300 ${sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <div 
          className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm" 
          onClick={() => setSidebarOpen(false)} 
        />
        <div className={`relative flex-1 flex flex-col w-80 max-w-[85vw] bg-white h-full transform transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          {/* Mobile Header */}
          <div className="flex-shrink-0 flex items-center justify-between px-6 py-5 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px] shadow-drop">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Quản lý nhân khẩu</h1>
                <p className="text-xs text-gray-500">Hệ thống quản lý</p>
              </div>
            </div>
            <button
              type="button"
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-[8px] transition-colors"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>
          </div>
          
          {/* Mobile Navigation */}
          <div className="flex-1 overflow-y-auto px-4 py-6">
            <nav className="space-y-2">
              {navigation.map((item) => (
                <div key={item.name} className="space-y-1">
                  {item.subItems ? (
                    <>
                      <div className="flex items-center gap-2">
                        <Link
                          href={item.href}
                          className="nav-link group flex-1 flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-[10px] transition-all duration-200"
                          onClick={() => setSidebarOpen(false)}
                        >
                          <item.icon className="h-5 w-5 flex-shrink-0" />
                          <span className="flex-1">{item.name}</span>
                        </Link>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            toggleMenu(item.name)
                          }}
                          className="p-2 text-gray-400 hover:text-navy-1 hover:bg-gray-50 rounded-[8px] transition-all duration-200"
                        >
                          {expandedMenus.has(item.name) ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                      {expandedMenus.has(item.name) && (
                        <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-2">
                          {item.subItems.map((subItem) => (
                            <Link
                              key={subItem.name}
                              href={subItem.href}
                              className="nav-link-sub group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-[8px] transition-all duration-200"
                              onClick={() => setSidebarOpen(false)}
                            >
                              <subItem.icon className="h-4 w-4 flex-shrink-0" />
                              <span>{subItem.name}</span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      className="nav-link group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-[10px] transition-all duration-200"
                      onClick={() => setSidebarOpen(false)}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span>{item.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </div>
          
          {/* Mobile User Profile Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-navy-1 to-navy-2 flex items-center justify-center shadow-drop">
                  <span className="text-base font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {(user.role === 'TEAM_LEADER' || user.role === 'LEADER') ? 'Tổ trưởng' : 
                   user.role === 'ADMIN' ? 'Quản trị viên' :
                   user.role === 'DEPUTY' ? 'Tổ phó' : 
                   user.role === 'FACILITY_MANAGER' ? 'Quản lý CSVC' :
                   user.role === 'CALENDAR_MANAGER' ? 'Quản lý lịch' : 'Người dùng'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
        <div className="flex flex-col flex-grow w-72 bg-white border-r border-gray-200 sidebar h-full">
          {/* Sidebar Header */}
          <div className="flex-shrink-0 flex items-center px-6 py-6 border-b border-gray-200">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px] shadow-drop">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-tight">Quản lý nhân khẩu</h1>
                <p className="text-xs text-gray-500">Hệ thống quản lý</p>
              </div>
            </div>
          </div>
          
          {/* Navigation Menu */}
          <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
            {navigation.map((item) => (
              <div key={item.name} className="space-y-1">
                {item.subItems ? (
                  <>
                    <div className="flex items-center gap-2">
                      <Link
                        href={item.href}
                        className="nav-link-enhanced group flex-1 flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-[10px] transition-all duration-200"
                      >
                        <item.icon className="h-5 w-5 flex-shrink-0" />
                        <span className="flex-1">{item.name}</span>
                      </Link>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          toggleMenu(item.name)
                        }}
                        className="p-2 text-gray-400 hover:text-navy-1 hover:bg-gray-50 rounded-[8px] transition-all duration-200"
                      >
                        {expandedMenus.has(item.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                    {expandedMenus.has(item.name) && (
                      <div className="ml-4 pl-4 border-l-2 border-gray-100 space-y-1 mt-2">
                        {item.subItems.map((subItem) => (
                          <Link
                            key={subItem.name}
                            href={subItem.href}
                            className="nav-link-sub group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-[8px] transition-all duration-200"
                          >
                            <subItem.icon className="h-4 w-4 flex-shrink-0" />
                            <span>{subItem.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="nav-link-enhanced group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-[10px] transition-all duration-200"
                  >
                    <item.icon className="h-5 w-5 flex-shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </nav>
          
          {/* User Profile Footer */}
          <div className="flex-shrink-0 border-t border-gray-200 bg-gray-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-navy-1 to-navy-2 flex items-center justify-center shadow-drop">
                  <span className="text-base font-semibold text-white">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
                <p className="text-xs text-gray-500 truncate">
                  {(user.role === 'TEAM_LEADER' || user.role === 'LEADER') ? 'Tổ trưởng' : 
                   user.role === 'ADMIN' ? 'Quản trị viên' :
                   user.role === 'DEPUTY' ? 'Tổ phó' : 
                   user.role === 'FACILITY_MANAGER' ? 'Quản lý CSVC' :
                   user.role === 'CALENDAR_MANAGER' ? 'Quản lý lịch' : 'Người dùng'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-col flex-1 min-h-screen lg:pl-72">
        {/* Top bar */}
        <div className="sticky top-0 z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 shadow-sm">
          <button
            type="button"
            className="px-4 border-r border-gray-200 text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 px-6 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700">
                Chào mừng, <span className="text-navy-1 font-semibold">{user.name}</span>!
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="relative p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-[8px] transition-all duration-200"
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
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-[8px] transition-all duration-200"
                title="Đăng xuất"
              >
                <LogOut className="h-5 w-5" />
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
