'use client'

import { useState } from 'react'
import { Plus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useRequests } from './hooks/useRequests'
import { filterRequests } from './utils/filterUtils'
import { RequestFormData } from './types'
import RequestFilters from './components/RequestFilters'
import RequestsList from './components/RequestsList'
import CreateRequestModal from './components/CreateRequestModal'

export default function MyRequestsPage() {
  const { requests, loading, fetchRequests } = useRequests()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<string>('all')
  const [selectedType, setSelectedType] = useState<string>('all')
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState<RequestFormData>({
    type: 'HOUSEHOLD_UPDATE',
    description: '',
    additionalData: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.description.trim()) {
      toast.error('Mô tả yêu cầu là bắt buộc')
      return
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: formData.type,
          description: formData.description,
          data: formData.additionalData ? { additionalInfo: formData.additionalData } : null
        }),
      })

      if (response.ok) {
        toast.success('Gửi yêu cầu thành công!')
        setShowModal(false)
        setFormData({
          type: 'HOUSEHOLD_UPDATE',
          description: '',
          additionalData: ''
        })
        fetchRequests()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

  const filteredRequests = filterRequests(requests, searchTerm, selectedStatus, selectedType)

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
          <h1 className="text-2xl font-bold text-gray-900">Yêu cầu của tôi</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý các yêu cầu bạn đã gửi
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Tạo yêu cầu mới
          </button>
        </div>
      </div>

      <RequestFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
      />

      <RequestsList
        requests={filteredRequests}
        searchTerm={searchTerm}
        selectedStatus={selectedStatus}
        selectedType={selectedType}
      />

      <CreateRequestModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        formData={formData}
        setFormData={setFormData}
      />
    </div>
  )
}
