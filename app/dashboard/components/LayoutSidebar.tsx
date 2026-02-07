'use client'

import { memo } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Users,
  Building,
  Calendar,
  FileText,
  Settings,
  Shield,
  ChevronDown,
  ChevronRight,
  Plus,
  Split,
  Trash2,
  ArrowRightLeft,
  History,
  UserPlus,
  FileDown,
  BarChart3
} from 'lucide-react'

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

interface SidebarProps {
  user: {
    name: string
    role: string
  }
  expandedMenus: Set<string>
  onToggleMenu: (menuName: string) => void
  onClose?: () => void
  isMobile?: boolean
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

const culturalCenterSubMenu: NavigationSubItem[] = [
  { name: 'Thêm lịch mới', href: '/dashboard/bookings', icon: Plus },
  { name: 'Lịch sử giao dịch', href: '/dashboard/cultural-centers/history', icon: FileText },
]

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
  { name: 'Thống kê nhân khẩu', href: '/dashboard/statistics', icon: BarChart3 },
  { name: 'Quản lý tài khoản', href: '/dashboard/accounts', icon: Shield },
  { name: 'Nhà văn hóa', href: '/dashboard/cultural-centers', icon: Building, subItems: culturalCenterSubMenu },
  { name: 'Cài đặt', href: '/dashboard/settings', icon: Settings },
]

const filterMenuByRole = (role: string): NavigationItem[] => {
  if (role === 'ADMIN') {
    const allowedItems = ['Tổng quan', 'Quản lý tài khoản', 'Cài đặt']
    return allMenuItems.filter(item => allowedItems.includes(item.name))
  }

  if (role === 'TEAM_LEADER' || role === 'LEADER') {
    return allMenuItems.filter(item => item.name !== 'Quản lý tài khoản')
  }

  if (role === 'DEPUTY') {
    return allMenuItems.filter(item => item.name !== 'Quản lý tài khoản')
  }

  if (role === 'CALENDAR_MANAGER') {
    const allowedItems = ['Tổng quan', 'Nhà văn hóa', 'Cài đặt']
    return allMenuItems.filter(item => allowedItems.includes(item.name))
  }

  if (role === 'FACILITY_MANAGER') {
    const allowedItems = ['Tổng quan', 'Nhà văn hóa', 'Cài đặt']
    return allMenuItems.filter(item => allowedItems.includes(item.name))
  }

  return [
    { name: 'Tổng quan', href: '/dashboard', icon: Home },
    { name: 'Cài đặt', href: '/dashboard/settings', icon: Settings },
  ]
}

const getRoleLabel = (role: string): string => {
  if (role === 'TEAM_LEADER' || role === 'LEADER') return 'Tổ trưởng'
  if (role === 'ADMIN') return 'Quản trị viên'
  if (role === 'DEPUTY') return 'Tổ phó'
  if (role === 'FACILITY_MANAGER') return 'Quản lý CSVC'
  if (role === 'CALENDAR_MANAGER') return 'Quản lý lịch'
  return 'Người dùng'
}

function Sidebar({ user, expandedMenus, onToggleMenu, onClose, isMobile = false }: SidebarProps) {
  const pathname = usePathname()
  const navigation = filterMenuByRole(user.role)

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard'
    }
    // Exact match only - don't highlight parent when on child route
    return pathname === href
  }
  
  const isParentActive = (href: string) => {
    // Check if any sub-item is active (for parent menu highlighting)
    const navigation = filterMenuByRole(user.role)
    const item = navigation.find(nav => nav.href === href)
    if (item?.subItems) {
      return item.subItems.some(subItem => {
        // Exact match or pathname is a child of subItem
        return pathname === subItem.href || pathname.startsWith(subItem.href + '/')
      })
    }
    return false
  }

  return (
    <div className={`flex flex-col h-full ${isMobile ? 'w-full' : ''}`}>
      {/* Header */}
      <div className="flex-shrink-0 flex items-center px-6 py-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px] shadow-drop">
            <Building className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-gray-900 dark:text-gray-100 leading-tight">Quản lý nhân khẩu</h1>
            <p className="text-xs text-gray-500 dark:text-gray-400">Hệ thống quản lý</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-2">
        {navigation.map((item) => {
          const active = isActive(item.href)
          const parentActive = isParentActive(item.href)
          const hasSubItems = !!item.subItems
          const isExpanded = expandedMenus.has(item.name)

          return (
            <div key={item.name} className="space-y-1">
              {hasSubItems ? (
                <>
                  <div className="flex items-center gap-2">
                    <Link
                      href={item.href}
                      className={`nav-link-enhanced group flex-1 flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-[10px] transition-all duration-200 ${
                        (active || parentActive) ? 'active' : ''
                      }`}
                      onClick={onClose}
                    >
                      <item.icon className="h-5 w-5 flex-shrink-0" />
                      <span className="flex-1">{item.name}</span>
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        onToggleMenu(item.name)
                      }}
                      className="p-2 text-gray-400 dark:text-gray-500 hover:text-navy-1 dark:hover:text-navy-3 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-[8px] transition-all duration-200"
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                  {isExpanded && (
                    <div className="ml-4 pl-4 border-l-2 border-gray-100 dark:border-gray-800 space-y-1 mt-2">
                      {item.subItems!.map((subItem) => (
                        <Link
                          key={subItem.name}
                          href={subItem.href}
                          className={`nav-link-sub group flex items-center gap-3 px-4 py-2.5 text-sm font-medium rounded-[8px] transition-all duration-200 ${
                            isActive(subItem.href) ? 'active' : ''
                          }`}
                          onClick={onClose}
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
                  className={`nav-link-enhanced group flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-[10px] transition-all duration-200 ${
                    active ? 'active' : ''
                  }`}
                  onClick={onClose}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          )
        })}
      </nav>

      {/* User Profile Footer */}
      <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800 p-4">
        <div className="flex items-center gap-3">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-navy-1 to-navy-2 flex items-center justify-center shadow-drop">
              <span className="text-base font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
              {getRoleLabel(user.role)}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Sidebar)

