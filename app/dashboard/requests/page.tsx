'use client'

import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import RequestFilters from './components/RequestFilters'
import RequestCard from './components/RequestCard'
import RequestDetailModal from './components/RequestDetailModal'

// Giữ lại interface để đảm bảo không bị lỗi type
interface Request {
  id: string
  type: 'HOUSEHOLD_UPDATE' | 'ADD_PERSON' | 'REMOVE_PERSON' | 'CULTURAL_CENTER_BOOKING'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  description: string
  data: string | null
  user: {
    id: string
    name: string
    email: string
  }
  household: {
    id: string
    householdId: string
    address: string
  } | null
  createdAt: string
  updatedAt: string
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)
  
  // State quản lý bộ lọc
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [selectedStatus, setSelectedStatus] = useState<string>('all') // Thêm state này cho nhánh refactor
  
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null)

  useEffect(() => {
    fetchRequests()
  }, [])

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  // Hàm xử lý khi thay đổi trạng thái (Duyệt/Từ chối)
  // Cần thiết vì component con RequestCard và RequestDetailModal yêu cầu
  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/requests/${requestId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      })

      if (response.ok) {
        toast.success(`Đã cập nhật trạng thái thành công`)
        // Cập nhật lại danh sách local
        setRequests(prev => prev.map(req => 
          req.id === requestId ? { ...req, status: newStatus as any } : req
        ))
        if (selectedRequest && selectedRequest.id === requestId) {
          setSelectedRequest(null) // Đóng modal nếu đang mở
        }
      } else {
        toast.error('Cập nhật thất bại')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

  // Logic lọc dữ liệu (Kết hợp search, type và status)
  const filteredRequests = requests.filter(request => {
    const searchLower = (searchTerm || '').toLowerCase()

    const valuesToSearch = [
      request.description,
      request.user?.name,
      request.household?.householdId
    ]

    const matchesSearch = valuesToSearch.some(value =>
      (value || '').toLowerCase().includes(searchLower)
    )
    
    const matchesType = selectedType === 'all' || request.type === selectedType
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus
    
    return matchesSearch && matchesType && matchesStatus
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý yêu cầu</h1>
          <p className="mt-2 text-sm text-gray-700">
            Xem và duyệt các yêu cầu từ người dùng
          </p>
        </div>
      </div>

      {/* Sử dụng Component Filter từ nhánh Refactor */}
      <RequestFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* Requests List sử dụng Component Card */}
      <div className="mt-8 space-y-4">
        {filteredRequests.map((request) => (
          <RequestCard
            key={request.id}
            request={request}
            onView={setSelectedRequest}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {filteredRequests.length === 0 && (
        <div className="text-center py-12">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có yêu cầu nào</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || selectedType !== 'all' || selectedStatus !== 'all'
              ? 'Không tìm thấy yêu cầu phù hợp với bộ lọc.' 
              : 'Chưa có yêu cầu nào được gửi.'}
          </p>
        </div>
      )}

      {/* Request Detail Modal */}
      {selectedRequest && (
        <RequestDetailModal
          request={selectedRequest}
          onClose={() => setSelectedRequest(null)}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  )
}