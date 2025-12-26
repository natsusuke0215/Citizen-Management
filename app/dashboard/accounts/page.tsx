'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Trash2, Edit, Shield, Users, X, Save, UserPlus, Eye, Lock } from 'lucide-react'
import toast from 'react-hot-toast'
import { User as UserType, UserRole, CreateUserData } from '@/lib/types'

interface UserWithPassword extends UserType {
  password?: string
}

export default function AccountsPage() {
  const [users, setUsers] = useState<UserWithPassword[]>([])
  const [loading, setLoading] = useState(true)
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

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra khi tải danh sách người dùng')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

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
    // If current role is ADMIN (shouldn't happen), set to default
    const initialRole = user.role === UserRole.ADMIN ? UserRole.FACILITY_MANAGER : user.role
    setRoleFormData({ role: initialRole })
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

  const getRoleLabel = (role: UserRole): string => {
    const roleLabels: Record<UserRole, string> = {
      [UserRole.TEAM_LEADER]: 'Tổ trưởng',
      [UserRole.DEPUTY]: 'Tổ phó',
      [UserRole.FACILITY_MANAGER]: 'Quản lý CSVC',
      [UserRole.CALENDAR_MANAGER]: 'Quản lý lịch',
      [UserRole.ADMIN]: 'Quản trị viên'
    }
    return roleLabels[role] || role
  }

  const getRoleBadgeColor = (role: UserRole): string => {
    const colors: Record<UserRole, string> = {
      [UserRole.TEAM_LEADER]: 'bg-red-100 text-red-800',
      [UserRole.DEPUTY]: 'bg-indigo-100 text-indigo-800',
      [UserRole.FACILITY_MANAGER]: 'bg-green-100 text-green-800',
      [UserRole.CALENDAR_MANAGER]: 'bg-blue-100 text-blue-800',
      [UserRole.ADMIN]: 'bg-yellow-100 text-yellow-800'
    }
    return colors[role] || 'bg-gray-100 text-gray-800'
  }

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Mật khẩu
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày tạo
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Thao tác
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    Không có người dùng nào
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-navy-1 to-navy-2 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-600">
                        ********
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleBadgeColor(user.role)}`}>
                        {getRoleLabel(user.role)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {new Date(user.createdAt).toLocaleDateString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => openRevealModal(user)}
                          className="p-2 text-purple-600 hover:bg-purple-50 rounded-[8px] transition-colors"
                          title="Hiển thị mật khẩu"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openChangePasswordModal(user)}
                          className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-[8px] transition-colors"
                          title="Đổi mật khẩu"
                        >
                          <Lock className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openRoleModal(user)}
                          disabled={user.role === UserRole.ADMIN}
                          className={`p-2 rounded-[8px] transition-colors ${
                            user.role === UserRole.ADMIN
                              ? 'text-gray-400 cursor-not-allowed'
                              : 'text-blue-600 hover:bg-blue-50'
                          }`}
                          title={user.role === UserRole.ADMIN ? 'Không thể cập nhật role cho Quản trị viên' : 'Cập nhật role'}
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-[8px] transition-colors"
                          title="Xóa người dùng"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create User Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-[15px] shadow-drop-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <UserPlus className="h-5 w-5 text-navy-1" />
                Tạo tài khoản mới
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-[8px] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleCreateUser} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Họ và tên *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu *
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input"
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                  className="input"
                  required
                >
                  {Object.values(UserRole)
                    .filter(role => role !== UserRole.ADMIN)
                    .map((role) => (
                      <option key={role} value={role}>
                        {getRoleLabel(role)}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-[10px] text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[10px] hover:opacity-90 transition-all duration-200 shadow-drop"
                >
                  Tạo tài khoản
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Update Role Modal */}
      {showRoleModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-[15px] shadow-drop-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Edit className="h-5 w-5 text-navy-1" />
                Cập nhật role
              </h2>
              <button
                onClick={() => setShowRoleModal(false)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-[8px] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleUpdateRole} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Người dùng
                </label>
                <div className="input bg-gray-50">
                  {selectedUser.name} ({selectedUser.email})
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={roleFormData.role}
                  onChange={(e) => setRoleFormData({ role: e.target.value as UserRole })}
                  className="input"
                  required
                >
                  {Object.values(UserRole)
                    .filter(role => role !== UserRole.ADMIN)
                    .map((role) => (
                      <option key={role} value={role}>
                        {getRoleLabel(role)}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-[10px] text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[10px] hover:opacity-90 transition-all duration-200 shadow-drop flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Security Check Modal for Reveal Password */}
      {showRevealModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-[15px] shadow-drop-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Shield className="h-5 w-5 text-navy-1" />
                Xác thực bảo mật
              </h2>
              <button
                onClick={() => {
                  setShowRevealModal(false)
                  setAdminPassword('')
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-[8px] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleRevealPassword} className="p-6 space-y-4">
              <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-4">
                <p className="text-sm text-yellow-800">
                  Để hiển thị mật khẩu của <strong>{selectedUser.name}</strong>, vui lòng nhập mật khẩu quản trị viên của bạn để xác thực.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu quản trị viên *
                </label>
                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="input"
                  required
                  autoFocus
                  placeholder="Nhập mật khẩu của bạn"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowRevealModal(false)
                    setAdminPassword('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-[10px] text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[10px] hover:opacity-90 transition-all duration-200 shadow-drop flex items-center justify-center gap-2"
                >
                  <Eye className="h-4 w-4" />
                  Xác thực
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Revealed Password Modal */}
      {showRevealedPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-[15px] shadow-drop-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Eye className="h-5 w-5 text-navy-1" />
                Mật khẩu người dùng
              </h2>
              <button
                onClick={() => {
                  setShowRevealedPasswordModal(false)
                  setRevealedPassword('')
                  setSelectedUser(null)
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-[8px] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
                <p className="text-sm text-blue-800 mb-2">
                  Mật khẩu cho <strong>{selectedUser.name}</strong> ({selectedUser.email}):
                </p>
                <div className="bg-white border border-blue-300 rounded-[8px] p-3 mt-2">
                  <p className="text-lg font-mono font-bold text-gray-900 text-center">
                    {revealedPassword}
                  </p>
                </div>
              </div>
              <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-3">
                <p className="text-xs text-yellow-800">
                  ⚠️ Vui lòng bảo mật thông tin này. Mật khẩu sẽ không được hiển thị lại sau khi đóng modal này.
                </p>
              </div>
              <button
                onClick={() => {
                  setShowRevealedPasswordModal(false)
                  setRevealedPassword('')
                  setSelectedUser(null)
                }}
                className="w-full px-4 py-2 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[10px] hover:opacity-90 transition-all duration-200 shadow-drop"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white rounded-[15px] shadow-drop-lg w-full max-w-md mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Lock className="h-5 w-5 text-navy-1" />
                Đổi mật khẩu
              </h2>
              <button
                onClick={() => {
                  setShowPasswordModal(false)
                  setNewPassword('')
                  setConfirmAdminPassword('')
                }}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-[8px] transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Người dùng
                </label>
                <div className="input bg-gray-50">
                  {selectedUser.name} ({selectedUser.email})
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mật khẩu mới *
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input"
                  required
                  minLength={6}
                  placeholder="Nhập mật khẩu mới (tối thiểu 6 ký tự)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Xác nhận mật khẩu quản trị viên *
                </label>
                <input
                  type="password"
                  value={confirmAdminPassword}
                  onChange={(e) => setConfirmAdminPassword(e.target.value)}
                  className="input"
                  required
                  placeholder="Nhập mật khẩu quản trị viên của bạn"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Vui lòng nhập mật khẩu quản trị viên của bạn để xác nhận thay đổi.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordModal(false)
                    setNewPassword('')
                    setConfirmAdminPassword('')
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-[10px] text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[10px] hover:opacity-90 transition-all duration-200 shadow-drop flex items-center justify-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  Cập nhật
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

