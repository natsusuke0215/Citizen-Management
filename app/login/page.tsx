 'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Building, Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'
import AudioPlayer from '@/components/AudioPlayer'

export default function LoginPage() {
  const [bgImage, setBgImage] = useState<string | null>(null)
  const [defaultBgImage, setDefaultBgImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    // Load persisted background from localStorage if present (has highest priority)
    try {
      const stored = localStorage.getItem('loginBackground')
      if (stored) {
        setBgImage(stored)
        return // User custom image takes priority
      }
    } catch (e) {
      // ignore
    }

    // Try to load default background image from assets
    const checkDefaultImage = () => {
      // Try different image formats in order
      const formats = ['jpg', 'jpeg', 'png', 'webp']
      let formatIndex = 0
      
      const tryNextFormat = () => {
        if (formatIndex >= formats.length) return
        
        const img = new Image()
        const format = formats[formatIndex]
        img.src = `/assets/images/backgrounds/login.${format}`
        
        img.onload = () => {
          setDefaultBgImage(img.src)
        }
        
        img.onerror = () => {
          formatIndex++
          tryNextFormat()
        }
      }
      
      tryNextFormat()
    }
    
    checkDefaultImage()
  }, [])
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Đăng nhập thành công!')
        console.log('Login successful, redirecting to dashboard...')
        // Use window.location for more reliable redirect
        setTimeout(() => {
          window.location.href = '/dashboard'
        }, 1000)
      } else {
        toast.error(data.message || 'Đăng nhập thất bại!')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra, vui lòng thử lại!')
    } finally {
      setLoading(false)
    }
  }

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
      style={{
        backgroundImage: bgImage || defaultBgImage ? `url(${bgImage || defaultBgImage})` : undefined,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {/* Background overlay when no custom image */}
      {!bgImage && !defaultBgImage && (
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-2 via-white to-yellow-2"></div>
      )}
      {(bgImage || defaultBgImage) && (
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
                Hoặc{' '}
                <Link href="/register" className="font-semibold text-navy-1 hover:text-navy-2 transition-colors">
                  tạo tài khoản mới
                </Link>
              </p>
            </div>
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập địa chỉ email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="relative">
                  <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                    Mật khẩu
                  </label>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                    placeholder="Nhập mật khẩu"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-3 bottom-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent text-base font-semibold rounded-[8px] text-white bg-gradient-to-r from-navy-1 to-navy-2 hover:shadow-drop-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-navy-1 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                </button>
              </div>

              <div className="text-center">
                <Link href="/" className="text-sm text-navy-1 hover:text-navy-2 font-medium transition-colors">
                  ← Quay lại trang chủ
                </Link>
              </div>
            </form>
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
