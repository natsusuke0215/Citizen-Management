'use client'

import { X, Eye } from 'lucide-react'

interface UserWithPassword {
  id: string
  name: string
  email: string
}

interface RevealedPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  user: UserWithPassword | null
  revealedPassword: string
}

export default function RevealedPasswordModal({
  isOpen,
  onClose,
  user,
  revealedPassword
}: RevealedPasswordModalProps) {
  if (!isOpen || !user) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-[15px] shadow-drop-lg w-full max-w-md mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Eye className="h-5 w-5 text-navy-1" />
            Mật khẩu người dùng
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-[8px] transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-[10px] p-4">
            <p className="text-sm text-blue-800 mb-2">
              Mật khẩu cho <strong>{user.name}</strong> ({user.email}):
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
            onClick={onClose}
            className="w-full px-4 py-2 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[10px] hover:opacity-90 transition-all duration-200 shadow-drop"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

