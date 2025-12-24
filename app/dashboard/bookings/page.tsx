'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Calendar, Building, Clock, Eye, EyeOff, Edit, Trash2 } from 'lucide-react'
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

  const filteredBookings = bookings.filter(booking => {
    const searchLower = (searchTerm || '').toLowerCase()

    const valuesToSearch = [
      booking.title,
      booking.description,
      booking.culturalCenter?.name
    ]

    const matchesSearch = valuesToSearch.some(value =>
      (value || '').toLowerCase().includes(searchLower)
    )

    return matchesSearch
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý lịch đặt</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý lịch đặt nhà văn hóa
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
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
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Đặt lịch mới
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative w-full">
            {/* Icon Container */}
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Input Field */}
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Tìm kiếm theo tên, mô tả hoặc địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Bookings List */}
      <div className="mt-8 space-y-4">
        {filteredBookings.map((booking) => (
          <div key={booking.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500">
                  <Calendar className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {booking.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {booking.culturalCenter.name}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="flex items-center">
                  {booking.visibility === 'PUBLIC' ? (
                    <span title="Công khai">
                      <Eye className="h-4 w-4 text-green-600" />
                    </span>
                  ) : (
                    <span title="Riêng tư">
                      <EyeOff className="h-4 w-4 text-gray-600" />
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            {booking.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">{booking.description}</p>
              </div>
            )}
            
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center">
                <Clock className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-500">Thời gian:</span>
                <span className="ml-1 font-medium text-black">
                  {new Date(booking.startTime).toLocaleString('vi-VN')} - {new Date(booking.endTime).toLocaleString('vi-VN')}
                </span>
              </div>
              <div className="flex items-center">
                <Building className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-gray-500">Người đặt:</span>
                <span className="ml-1 font-medium text-black">{booking.user.name}</span>
              </div>
            </div>
            
            <div className="mt-4 flex items-center justify-between">
              <div className="text-xs text-gray-500">
                Tạo lúc: {new Date(booking.createdAt).toLocaleString('vi-VN')}
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(booking)}
                  className="text-indigo-600 hover:text-indigo-900"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(booking.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center py-12">
          <Calendar className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có lịch đặt nào</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm
              ? 'Không tìm thấy lịch đặt phù hợp với từ khóa tìm kiếm.'
              : 'Bắt đầu bằng cách đặt lịch đầu tiên.'}
          </p>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />
            
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">
                    {editingBooking ? 'Chỉnh sửa lịch đặt' : 'Đặt lịch mới'}
                  </h3>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tiêu đề *
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 input"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder="Nhập tiêu đề sự kiện"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Mô tả
                      </label>
                      <textarea
                        className="mt-1 input"
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Nhập mô tả sự kiện"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Nhà văn hóa *
                      </label>
                      <select
                        required
                        className="mt-1 input"
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
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Thời gian bắt đầu *
                        </label>
                        <input
                          type="datetime-local"
                          required
                          className="mt-1 input"
                          value={formData.startTime}
                          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Thời gian kết thúc *
                        </label>
                        <input
                          type="datetime-local"
                          required
                          className="mt-1 input"
                          value={formData.endTime}
                          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Chế độ hiển thị
                      </label>
                      <div className="mt-2 space-y-2">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="visibility"
                            value="PUBLIC"
                            checked={formData.visibility === 'PUBLIC'}
                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Công khai (mọi người có thể xem)</span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="visibility"
                            value="PRIVATE"
                            checked={formData.visibility === 'PRIVATE'}
                            onChange={(e) => setFormData({ ...formData, visibility: e.target.value as 'PUBLIC' | 'PRIVATE' })}
                            className="mr-2"
                          />
                          <span className="text-sm text-gray-700">Riêng tư (chỉ bạn có thể xem)</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn btn-primary sm:ml-3"
                  >
                    {editingBooking ? 'Cập nhật' : 'Đặt lịch'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary mt-3 sm:mt-0"
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
