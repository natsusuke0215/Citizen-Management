'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Calendar, Building, Clock, Eye, EyeOff, Edit, Trash2, User, MapPin, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface CulturalCenter {
  id: string
  name: string
  building: string
  floor: number | null
  room: string | null
  capacity: number
}

interface Booking {
  id: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  visibility: 'PUBLIC' | 'PRIVATE'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  culturalCenter: CulturalCenter
  user: {
    id: string
    name: string
  }
  createdAt: string
}

const BUILDINGS: never[] = []

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [centers, setCenters] = useState<CulturalCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    culturalCenterId: '',
    visibility: 'PUBLIC' as 'PUBLIC' | 'PRIVATE'
  })

  useEffect(() => {
    fetchBookings()
    fetchCenters()
  }, [])

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách lịch đặt')
    } finally {
      setLoading(false)
    }
  }

  const fetchCenters = async () => {
    try {
      const response = await fetch('/api/cultural-centers')
      if (response.ok) {
        const data = await response.json()
        setCenters(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách nhà văn hóa')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.startTime || !formData.endTime || !formData.culturalCenterId) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      return
    }

    const startTime = new Date(formData.startTime)
    const endTime = new Date(formData.endTime)

    if (startTime >= endTime) {
      toast.error('Thời gian kết thúc phải sau thời gian bắt đầu')
      return
    }

    if (startTime < new Date()) {
      toast.error('Không thể đặt lịch trong quá khứ')
      return
    }

    try {
      const url = editingBooking ? `/api/bookings/${editingBooking.id}` : '/api/bookings'
      const method = editingBooking ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast.success(editingBooking ? 'Cập nhật lịch đặt thành công!' : 'Đặt lịch thành công!')
        setShowModal(false)
        setEditingBooking(null)
        setFormData({
          title: '',
          description: '',
          startTime: '',
          endTime: '',
          culturalCenterId: '',
          visibility: 'PUBLIC'
        })
        fetchBookings()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleEdit = (booking: Booking) => {
    setEditingBooking(booking)
    setFormData({
      title: booking.title,
      description: booking.description || '',
      startTime: new Date(booking.startTime).toISOString().slice(0, 16),
      endTime: new Date(booking.endTime).toISOString().slice(0, 16),
      culturalCenterId: booking.culturalCenter.id,
      visibility: booking.visibility
    })
    setShowModal(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa lịch đặt này?')) return

    try {
      const response = await fetch(`/api/bookings/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Xóa lịch đặt thành công!')
        fetchBookings()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi xóa lịch đặt')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa lịch đặt')
    }
  }

  // Calculate statistics
  const totalBookings = bookings.length

  // Format date helper
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }),
      time: date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
      full: date.toLocaleString('vi-VN')
    }
  }


  // Get day of week in Vietnamese
  const getDayOfWeek = (dateString: string) => {
    const date = new Date(dateString)
    const days = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
    return days[date.getDay()]
  }

  const filteredBookings = bookings
    .filter(booking => {
      if (!searchTerm) return true

      // Search filter - enhanced with date/time search
      let matchesSearch = true
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase().trim()
        
        // Basic text search
        const basicMatch = [
          booking.title,
          booking.description,
          booking.culturalCenter?.name,
          booking.user?.name
        ].some(value => (value || '').toLowerCase().includes(searchLower))

        // Date/time search
        const startDate = new Date(booking.startTime)
        const endDate = new Date(booking.endTime)
        
        // Search in formatted dates
        const dateStr = startDate.toLocaleDateString('vi-VN')
        const timeStr = startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        const dayOfWeek = getDayOfWeek(booking.startTime)
        const month = startDate.toLocaleDateString('vi-VN', { month: 'long' })
        const year = startDate.getFullYear().toString()
        
        // Check if search term matches date/time patterns
        const dateTimeMatch = 
          dateStr.includes(searchLower) ||
          timeStr.includes(searchLower) ||
          dayOfWeek.toLowerCase().includes(searchLower) ||
          month.toLowerCase().includes(searchLower) ||
          year.includes(searchLower) ||
          // Also check end time
          endDate.toLocaleDateString('vi-VN').includes(searchLower) ||
          endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }).includes(searchLower)

        matchesSearch = basicMatch || dateTimeMatch
      }

      return matchesSearch
    })
    .sort((a, b) => {
      // Sort by start time, newest first
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slideUp">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="h-8 w-8 text-navy-1" />
            Quản lý lịch đặt
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và theo dõi các lịch đặt nhà văn hóa
          </p>
        </div>
        <button
          onClick={() => {
            setEditingBooking(null)
            setFormData({
              title: '',
              description: '',
              startTime: '',
              endTime: '',
              culturalCenterId: '',
              visibility: 'PUBLIC'
            })
            setShowModal(true)
          }}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5 mr-2" />
          Đặt lịch mới
        </button>
      </div>

      {/* Statistics Card */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden bg-gradient-to-br from-navy-1 to-navy-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalBookings}</div>
            <div className="text-sm opacity-90">Tổng số lịch đặt</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-[15px] shadow-drop p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
              placeholder="Tìm kiếm theo tên, mô tả, địa điểm, người đặt, ngày tháng, giờ hoặc thứ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

        </div>
      </div>

      {/* Bookings List */}
      <div className="space-y-4">
        {filteredBookings.map((booking) => {
          const startDateTime = formatDateTime(booking.startTime)
          const endDateTime = formatDateTime(booking.endTime)
          const createdDateTime = formatDateTime(booking.createdAt)

          return (
            <div
              key={booking.id}
              className="group relative bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100"
            >

              {/* Decorative gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              <div className="relative p-6">
                {/* Header */}
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-4 rounded-[12px] bg-gradient-to-br from-navy-1 to-navy-2 shadow-drop group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
                    <Calendar className="h-7 w-7 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-navy-1 transition-colors mb-2">
                      {booking.title}
                    </h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Building className="h-4 w-4 text-navy-1" />
                      <span className="text-sm font-medium text-gray-700">
                        {booking.culturalCenter.name}
                      </span>
                    </div>
                    {booking.description && (
                      <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                        {booking.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Info Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Time */}
                  <div className="p-3 bg-yellow-2 rounded-[8px] border border-yellow-1">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-navy-1 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Thời gian</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {startDateTime.date} {startDateTime.time}
                        </div>
                        <div className="text-xs text-gray-600 mt-1">
                          đến {endDateTime.date} {endDateTime.time}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* User */}
                  <div className="p-3 bg-gray-50 rounded-[8px] border border-gray-200">
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-navy-1 mt-0.5 flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs text-gray-500 mb-1">Người đặt</div>
                        <div className="text-sm font-semibold text-gray-900">
                          {booking.user.name}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>Tạo lúc: {createdDateTime.full}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      {booking.visibility === 'PUBLIC' ? (
                        <>
                          <Eye className="h-3 w-3 text-green-600" />
                          <span className="text-green-600">Công khai</span>
                        </>
                      ) : (
                        <>
                          <EyeOff className="h-3 w-3 text-gray-400" />
                          <span>Riêng tư</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(booking)}
                      className="p-2 text-navy-1 hover:bg-navy-1/10 rounded-[6px] transition-all duration-200 hover:scale-110"
                      title="Chỉnh sửa"
                    >
                      <Edit className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-[6px] transition-all duration-200 hover:scale-110"
                      title="Xóa"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-16 bg-white rounded-[15px] shadow-drop border border-gray-100">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-navy-1/20 to-navy-3/20 rounded-full blur-2xl"></div>
            <Calendar className="relative h-20 w-20 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có lịch đặt'}
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
            {searchTerm
              ? `Không tìm thấy lịch đặt nào phù hợp với từ khóa tìm kiếm.`
              : 'Bắt đầu bằng cách đặt lịch đầu tiên cho nhà văn hóa.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => {
                setSearchTerm('')
              }}
              className="px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
            <div 
              className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity backdrop-blur-sm" 
              onClick={() => setShowModal(false)} 
            />
            
            <div className="relative inline-block align-bottom bg-white rounded-[15px] text-left overflow-hidden shadow-drop-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              {/* Modal Header */}
              <div className="bg-gradient-to-r from-navy-1 to-navy-2 px-6 py-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Calendar className="h-6 w-6" />
                    {editingBooking ? 'Chỉnh sửa lịch đặt' : 'Đặt lịch mới'}
                  </h3>
                  <button
                    onClick={() => setShowModal(false)}
                    className="text-white hover:text-gray-200 transition-colors"
                  >
                    <XCircle className="h-6 w-6" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="bg-white px-6 py-6">
                  
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tiêu đề *
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Nhập tiêu đề sự kiện"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Mô tả
                      </label>
                      <textarea
                        className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200 resize-none"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Nhập mô tả sự kiện (tùy chọn)"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nhà văn hóa *
                      </label>
                      <select
                        required
                        className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200 cursor-pointer"
                        value={formData.culturalCenterId}
                        onChange={(e) => setFormData({ ...formData, culturalCenterId: e.target.value })}
                      >
                        <option value="">Chọn nhà văn hóa</option>
                        {centers.map((center) => (
                          <option key={center.id} value={center.id}>
                            {center.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Thời gian bắt đầu *
                        </label>
                        <input
                          type="datetime-local"
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Thời gian kết thúc *
                        </label>
                        <input
                          type="datetime-local"
                          required
                          className="w-full px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-3">
                        Chế độ hiển thị
                      </label>
                      <div className="space-y-3">
                        <label className="flex items-center p-3 border border-gray-200 rounded-[8px] hover:bg-gray-50 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="visibility"
                            value="PUBLIC"
                            checked={formData.visibility === 'PUBLIC'}
                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' })}
                            className="mr-3 text-navy-1 focus:ring-navy-1"
                          />
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4 text-green-600" />
                            <div>
                              <span className="text-sm font-medium text-gray-900">Công khai</span>
                              <p className="text-xs text-gray-500">Mọi người có thể xem lịch đặt này</p>
                            </div>
                          </div>
                        </label>
                        <label className="flex items-center p-3 border border-gray-200 rounded-[8px] hover:bg-gray-50 cursor-pointer transition-colors">
                          <input
                            type="radio"
                            name="visibility"
                            value="PRIVATE"
                            checked={formData.visibility === 'PRIVATE'}
                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' })}
                            className="mr-3 text-navy-1 focus:ring-navy-1"
                          />
                          <div className="flex items-center gap-2">
                            <EyeOff className="h-4 w-4 text-gray-400" />
                            <div>
                              <span className="text-sm font-medium text-gray-900">Riêng tư</span>
                              <p className="text-xs text-gray-500">Chỉ bạn có thể xem lịch đặt này</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-6 py-4 flex flex-row-reverse gap-3 border-t border-gray-200">
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    {editingBooking ? 'Cập nhật' : 'Đặt lịch'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 bg-white text-gray-700 border border-gray-300 rounded-[8px] font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
