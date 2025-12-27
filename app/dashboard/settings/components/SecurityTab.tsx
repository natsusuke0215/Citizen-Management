'use client'

import { Key, Lock, Eye, EyeOff, RefreshCw } from 'lucide-react'
import LoginHistory from './LoginHistory'

interface SecurityTabProps {
  passwordData: {
    currentPassword: string
    newPassword: string
    confirmPassword: string
  }
  setPasswordData: (data: any) => void
  showPasswords: {
    current: boolean
    new: boolean
    confirm: boolean
  }
  setShowPasswords: (show: any) => void
  saving: boolean
  onChangePassword: () => void
}

export default function SecurityTab({
  passwordData,
  setPasswordData,
  showPasswords,
  setShowPasswords,
  saving,
  onChangePassword
}: SecurityTabProps) {
  return (
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
            onClick={onChangePassword}
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
      <LoginHistory />
    </div>
  )
}

