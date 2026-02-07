'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Settings } from 'lucide-react'
import toast from 'react-hot-toast'
import SettingsSidebar from './components/SettingsSidebar'
import ProfileTab from './components/ProfileTab'
import SecurityTab from './components/SecurityTab'
import NotificationsTab from './components/NotificationsTab'
import DeleteAccountModal from './components/DeleteAccountModal'

interface UserData {
  id: string
  email: string
  name: string
  role: string
  phone?: string
  address?: string
  avatarUrl?: string
  isEmailNotificationEnabled?: boolean
  isPushNotificationEnabled?: boolean
}

export default function SettingsPage() {
  const router = useRouter()
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
  
  // Delete account modal
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deletePassword, setDeletePassword] = useState('')
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    fetchUserData()
    
    // Listen for avatar updates
    const handleProfileUpdate = () => {
      fetchUserData()
    }
    
    window.addEventListener('userProfileUpdated', handleProfileUpdate)
    
    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate)
    }
  }, [])

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
        setProfileData({
          name: data.user.name || '',
          email: data.user.email || '',
          phone: data.user.phone || '',
          address: data.user.address || ''
        })
        
        // Dispatch custom event to notify other components
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
        setNotifications(notifications)
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      setNotifications(notifications)
      toast.error('Có lỗi xảy ra')
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
          <SettingsSidebar
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {activeTab === 'profile' && (
            <ProfileTab
              user={user}
              profileData={profileData}
              setProfileData={setProfileData}
              saving={saving}
              onSave={handleSaveProfile}
            />
          )}

          {activeTab === 'security' && (
            <SecurityTab
              passwordData={passwordData}
              setPasswordData={setPasswordData}
              showPasswords={showPasswords}
              setShowPasswords={setShowPasswords}
              saving={saving}
              onChangePassword={handleChangePassword}
            />
          )}

          {activeTab === 'notifications' && (
            <NotificationsTab
              notifications={notifications}
              onToggle={handleNotificationToggle}
            />
          )}
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        show={showDeleteModal}
        deletePassword={deletePassword}
        setDeletePassword={setDeletePassword}
        deleting={deleting}
        onDelete={handleDeleteAccount}
        onClose={() => {
          setShowDeleteModal(false)
          setDeletePassword('')
        }}
      />
    </div>
  )
}
