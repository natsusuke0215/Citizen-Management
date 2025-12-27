'use client'

import { AlertTriangle, X, Trash2, RefreshCw } from 'lucide-react'

interface DeleteAccountModalProps {
  show: boolean
  deletePassword: string
  setDeletePassword: (password: string) => void
  deleting: boolean
  onDelete: () => void
  onClose: () => void
}

export default function DeleteAccountModal({
  show,
  deletePassword,
  setDeletePassword,
  deleting,
  onDelete,
  onClose
}: DeleteAccountModalProps) {
  if (!show) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-[15px] shadow-drop-lg max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <AlertTriangle className="h-6 w-6 text-red-500" />
            Xác nhận xóa tài khoản
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={deleting}
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
            disabled={deleting}
          />
        </div>
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-[8px] hover:bg-gray-200 transition-colors"
            disabled={deleting}
          >
            Hủy
          </button>
          <button
            onClick={onDelete}
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
  )
}

