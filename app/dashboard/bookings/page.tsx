'use client'

import { useState } from 'react'
import { Plus, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import { Booking, BookingFormData, BookingStatus } from './types'
import { useBookings } from './hooks/useBookings'
import { useCenters } from './hooks/useCenters'
import { filterBookings } from './utils/filterUtils'
import StatisticsCards from './components/StatisticsCards'
import SearchAndFilterBar from './components/SearchAndFilterBar'
import BookingsList from './components/BookingsList'
import EmptyState from './components/EmptyState'
import BookingModal from './components/BookingModal'

export default function BookingsPage() {
  const { bookings, loading, fetchBookings } = useBookings()
  const { centers } = useCenters()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<BookingStatus>('ALL')
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  
  const [formData, setFormData] = useState<BookingFormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    culturalCenterId: '',
    visibility: 'PUBLIC'
  })

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

  const handleOpenCreateModal = () => {
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
  }

  const handleCloseModal = () => {
    setShowModal(false)
    setEditingBooking(null)
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setStatusFilter('ALL')
  }

  // Calculate statistics (Added logic to support StatisticsCards)
  const totalBookings = bookings.length
  const pendingBookings = bookings.filter(b => b.status === 'PENDING').length
  const approvedBookings = bookings.filter(b => b.status === 'APPROVED').length
  const rejectedBookings = bookings.filter(b => b.status === 'REJECTED').length

  // Filter bookings using utility
  const filteredBookings = filterBookings(bookings, searchTerm, statusFilter)

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
          onClick={handleOpenCreateModal}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5 mr-2" />
          Đặt lịch mới
        </button>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards
        totalBookings={totalBookings}
        pendingBookings={pendingBookings}
        approvedBookings={approvedBookings}
        rejectedBookings={rejectedBookings}
      />

      {/* Search and Filter Bar */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Bookings List */}
      {filteredBookings.length > 0 ? (
        <BookingsList
          bookings={filteredBookings}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      ) : (
        <EmptyState
          searchTerm={searchTerm}
          statusFilter={statusFilter}
          onClearFilters={handleClearFilters}
        />
      )}

      {/* Booking Modal */}
      <BookingModal
        isOpen={showModal}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
        centers={centers}
        editingBooking={editingBooking}
      />
    </div>
  )
}