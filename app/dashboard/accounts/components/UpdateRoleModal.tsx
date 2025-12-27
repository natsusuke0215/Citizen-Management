'use client'

import { X, Edit, Save } from 'lucide-react'
import { UserRole } from '@/lib/types'
import { getRoleLabel } from '../utils/roleUtils'

interface UserWithPassword {
  id: string
  name: string
  email: string
  role: UserRole
}

interface UpdateRoleModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  user: UserWithPassword | null
  roleFormData: { role: UserRole }
  setRoleFormData: (data: { role: UserRole }) => void
}

export default function UpdateRoleModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  roleFormData,
  setRoleFormData
}: UpdateRoleModalProps) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-[15px] shadow-drop-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Edit className="h-5 w-5 text-navy-1" />
            Cập nhật role
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-[8px] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Người dùng
            </label>
            <div className="input bg-gray-50">
              {user.name} ({user.email})
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
              onClick={onClose}
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
  )
}

