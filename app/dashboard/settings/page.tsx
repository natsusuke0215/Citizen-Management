'use client'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Cài đặt</h1>
        <p className="mt-1 text-sm text-gray-600">
          Quản lý thông tin tài khoản, bảo mật và thông báo của bạn.
        </p>
      </div>

      {/* Thông tin tài khoản */}
      <div className="card space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Thông tin tài khoản</h2>
            <p className="text-sm text-gray-500">
              Xem và cập nhật các thông tin cơ bản của tài khoản.
            </p>
          </div>
          <button className="btn btn-primary text-sm">
            Lưu thay đổi
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Họ và tên</label>
            <input
              type="text"
              className="input mt-1"
              placeholder="Người dùng"
              disabled
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              className="input mt-1"
              placeholder="user@example.com"
              disabled
            />
          </div>
        </div>
      </div>

      {/* Bảo mật & mật khẩu */}
      <div className="card space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Bảo mật & mật khẩu</h2>
          <p className="text-sm text-gray-500">
            Đổi mật khẩu để bảo vệ tài khoản tốt hơn.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu hiện tại</label>
            <input type="password" className="input mt-1" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Mật khẩu mới</label>
            <input type="password" className="input mt-1" placeholder="••••••••" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Xác nhận mật khẩu mới</label>
            <input type="password" className="input mt-1" placeholder="••••••••" />
          </div>
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary">
            Cập nhật mật khẩu
          </button>
        </div>
      </div>

      {/* Thông báo */}
      <div className="card space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Thông báo</h2>
          <p className="text-sm text-gray-500">
            Chọn cách bạn muốn nhận thông báo từ hệ thống.
          </p>
        </div>

        <div className="space-y-3">
          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Email</p>
              <p className="text-xs text-gray-500">Nhận thông báo về yêu cầu và đặt lịch qua email.</p>
            </div>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
          </label>

          <label className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-900">Thông báo trong hệ thống</p>
              <p className="text-xs text-gray-500">Hiển thị thông báo trong biểu tượng chuông.</p>
            </div>
            <input type="checkbox" className="h-4 w-4" defaultChecked />
          </label>
        </div>

        <div className="flex justify-end">
          <button className="btn btn-primary">
            Lưu cài đặt thông báo
          </button>
        </div>
      </div>
    </div>
  )
}

