'use client'

import { useState, useEffect } from 'react'
import { 
  Settings, 
  User, 
  Lock, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Download, 
  Upload,
  Eye,
  EyeOff,
  Save,
  Check,
  X,
  Camera,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Key,
  History,
  Trash2,
  AlertTriangle,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Clock,
  FileText,
  Database,
  RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

interface UserData {
  id: string
  email: string
  name: string
  role: 'ADMIN' | 'USER'
  phone?: string
  address?: string
  avatar?: string
}

export default function SettingsPage() {
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
    push: true,
    sms: false,
    requests: true,
    bookings: true,
    system: true,
    marketing: false
  })
  
  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: true,
    showPhone: false,
    dataSharing: false,
    analytics: true
  })
  
  // Theme settings
  const [theme, setTheme] = useState<'light' | 'dark' | 'auto'>('auto')
  
  // Language settings
  const [language, setLanguage] = useState('vi')
  
  // Audio settings
  const [audio, setAudio] = useState({
    enabled: true,
    volume: 50,
    backgroundMusic: true
  })

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me', {
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
      }
    } catch (error) {
      toast.error('Không thể tải thông tin người dùng')
    } finally {
      setLoading(false)
    }
  }

  const handleSaveProfile = async () => {
    setSaving(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Đã cập nhật thông tin cá nhân!')
    } catch (error) {
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
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast.success('Đã đổi mật khẩu thành công!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đổi mật khẩu')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveNotifications = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 800))
      toast.success('Đã lưu cài đặt thông báo!')
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    } finally {
      setSaving(false)
    }
  }

  const handleExportData = async () => {
    try {
      toast.success('Đang xuất dữ liệu...')
      // Simulate export
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast.success('Đã xuất dữ liệu thành công!')
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xuất dữ liệu')
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

              {/* Two-Factor Authentication */}
              <div className="bg-white rounded-[15px] shadow-drop p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <Shield className="h-5 w-5 text-navy-1" />
                      Xác thực hai yếu tố (2FA)
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      Thêm lớp bảo mật bổ sung cho tài khoản của bạn
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-1"></div>
                  </label>
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
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 bg-gray-50 rounded-[8px]">
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
                          <Check className="h-3 w-3" />
                          Hoạt động
                        </span>
                      </div>
                    </div>
                  ))}
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
                  {[
                    { key: 'email', label: 'Email', desc: 'Nhận thông báo qua email', icon: Mail },
                    { key: 'push', label: 'Thông báo đẩy', desc: 'Thông báo trên trình duyệt', icon: Bell },
                    { key: 'sms', label: 'SMS', desc: 'Nhận thông báo qua tin nhắn', icon: Phone },
                    { key: 'requests', label: 'Yêu cầu mới', desc: 'Thông báo khi có yêu cầu mới', icon: FileText },
                    { key: 'bookings', label: 'Đặt lịch', desc: 'Thông báo về đặt lịch và lịch hẹn', icon: Calendar },
                    { key: 'system', label: 'Hệ thống', desc: 'Thông báo từ hệ thống', icon: Settings },
                    { key: 'marketing', label: 'Marketing', desc: 'Nhận tin tức và cập nhật', icon: Mail }
                  ].map((item) => {
                    const Icon = item.icon
                    return (
                      <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-[10px] hover:bg-gray-100 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-navy-1/10 rounded-[6px]">
                            <Icon className="h-4 w-4 text-navy-1" />
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{item.label}</p>
                            <p className="text-xs text-gray-500">{item.desc}</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={notifications[item.key as keyof typeof notifications]}
                            onChange={(e) => setNotifications({ ...notifications, [item.key]: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-1"></div>
                        </label>
                      </div>
                    )
                  })}
                </div>

                <div className="flex justify-end mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleSaveNotifications}
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
                        Lưu cài đặt
                      </>
                    )}
                  </button>
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
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Hiển thị hồ sơ
                    </label>
                    <select
                      className="input w-full"
                      value={privacy.profileVisibility}
                      onChange={(e) => setPrivacy({ ...privacy, profileVisibility: e.target.value })}
                    >
                      <option value="public">Công khai</option>
                      <option value="friends">Chỉ bạn bè</option>
                      <option value="private">Riêng tư</option>
                    </select>
                  </div>

                  {[
                    { key: 'showEmail', label: 'Hiển thị email', desc: 'Cho phép người khác xem email của bạn' },
                    { key: 'showPhone', label: 'Hiển thị số điện thoại', desc: 'Cho phép người khác xem số điện thoại' },
                    { key: 'dataSharing', label: 'Chia sẻ dữ liệu', desc: 'Cho phép chia sẻ dữ liệu với đối tác' },
                    { key: 'analytics', label: 'Phân tích sử dụng', desc: 'Giúp cải thiện dịch vụ bằng cách thu thập dữ liệu sử dụng' }
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-gray-50 rounded-[10px]">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={privacy[item.key as keyof typeof privacy] as boolean}
                          onChange={(e) => setPrivacy({ ...privacy, [item.key]: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-1"></div>
                      </label>
                    </div>
                  ))}
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
                        Lưu cài đặt
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Appearance Tab */}
          {activeTab === 'appearance' && (
            <div className="space-y-6">
              {/* Theme */}
              <div className="bg-white rounded-[15px] shadow-drop p-6">
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Palette className="h-6 w-6 text-navy-1" />
                    Giao diện
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Tùy chỉnh giao diện và trải nghiệm của bạn
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Chủ đề
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { value: 'light', label: 'Sáng', icon: Sun },
                        { value: 'dark', label: 'Tối', icon: Moon },
                        { value: 'auto', label: 'Tự động', icon: Monitor }
                      ].map((option) => {
                        const Icon = option.icon
                        return (
                          <button
                            key={option.value}
                            onClick={() => setTheme(option.value as typeof theme)}
                            className={`p-4 rounded-[10px] border-2 transition-all ${
                              theme === option.value
                                ? 'border-navy-1 bg-navy-1/10'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            <Icon className={`h-6 w-6 mx-auto mb-2 ${theme === option.value ? 'text-navy-1' : 'text-gray-400'}`} />
                            <p className={`text-sm font-medium ${theme === option.value ? 'text-navy-1' : 'text-gray-700'}`}>
                              {option.label}
                            </p>
                          </button>
                        )
                      })}
                    </div>
                  </div>

                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Ngôn ngữ
                    </label>
                    <select
                      className="input w-full"
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </select>
                  </div>

                  {/* Audio Settings */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Âm thanh
                    </label>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[10px]">
                        <div className="flex items-center gap-3">
                          {audio.enabled ? (
                            <Volume2 className="h-5 w-5 text-navy-1" />
                          ) : (
                            <VolumeX className="h-5 w-5 text-gray-400" />
                          )}
                          <div>
                            <p className="text-sm font-medium text-gray-900">Bật âm thanh</p>
                            <p className="text-xs text-gray-500">Cho phép phát âm thanh trong ứng dụng</p>
                          </div>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input
                            type="checkbox"
                            checked={audio.enabled}
                            onChange={(e) => setAudio({ ...audio, enabled: e.target.checked })}
                            className="sr-only peer"
                          />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-navy-1/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-navy-1"></div>
                        </label>
                      </div>
                      {audio.enabled && (
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-700">Âm lượng</label>
                            <span className="text-sm text-gray-500">{audio.volume}%</span>
                          </div>
                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={audio.volume}
                            onChange={(e) => setAudio({ ...audio, volume: Number(e.target.value) })}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-navy-1"
                          />
                        </div>
                      )}
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
                        Lưu cài đặt
                      </>
                    )}
                  </button>
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
                            onClick={handleExportData}
                            className="inline-flex items-center gap-2 px-4 py-2 bg-navy-1 text-white rounded-[8px] text-sm font-medium hover:bg-navy-2 transition-colors"
                          >
                            <Download className="h-4 w-4" />
                            Xuất JSON
                          </button>
                          <button
                            onClick={handleExportData}
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
                        <button className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-[8px] text-sm font-medium hover:bg-red-600 transition-colors">
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
    </div>
  )
}
