'use client'

import { useState } from 'react'
import { Plus, Search, Shield } from 'lucide-react'
import toast from 'react-hot-toast'
import { UserRole, CreateUserData } from '@/lib/types'
import { useUsers } from './hooks/useUsers'
import UsersTable from './components/UsersTable'
import CreateUserModal from './components/CreateUserModal'
import UpdateRoleModal from './components/UpdateRoleModal'
import RevealPasswordModal from './components/RevealPasswordModal'
import RevealedPasswordModal from './components/RevealedPasswordModal'
import ChangePasswordModal from './components/ChangePasswordModal'

interface UserWithPassword {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
  password?: string
}

export default function AccountsPage() {
  const { users, loading, fetchUsers } = useUsers()
  const [searchTerm, setSearchTerm] = useState('')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showRevealModal, setShowRevealModal] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showRevealedPasswordModal, setShowRevealedPasswordModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserWithPassword | null>(null)
  const [adminPassword, setAdminPassword] = useState('')
  const [revealedPassword, setRevealedPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmAdminPassword, setConfirmAdminPassword] = useState('')
  const [formData, setFormData] = useState<CreateUserData>({
    email: '',
    password: '',
    name: '',
    role: UserRole.FACILITY_MANAGER
  })
  const [roleFormData, setRoleFormData] = useState<{ role: UserRole }>({
    role: UserRole.FACILITY_MANAGER
  })

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password || !formData.name) {
      toast.error('Vui lòng điền đầy đủ thông tin')
      return
    }

    if (formData.password.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Tạo người dùng thành công!')
        setShowCreateModal(false)
        setFormData({
          email: '',
          password: '',
          name: '',
          role: UserRole.FACILITY_MANAGER
        })
        fetchUsers()
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi tạo người dùng')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tạo người dùng')
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      return
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Xóa người dùng thành công!')
        fetchUsers()
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi xóa người dùng')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa người dùng')
    }
  }

  const handleUpdateRole = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser) return

    try {
      const response = await fetch(`/api/users/${selectedUser.id}/role`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(roleFormData)
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Cập nhật role thành công!')
        setShowRoleModal(false)
        setSelectedUser(null)
        fetchUsers()
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi cập nhật role')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật role')
    }
  }

  const openRoleModal = (user: UserWithPassword) => {
    // Prevent updating role for ADMIN users
    if (user.role === UserRole.ADMIN) {
      toast.error('Không thể cập nhật role cho tài khoản Quản trị viên')
      return
    }
    setSelectedUser(user)
    // Set initial role (excluding ADMIN as it's already filtered)
    setRoleFormData({ role: user.role })
    setShowRoleModal(true)
  }

  const openRevealModal = (user: UserWithPassword) => {
    setSelectedUser(user)
    setAdminPassword('')
    setShowRevealModal(true)
  }

  const handleRevealPassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser || !adminPassword) {
      toast.error('Vui lòng nhập mật khẩu quản trị viên')
      return
    }

    try {
      // Get current admin user ID from API
      const meResponse = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (!meResponse.ok) {
        toast.error('Không thể xác thực người dùng')
        return
      }

      const adminUser = await meResponse.json()

      const response = await fetch('/api/admin/verify-and-reveal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          adminId: adminUser.id,
          adminPassword: adminPassword,
          targetUserId: selectedUser.id
        })
      })

      const data = await response.json()

      if (response.ok) {
        setRevealedPassword(data.password)
        setShowRevealModal(false)
        setAdminPassword('')
        setShowRevealedPasswordModal(true)
      } else {
        // Check if password is still hashed
        if (data.error === 'PASSWORD_STILL_HASHED') {
          toast.error(
            'Mật khẩu trong database vẫn đang được hash. Vui lòng chạy script: npx tsx scripts/update-passwords-to-plaintext.ts',
            { duration: 6000 }
          )
        } else {
          toast.error(data.message || 'Mật khẩu quản trị viên không đúng')
        }
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xác thực')
    }
  }

  const openChangePasswordModal = (user: UserWithPassword) => {
    setSelectedUser(user)
    setNewPassword('')
    setConfirmAdminPassword('')
    setShowPasswordModal(true)
  }

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedUser || !newPassword) {
      toast.error('Vui lòng nhập mật khẩu mới')
      return
    }

    if (newPassword.length < 6) {
      toast.error('Mật khẩu phải có ít nhất 6 ký tự')
      return
    }

    if (!confirmAdminPassword) {
      toast.error('Vui lòng xác nhận mật khẩu quản trị viên')
      return
    }

    try {
      const response = await fetch(`/api/users/${selectedUser.id}/password`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          newPassword: newPassword,
          adminPassword: confirmAdminPassword
        })
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Cập nhật mật khẩu thành công!')
        setShowPasswordModal(false)
        setSelectedUser(null)
        setNewPassword('')
        setConfirmAdminPassword('')
        fetchUsers()
      } else {
        toast.error(data.message || 'Có lỗi xảy ra khi cập nhật mật khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật mật khẩu')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-gray-500">Đang tải...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-7 w-7 text-navy-1" />
            Quản lý tài khoản
          </h1>
          <p className="text-sm text-gray-500 mt-1">Quản lý người dùng và phân quyền</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="btn btn-primary flex items-center gap-2 px-4 py-2 rounded-[10px] bg-gradient-to-r from-navy-1 to-navy-2 text-white hover:opacity-90 transition-all duration-200 shadow-drop"
        >
          <Plus className="h-5 w-5" />
          Tạo tài khoản
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="input pl-10 w-full"
        />
      </div>

      {/* Users Table */}
      <UsersTable
        users={users}
        searchTerm={searchTerm}
        onRevealPassword={openRevealModal}
        onChangePassword={openChangePasswordModal}
        onUpdateRole={openRoleModal}
        onDeleteUser={handleDeleteUser}
      />

      {/* Modals */}
      <CreateUserModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateUser}
        formData={formData}
        setFormData={setFormData}
      />

      <UpdateRoleModal
        isOpen={showRoleModal}
        onClose={() => {
          setShowRoleModal(false)
          setSelectedUser(null)
        }}
        onSubmit={handleUpdateRole}
        user={selectedUser}
        roleFormData={roleFormData}
        setRoleFormData={setRoleFormData}
      />

      <RevealPasswordModal
        isOpen={showRevealModal}
        onClose={() => {
          setShowRevealModal(false)
          setAdminPassword('')
        }}
        onSubmit={handleRevealPassword}
        user={selectedUser}
        adminPassword={adminPassword}
        setAdminPassword={setAdminPassword}
      />

      <RevealedPasswordModal
        isOpen={showRevealedPasswordModal}
        onClose={() => {
          setShowRevealedPasswordModal(false)
          setRevealedPassword('')
          setSelectedUser(null)
        }}
        user={selectedUser}
        revealedPassword={revealedPassword}
      />

      <ChangePasswordModal
        isOpen={showPasswordModal}
        onClose={() => {
          setShowPasswordModal(false)
          setNewPassword('')
          setConfirmAdminPassword('')
        }}
        onSubmit={handleChangePassword}
        user={selectedUser}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmAdminPassword={confirmAdminPassword}
        setConfirmAdminPassword={setConfirmAdminPassword}
      />
    </div>
  )
}
