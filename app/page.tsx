import Link from 'next/link'
import { Home, Users, Building, Calendar, Shield, Sparkles, ArrowRight } from 'lucide-react'
import AudioPlayer from '@/components/AudioPlayer'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-2 via-white to-yellow-2">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-drop sticky top-0 z-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-5">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[8px] shadow-drop">
                <Building className="h-7 w-7 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Hệ thống quản lý nhân khẩu
              </h1>
            </div>
            <div className="flex gap-3">
              <Link 
                href="/login" 
                className="px-5 py-2.5 text-sm font-medium text-navy-1 bg-white border border-navy-1 rounded-[8px] hover:bg-navy-1 hover:text-white transition-all duration-200 shadow-drop hover:shadow-drop-lg transform hover:-translate-y-0.5"
              >
                Đăng nhập
              </Link>
              <Link 
                href="/register" 
                className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                Đăng ký
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-2 rounded-full border border-yellow-1 mb-6">
            <Sparkles className="h-4 w-4 text-navy-1" />
            <span className="text-sm font-medium text-navy-1">Hệ thống quản lý thông minh</span>
          </div>
          <h2 className="text-5xl font-bold text-gray-900 sm:text-6xl md:text-7xl">
            Quản lý nhân khẩu
            <span className="block mt-2 bg-gradient-to-r from-navy-1 to-navy-3 bg-clip-text text-transparent">
              hiện đại và hiệu quả
            </span>
          </h2>
          <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-600 sm:text-xl">
            Hệ thống quản lý hộ khẩu, nhân khẩu và nhà văn hóa với công nghệ tiên tiến, 
            giao diện thân thiện và dễ sử dụng
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link 
              href="/login" 
              className="group inline-flex items-center gap-2 px-8 py-4 text-base font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[12px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-1"
            >
              Bắt đầu ngay
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link 
              href="/register" 
              className="px-8 py-4 text-base font-semibold text-navy-1 bg-white border-2 border-navy-1 rounded-[12px] hover:bg-navy-1 hover:text-white transition-all duration-200 shadow-drop hover:shadow-drop-lg"
            >
              Tạo tài khoản
            </Link>
          </div>
        </div>

        {/* Features */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-3">Tính năng nổi bật</h3>
            <p className="text-gray-600">Khám phá các tính năng mạnh mẽ của hệ thống</p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="group bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[12px] shadow-drop group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-navy-1 transition-colors">
                Quản lý hộ khẩu
              </h3>
              <p className="text-gray-600">
                Tạo, xem, sửa, xóa thông tin hộ khẩu và nhân khẩu một cách dễ dàng
              </p>
            </div>

            <div className="group bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-navy-2 to-navy-3 rounded-[12px] shadow-drop group-hover:scale-110 transition-transform duration-300">
                  <Building className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-navy-1 transition-colors">
                Nhà văn hóa
              </h3>
              <p className="text-gray-600">
                Đặt lịch sử dụng nhà văn hóa với 3 tòa nhà và quản lý lịch trống
              </p>
            </div>

            <div className="group bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-navy-3 to-navy-1 rounded-[12px] shadow-drop group-hover:scale-110 transition-transform duration-300">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-navy-1 transition-colors">
                Lịch đăng ký
              </h3>
              <p className="text-gray-600">
                Xem lịch trống và đặt lịch sử dụng nhà văn hóa công khai hoặc riêng tư
              </p>
            </div>

            <div className="group bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[12px] shadow-drop group-hover:scale-110 transition-transform duration-300">
                  <Shield className="h-8 w-8 text-navy-1" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-navy-1 transition-colors">
                Phân quyền
              </h3>
              <p className="text-gray-600">
                Hệ thống phân quyền Admin và User với các tính năng phù hợp
              </p>
            </div>

            <div className="group bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-navy-1 to-yellow-1 rounded-[12px] shadow-drop group-hover:scale-110 transition-transform duration-300">
                  <Home className="h-8 w-8 text-white" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-navy-1 transition-colors">
                Phân loại khu phố
              </h3>
              <p className="text-gray-600">
                Quản lý và phân loại theo từng khu phố một cách có hệ thống
              </p>
            </div>

            <div className="group bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 p-6 border border-gray-100">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-gradient-to-br from-navy-2 to-yellow-2 rounded-[12px] shadow-drop group-hover:scale-110 transition-transform duration-300">
                  <Users className="h-8 w-8 text-navy-1" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-navy-1 transition-colors">
                Yêu cầu & Duyệt
              </h3>
              <p className="text-gray-600">
                Tạo yêu cầu và hệ thống duyệt tự động với thông báo
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-navy-1 to-navy-2 mt-24 text-white">
        <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Building className="h-6 w-6" />
              <span className="text-lg font-bold">Hệ thống quản lý nhân khẩu</span>
            </div>
            <p className="text-white/80">
              © 2024 Hệ thống quản lý nhân khẩu. Tất cả quyền được bảo lưu.
            </p>
          </div>
        </div>
      </footer>

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
