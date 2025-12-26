'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useTheme } from 'next-themes'
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  Download,
  Eye,
  EyeOff,
  Save,
  Camera,
  Mail,
  Phone,
  MapPin,
  Key,
  History,
  Trash2,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  FileText,
  Database,
  RefreshCw,
  X
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UserData {
  id: string
  email: string
  name: string
  role: string
  phone?: string
  address?: string
  isEmailNotificationEnabled?: boolean
  isPushNotificationEnabled?: boolean
  isPublicProfile?: boolean
  theme?: string
}

export default function SettingsPage() {
  const router = useRouter()
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('profile')
  const [saving, setSaving] = useState(false)
  
  // Profile state
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  })
  
  // Password state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })
  
  // Notification settings
  const [notifications, setNotifications] = useState({
    email: true,
    push: true
  })
  
  // Privacy settings
  const [isPublicProfile, setIsPublicProfile] = useState(false)
  
  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchUserData()
  }, [])

  // Sync theme from user data when it loads
  useEffect(() => {
    if (user?.theme && mounted) {
      setTheme(user.theme as 'light' | 'dark' | 'system')
    }
  }, [user?.theme, mounted, setTheme])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/users/me', {
        credentials: 'include'
      })
      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
        setProfileData({
          name: userData.name || '',
          email: userData.email || '',
          phone: userData.phone || '',
          address: userData.address || ''
        })
        setNotifications({
          email: userData.isEmailNotificationEnabled ?? true,
          push: userData.isPushNotificationEnabled ?? true
        })
        setIsPublicProfile(userData.isPublicProfile ?? false)
        // Theme will be synced via useEffect when mounted
      } else {
        const error = await response.json().catch(() => ({ message: 'Không thể tải thông tin người dùng' }))
        toast.error(error.message || 'Không thể tải thông tin người dùng')
      }
    } catch (error) {
      console.error('Fetch user data error:', error)
      toast.error('Không thể tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    // Validate required fields
    if (!profileData.name || profileData.name.trim() === '') {
      toast.error('Vui lòng nhập họ và tên')
      return
    }

    if (!profileData.email || profileData.email.trim() === '') {
      toast.error('Vui lòng nhập email')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      toast.error('Email không hợp lệ')
      return
    }

    setSaving(true)
    try {
      const response = await fetch('/api/users/me', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          name: profileData.name.trim(),
          email: profileData.email.trim(),
          phone: profileData.phone || '',
          address: profileData.address || ''
        })
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        // Update profileData with the response
        setProfileData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        })
        
        // Dispatch custom event to notify other components (like Sidebar/Header) to refresh user data
        window.dispatchEvent(new CustomEvent('userProfileUpdated', { 
          detail: { user: data.user } 
        }))
        
        toast.success('Đã cập nhật thông tin cá nhân!')
      } else {
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra khi cập nhật')
      }
    } catch (error) {
      console.error('Save profile error:', error)
      toast.error('Có lỗi xảy ra khi cập nhật')
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới không khớp!')
      return
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Mật khẩu phải có ít nhất 8 ký tự!')
      return
    }
    
    setSaving(true)
    try {
      const response = await fetch('/api/users/me/password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      if (response.ok) {
        toast.success('Đã đổi mật khẩu thành công!')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra khi đổi mật khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đổi mật khẩu')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationToggle = async (key: 'email' | 'push', value: boolean) => {
    const newNotifications = { ...notifications, [key]: value }
    setNotifications(newNotifications)

    try {
      const response = await fetch('/api/users/me/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          isEmailNotificationEnabled: newNotifications.email,
          isPushNotificationEnabled: newNotifications.push
        })
      })

      if (response.ok) {
        toast.success('Đã cập nhật cài đặt thông báo')
      } else {
        // Revert on error
        setNotifications(notifications)
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      // Revert on error
      setNotifications(notifications)
      toast.error('Có lỗi xảy ra')
    }
  }

  const handlePrivacyToggle = async (value: boolean) => {
    setIsPublicProfile(value)

    try {
      const response = await fetch('/api/users/me/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          isPublicProfile: value
        })
      })

      if (response.ok) {
        toast.success('Đã cập nhật cài đặt quyền riêng tư')
      } else {
        // Revert on error
        setIsPublicProfile(!value)
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      // Revert on error
      setIsPublicProfile(!value)
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleThemeChange = async (newTheme: 'light' | 'dark' | 'system') => {
    const previousTheme = theme
    setTheme(newTheme)

    try {
      const response = await fetch('/api/users/me/settings', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          theme: newTheme
        })
      })

      if (!response.ok) {
        // Revert on error
        setTheme(previousTheme || 'system')
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra')
      } else {
        // Update user state to reflect the change
        if (user) {
          setUser({ ...user, theme: newTheme })
        }
      }
    } catch (error) {
      // Revert on error
      setTheme(previousTheme || 'system')
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleExportData = async (format: 'json' | 'csv') => {
    try {
      toast.loading('Đang xuất dữ liệu...')
      const response = await fetch(`/api/users/me/export?format=${format}`, {
        credentials: 'include'
      })

      if (response.ok) {
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `user-data-${user?.id}.${format}`
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
        toast.dismiss()
        toast.success('Đã xuất dữ liệu thành công!')
      } else {
        toast.dismiss()
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra khi xuất dữ liệu')
      }
    } catch (error) {
      toast.dismiss()
      toast.error('Có lỗi xảy ra khi xuất dữ liệu')
    }
  }

  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      toast.error('Vui lòng nhập mật khẩu để xác nhận')
      return
    }

    setDeleting(true)
    try {
      const response = await fetch('/api/users/me', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ password: deletePassword })
      })

      if (response.ok) {
        toast.success('Đã xóa tài khoản thành công')
        setTimeout(() => {
          router.push('/login')
        }, 1000)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra khi xóa tài khoản')
        setDeleting(false)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa tài khoản')
      setDeleting(false)
    }
  }

  const tabs = [
    { id: 'profile', name: 'Hồ sơ', icon: User },
    { id: 'security', name: 'Bảo mật', icon: Lock },
    { id: 'notifications', name: 'Thông báo', icon: Bell },
    { id: 'privacy', name: 'Quyền riêng tư', icon: Shield },
    { id: 'appearance', name: 'Giao diện', icon: Palette },
    { id: 'data', name: 'Dữ liệu', icon: Database }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="h-8 w-8 text-navy-1" />
            Cài đặt
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý tài khoản, bảo mật và tùy chỉnh trải nghiệm của bạn
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-[15px] shadow-drop p-4 space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-navy-1 to-navy-2 text-white shadow-drop'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[15px] shadow-drop p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                      <User className="h-6 w-6 text-navy-1" />
                      Thông tin cá nhân
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                      Cập nhật thông tin cá nhân và ảnh đại diện
                    </p>
                  </div>
                </div>

                {/* Avatar Section */}
                <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
                  <div className="relative">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-navy-1 to-navy-2 flex items-center justify-center text-white text-2xl font-bold">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <button className="absolute bottom-0 right-0 p-2 bg-navy-1 text-white rounded-full hover:bg-navy-2 transition-colors shadow-drop hover:shadow-drop-lg">
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user?.name || 'Người dùng'}</h3>
                    <p className="text-sm text-gray-500">{user?.email}</p>
                    <button className="mt-2 text-sm text-navy-1 hover:text-navy-2 font-medium">
                      Thay đổi ảnh đại diện
                    </button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Họ và tên *
                    </label>
                    <input
                      type="text"
                      className="input w-full"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Nhập họ và tên"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        className="input w-full pl-10"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                        placeholder="email@example.com"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Số điện thoại
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="tel"
                        className="input w-full pl-10"
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        placeholder="0123456789"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Địa chỉ
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="text"
                        className="input w-full pl-10"
                        value={profileData.address}
                        onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                        placeholder="Nhập địa chỉ"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveProfile}
                    disabled={saving}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Đang lưu...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4" />
                        Lưu thay đổi
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              {/* Change Password */}
              <div className="bg-white rounded-[15px] shadow-drop p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Key className="h-6 w-6 text-navy-1" />
                    Đổi mật khẩu
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Cập nhật mật khẩu để bảo vệ tài khoản của bạn
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu hiện tại
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.current ? 'text' : 'password'}
                        className="input w-full pr-10"
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        placeholder="••••••••"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.current ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? 'text' : 'password'}
                        className="input w-full pr-10"
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        placeholder="Tối thiểu 8 ký tự"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.new ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordData.newPassword && (
                      <div className="mt-2">
                        <div className="flex items-center gap-2 text-xs">
                          <div className={`h-1 flex-1 rounded-full ${passwordData.newPassword.length >= 8 ? 'bg-green-500' : 'bg-gray-200'}`}></div>
                          <span className={passwordData.newPassword.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                            {passwordData.newPassword.length >= 8 ? 'Mạnh' : 'Yếu'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Xác nhận mật khẩu mới
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? 'text' : 'password'}
                        className="input w-full pr-10"
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        placeholder="Nhập lại mật khẩu mới"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showPasswords.confirm ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                      </button>
                    </div>
                    {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                      <p className="mt-1 text-xs text-red-500">Mật khẩu không khớp</p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleChangePassword}
                    disabled={saving || !passwordData.currentPassword || !passwordData.newPassword || passwordData.newPassword !== passwordData.confirmPassword}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Đang cập nhật...
                      </>
                    ) : (
                      <>
                        <Lock className="h-4 w-4" />
                        Cập nhật mật khẩu
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Login History */}
              <div className="bg-white rounded-[15px] shadow-drop p-6">
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <History className="h-5 w-5 text-navy-1" />
                    Lịch sử đăng nhập
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Xem các hoạt động đăng nhập gần đây
                  </p>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-[8px]">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-navy-1/10 rounded-[6px]">
                        <Monitor className="h-4 w-4 text-navy-1" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">Windows • Chrome</p>
                        <p className="text-xs text-gray-500">192.168.1.1 • Hà Nội, Việt Nam</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Hôm nay, 14:30</p>
                      <span className="inline-flex items-center gap-1 text-xs text-green-600 mt-1">
                        <span className="h-2 w-2 bg-green-500 rounded-full"></span>
                        Hoạt động
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
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
                        onChange={(e) => handleNotificationToggle('email', e.target.checked)}
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
                        onChange={(e) => handleNotificationToggle('push', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-1"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
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
                        onChange={(e) => handlePrivacyToggle(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-1"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-[15px] shadow-drop p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                    <Palette className="h-6 w-6 text-navy-1" />
                    Giao diện
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    Tùy chỉnh giao diện và trải nghiệm của bạn
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Chủ đề
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Sáng', icon: Sun },
                        { value: 'dark', label: 'Tối', icon: Moon },
                        { value: 'system', label: 'Tự động', icon: Monitor }
                      ].map((option) => {
                        const Icon = option.icon
                        const isActive = mounted && theme === option.value
                        return (
                          <button
                            key={option.value}
                            onClick={() => handleThemeChange(option.value as 'light' | 'dark' | 'system')}
                            className={`p-4 rounded-[10px] border-2 transition-all ${
                              isActive
                                ? 'border-navy-1 bg-navy-1/10 dark:bg-navy-1/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                            <Icon className={`h-6 w-6 mx-auto mb-2 ${isActive ? 'text-navy-1' : 'text-gray-400 dark:text-gray-500'}`} />
                            <p className={`text-sm font-medium ${isActive ? 'text-navy-1 dark:text-navy-3' : 'text-gray-700 dark:text-gray-300'}`}>
                              {option.label}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Data Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div className="bg-white rounded-[15px] shadow-drop p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Database className="h-6 w-6 text-navy-1" />
                    Quản lý dữ liệu
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Xuất, nhập và quản lý dữ liệu của bạn
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-gradient-to-br from-navy-1/10 to-navy-2/10 rounded-[12px] border border-navy-1/20">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-navy-1 rounded-[8px]">
                        <Download className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Xuất dữ liệu</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Tải xuống tất cả dữ liệu của bạn dưới dạng file JSON hoặc CSV
                        </p>
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => handleExportData('json')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-navy-1 text-white rounded-[8px] text-sm font-medium hover:bg-navy-2 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            Xuất JSON
                          </button>
                          <button
                            onClick={() => handleExportData('csv')}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-[8px] text-sm font-medium hover:bg-gray-50 transition-colors"
                          >
                            <FileText className="h-4 w-4" />
                            Xuất CSV
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-amber-50 rounded-[12px] border border-amber-200">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-amber-500 rounded-[8px]">
                        <AlertTriangle className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">Xóa tài khoản</h3>
                        <p className="text-sm text-gray-600 mb-4">
                          Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
                        </p>
                        <button
                          onClick={() => setShowDeleteModal(true)}
                          className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-[8px] text-sm font-medium hover:bg-red-600 transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                          Xóa tài khoản
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-[15px] shadow-drop-lg max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                Xác nhận xóa tài khoản
              </h3>
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Hành động này không thể hoàn tác. Vui lòng nhập mật khẩu để xác nhận xóa tài khoản.
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mật khẩu
              </label>
              <input
                type="password"
                className="input w-full"
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                autoFocus
              />
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeletePassword('')
                }}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-[8px] hover:bg-gray-200 transition-colors"
                disabled={deleting}
              >
                Hủy
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={deleting || !deletePassword}
                className="px-4 py-2 bg-red-500 text-white rounded-[8px] hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2"
              >
                {deleting ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" />
                    Đang xóa...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4" />
                    Xóa tài khoản
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
