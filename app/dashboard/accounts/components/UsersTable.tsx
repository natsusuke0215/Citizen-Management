'use client'

import { Trash2, Edit, Eye, Lock } from 'lucide-react'
import { UserRole } from '@/lib/types'
import { getRoleLabel, getRoleBadgeColor } from '../utils/roleUtils'

interface UserWithPassword {
  id: string
  name: string
  email: string
  role: UserRole
  createdAt: string
}

interface UsersTableProps {
  users: UserWithPassword[]
  searchTerm: string
  onRevealPassword: (user: UserWithPassword) => void
  onChangePassword: (user: UserWithPassword) => void
  onUpdateRole: (user: UserWithPassword) => void
  onDeleteUser: (userId: string) => void
}

export default function UsersTable({
  users,
  searchTerm,
  onRevealPassword,
  onChangePassword,
  onUpdateRole,
  onDeleteUser
}: UsersTableProps) {
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
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
                        onClick={() => onRevealPassword(user)}
                        className="p-2 text-purple-600 hover:bg-purple-50 rounded-[8px] transition-colors"
                        title="Hiển thị mật khẩu"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onChangePassword(user)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-[8px] transition-colors"
                        title="Đổi mật khẩu"
                      >
                        <Lock className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => onUpdateRole(user)}
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
                        onClick={() => onDeleteUser(user.id)}
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
  )
}

