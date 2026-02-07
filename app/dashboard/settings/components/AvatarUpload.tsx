'use client'

import { Camera } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import toast from 'react-hot-toast'

interface AvatarUploadProps {
  userName: string
  userEmail: string
  avatarUrl?: string
  onAvatarChange?: (avatarUrl: string) => void
}

export default function AvatarUpload({ userName, userEmail, avatarUrl, onAvatarChange }: AvatarUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | undefined>(avatarUrl)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    setCurrentAvatarUrl(avatarUrl)
  }, [avatarUrl])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Vui lòng chọn file ảnh')
      e.target.value = '' // Reset input
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Kích thước file không được vượt quá 5MB')
      e.target.value = '' // Reset input
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('avatar', file)

      const response = await fetch('/api/users/me/avatar', {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (response.ok) {
        const data = await response.json()
        setCurrentAvatarUrl(data.avatarUrl)
        toast.success('Đã cập nhật ảnh đại diện!')
        if (onAvatarChange) {
          onAvatarChange(data.avatarUrl)
        }
        // Dispatch event to refresh user data
        window.dispatchEvent(new CustomEvent('userProfileUpdated'))
      } else {
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra khi tải ảnh lên')
      }
    } catch (error) {
      console.error('Upload avatar error:', error)
      toast.error('Có lỗi xảy ra khi tải ảnh lên')
    } finally {
      setUploading(false)
      e.target.value = '' // Reset input after upload
    }
  }

  return (
    <div className="flex items-center gap-6 mb-8 pb-8 border-b border-gray-200">
      <div className="relative">
        {currentAvatarUrl ? (
          <img
            src={currentAvatarUrl}
            alt={userName}
            className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-navy-1 to-navy-2 flex items-center justify-center text-white text-2xl font-bold">
            {userName?.charAt(0).toUpperCase() || 'U'}
          </div>
        )}
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="absolute bottom-0 right-0 p-2 bg-navy-1 text-white rounded-full hover:bg-navy-2 transition-colors shadow-drop hover:shadow-drop-lg cursor-pointer z-10 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Camera className="h-4 w-4" />
          )}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-gray-900">{userName || 'Người dùng'}</h3>
        <p className="text-sm text-gray-500">{userEmail}</p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="mt-2 text-sm text-navy-1 hover:text-navy-2 font-medium cursor-pointer inline-block disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {uploading ? 'Đang tải lên...' : 'Thay đổi ảnh đại diện'}
        </button>
      </div>
    </div>
  )
}

