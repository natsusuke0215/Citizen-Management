'use client'

import { memo, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff } from 'lucide-react'
import toast from 'react-hot-toast'

function LoginForm() {
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

  return (
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
  )
}

export default memo(LoginForm)

