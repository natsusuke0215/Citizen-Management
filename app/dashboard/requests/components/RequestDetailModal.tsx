'use client'

import { X } from 'lucide-react'

const REQUEST_TYPES = {
  HOUSEHOLD_UPDATE: 'Cập nhật hộ khẩu',
  ADD_PERSON: 'Thêm nhân khẩu',
  REMOVE_PERSON: 'Xóa nhân khẩu',
  CULTURAL_CENTER_BOOKING: 'Đặt lịch nhà văn hóa'
}

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
}

interface RequestDetailModalProps {
  request: Request
  onClose: () => void
  onStatusChange: (id: string, status: 'APPROVED' | 'REJECTED') => void
}

export default function RequestDetailModal({
  request,
  onClose,
  onStatusChange
}: RequestDetailModalProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'bg-green-100 text-green-800'
      case 'REJECTED': return 'bg-red-100 text-red-800'
      case 'PENDING': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'APPROVED': return 'Đã duyệt'
      case 'REJECTED': return 'Từ chối'
      case 'PENDING': return 'Chờ duyệt'
      default: return status
    }
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                Chi tiết yêu cầu
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Loại yêu cầu
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {REQUEST_TYPES[request.type as keyof typeof REQUEST_TYPES]}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Người gửi
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {request.user.name} ({request.user.email})
                </p>
              </div>
              
              {request.household && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Hộ khẩu
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {request.household.householdId} - {request.household.address}
                  </p>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Mô tả
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {request.description}
                </p>
              </div>
              
              {request.data && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Dữ liệu bổ sung
                  </label>
                  <pre className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded border overflow-auto">
                    {(() => {
                      try {
                        const parsed = JSON.parse(request.data)
                        return JSON.stringify(parsed, null, 2)
                      } catch {
                        return request.data
                      }
                    })()}
                  </pre>
                </div>
              )}
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trạng thái
                </label>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                  {getStatusText(request.status)}
                </span>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            {request.status === 'PENDING' && (
              <>
                <button
                  onClick={() => {
                    onStatusChange(request.id, 'APPROVED')
                    onClose()
                  }}
                  className="btn btn-primary sm:ml-3"
                >
                  Duyệt
                </button>
                <button
                  onClick={() => {
                    onStatusChange(request.id, 'REJECTED')
                    onClose()
                  }}
                  className="btn btn-danger sm:ml-3"
                >
                  Từ chối
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="btn btn-secondary mt-3 sm:mt-0"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

