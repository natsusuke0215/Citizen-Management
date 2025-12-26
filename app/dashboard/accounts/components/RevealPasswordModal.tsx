'use client'

import { X, Shield, Eye } from 'lucide-react'

interface UserWithPassword {
  id: string
  name: string
  email: string
}

interface RevealPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (e: React.FormEvent) => void
  user: UserWithPassword | null
  adminPassword: string
  setAdminPassword: (password: string) => void
}

export default function RevealPasswordModal({
  isOpen,
  onClose,
  onSubmit,
  user,
  adminPassword,
  setAdminPassword
}: RevealPasswordModalProps) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-[15px] shadow-drop-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Shield className="h-5 w-5 text-navy-1" />
            Xác thực bảo mật
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-[8px] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-[10px] p-4">
            <p className="text-sm text-yellow-800">
              Để hiển thị mật khẩu của <strong>{user.name}</strong>, vui lòng nhập mật khẩu quản trị viên của bạn để xác thực.
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
              onClick={onClose}
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
  )
}

