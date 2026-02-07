'use client'

import { useState, useEffect } from 'react'
import { Plus, Calendar, History as HistoryIcon } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'
import { Booking, BookingFormData } from './types'
import { useBookings } from './hooks/useBookings'
import { useCenters } from './hooks/useCenters'
import { filterBookings } from './utils/filterUtils'
import StatisticsCards from './components/StatisticsCards'
import SearchAndFilterBar from './components/SearchAndFilterBar'
import BookingsList from './components/BookingsList'
import EmptyState from './components/EmptyState'
import BookingModal from './components/BookingModal'
import PaymentCheckout from './components/PaymentCheckout'
import BookingHistory from './components/BookingHistory'

export default function BookingsPage() {
  const { bookings, loading, fetchBookings } = useBookings()
  const { centers } = useCenters()
  const [searchTerm, setSearchTerm] = useState('')
  const [sortMode, setSortMode] = useState<'event' | 'created'>('created')
  const [showModal, setShowModal] = useState(false)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  
  // Resolved conflict here: Kept payment state variables
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [pendingBooking, setPendingBooking] = useState<Booking | null>(null)
  const [calculatedAmount, setCalculatedAmount] = useState(0)

  const [formData, setFormData] = useState<BookingFormData>({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    culturalCenterId: '',
    visibility: 'PUBLIC'
  })
  const [showHistory, setShowHistory] = useState(false)

  // Open create modal if query param ?new=1 is present
  const searchParams = useSearchParams()
  useEffect(() => {
    if (searchParams?.get('new') === '1') {
      setShowModal(true)
    }
  }, [searchParams])

  const calculateAmount = (culturalCenterId: string, startTime: string, endTime: string): number => {
    const center = centers.find(c => c.id === culturalCenterId)
    if (!center) return 0

    // room-specific rate map (VND/hour)
    const rateMap: Record<string, number> = {
      'Hội trường tầng 1': 120000,
      'Phòng chức năng 3': 120000,
      'Sân bóng chuyền': 60000,
      'Sân cầu lông': 50000,
      'Sân cầu lông 2': 50000,
      'Phòng họp nhỏ tầng 1': 70000,
      'Phòng đa năng tầng 3': 70000,
      'Phòng chức năng 1': 40000,
      'Phòng chức năng 2': 40000,
      'Phòng thư viện': 30000
    }

    const start = new Date(startTime)
    const end = new Date(endTime)
    const hours = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

    // Determine unit rate: mapping by name overrides center.baseHourlyRate
    const unit = rateMap[center.name] ?? center.baseHourlyRate ?? 0
    const raw = hours * unit
    // Round up to nearest 1000 VND
    const rounded = Math.ceil(raw / 1000) * 1000
    return rounded
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
      // Calculate the total amount
      const totalAmount = calculateAmount(formData.culturalCenterId, formData.startTime, formData.endTime)

      // Create booking with PENDING_PAYMENT status
      const bookingData = {
        ...formData,
        status: 'PENDING_PAYMENT',
        fee: totalAmount
      }

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      })

      if (response.ok) {
        const booking = await response.json()

        // Set up payment flow
        setPendingBooking(booking)
        setCalculatedAmount(totalAmount)
        setShowModal(false)
        setShowPaymentModal(true)
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

  const handlePaymentSuccess = () => {
    setShowPaymentModal(false)
    setPendingBooking(null)
    setCalculatedAmount(0)
    toast.success('Thanh toán thành công! Lịch đặt đã được xác nhận.')
    fetchBookings()
  }

  const handleClosePaymentModal = () => {
    setShowPaymentModal(false)
    setPendingBooking(null)
    setCalculatedAmount(0)
    // Optionally cancel the pending booking
    if (pendingBooking) {
      fetch(`/api/bookings/${pendingBooking.id}`, {
        method: 'DELETE'
      }).catch(() => {
        // Silently handle deletion failure
      })
    }
  }

  const handleClearFilters = () => {
    setSearchTerm('')
  }

  // Calculate statistics
  const totalBookings = bookings.length

  // Filter bookings using utility (search by booker name/phone/title)
  const filteredBookings = filterBookings(bookings, searchTerm, sortMode)

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
        <div className="flex items-center gap-3">
          <button
            onClick={handleOpenCreateModal}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Plus className="h-5 w-5 mr-2" />
            Đặt lịch mới
          </button>

          <button
            onClick={() => setShowHistory(true)}
            className="inline-flex items-center px-3 py-2 bg-white text-gray-700 border border-gray-300 rounded-[8px] font-medium hover:bg-gray-50 transition-all duration-200"
            title="Lịch sử"
          >
            <HistoryIcon className="h-4 w-4 mr-2" />
            Lịch sử
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards
        totalBookings={totalBookings}
      />

      {/* Search and Filter Bar */}
      <SearchAndFilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        sortMode={sortMode}
        onSortChange={(m) => setSortMode(m)}
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

      {/* Payment Checkout Modal */}
      {pendingBooking && (
        <PaymentCheckout
          isOpen={showPaymentModal}
          onClose={handleClosePaymentModal}
          onPaymentSuccess={handlePaymentSuccess}
          booking={{
            id: pendingBooking.id,
            title: pendingBooking.title,
            startTime: pendingBooking.startTime,
            endTime: pendingBooking.endTime,
            culturalCenter: pendingBooking.culturalCenter
          }}
          totalAmount={calculatedAmount}
        />
      )}
      {/* Booking History Drawer */}
      <BookingHistory
        isOpen={showHistory}
        onClose={() => setShowHistory(false)}
        bookings={bookings}
      />
    </div>
  )
}