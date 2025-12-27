'use client'

import { useState, useEffect } from 'react'
import { AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import RequestFilters from './components/RequestFilters'
import RequestCard from './components/RequestCard'
import RequestDetailModal from './components/RequestDetailModal'

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
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
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

  const handleStatusChange = async (id: string, status: 'APPROVED' | 'REJECTED') => {
    try {
      const response = await fetch(`/api/requests/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      })

      if (response.ok) {
        toast.success(`Yêu cầu đã được ${status === 'APPROVED' ? 'duyệt' : 'từ chối'}!`)
        fetchRequests()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

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
    
    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus
    const matchesType = selectedType === 'all' || request.type === selectedType
    
    return matchesSearch && matchesStatus && matchesType
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

      {/* Filters */}
      <RequestFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      {/* Requests List */}
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
            {searchTerm || selectedStatus !== 'all' || selectedType !== 'all'
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
