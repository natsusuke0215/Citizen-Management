'use client'

import { useRef } from 'react'
import Link from 'next/link'
import { Building } from 'lucide-react'
import AudioPlayer from '@/components/AudioPlayer'
import LoginForm from './components/LoginForm'
import { useBackgroundImage } from './hooks/useBackgroundImage'

export default function LoginPage() {
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const { backgroundStyle, hasAnyImage, setBgImage } = useBackgroundImage()

  const triggerFileSelect = () => {
    fileInputRef.current?.click()
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      const result = reader.result as string
      setBgImage(result)
      try {
        localStorage.setItem('loginBackground', result)
      } catch (err) {
        // ignore
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative"
      style={backgroundStyle}
    >
      {/* Background overlay */}
      {!hasAnyImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-2 via-white to-yellow-2"></div>
      )}
      {hasAnyImage && (
        <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"></div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      {/* Card container */}
      <div className="max-w-md w-full relative z-10">
        <div className="bg-white/95 backdrop-blur-sm rounded-[15px] shadow-drop-lg p-8 border border-gray-200">
          <div className="max-w-md w-full space-y-8">
            <div>
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[12px] shadow-drop">
                  <Building className="h-10 w-10 text-white" />
                </div>
              </div>
              <h2 className="text-center text-3xl font-bold text-gray-900">
                Đăng nhập tài khoản
              </h2>
              <p className="mt-3 text-center text-sm text-gray-600">
                Vui lòng đăng nhập để tiếp tục
              </p>
            </div>
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Change background button */}
      <button
        type="button"
        onClick={triggerFileSelect}
        className="fixed bottom-6 right-6 z-50 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-full px-4 py-2.5 shadow-drop hover:shadow-drop-lg focus:outline-none transition-all duration-200 text-sm font-medium text-gray-700 hover:text-navy-1"
        title="Đổi hình nền"
      >
        Đổi hình nền
      </button>

      {/* Background Music Player */}
      <AudioPlayer 
        src="/assets/audio/background-landing.mp3"
        storageKey="landingMusicEnabled"
        loop={true}
        volume={0.3}
      />
    </div>
  )
}