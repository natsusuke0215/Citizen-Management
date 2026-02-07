'use client'

import { Plus, X, Eye, Clock, FileText } from 'lucide-react'

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

interface RequestCardProps {
  request: Request
  onView: (request: Request) => void
  onStatusChange: (id: string, status: 'APPROVED' | 'REJECTED') => void
}

export default function RequestCard({
  request,
  onView,
  onStatusChange
}: RequestCardProps) {
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'HOUSEHOLD_UPDATE': return FileText
      case 'ADD_PERSON': return Plus
      case 'REMOVE_PERSON': return X
      case 'CULTURAL_CENTER_BOOKING': return Clock
      default: return FileText
    }
  }

  const TypeIcon = getTypeIcon(request.type)

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-lg bg-primary-100">
              <TypeIcon className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
              {REQUEST_TYPES[request.type as keyof typeof REQUEST_TYPES]}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {request.user.name} - {request.user.email}
            </p>
            {request.household && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Hộ khẩu: {request.household.householdId} - {request.household.address}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {getStatusText(request.status)}
          </span>
          <button
            onClick={() => onView(request)}
            className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-300"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-600 dark:text-gray-300">{request.description}</p>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Tạo lúc: {new Date(request.createdAt).toLocaleString('vi-VN')}
          {request.updatedAt !== request.createdAt && (
            <span className="ml-2">
              - Cập nhật: {new Date(request.updatedAt).toLocaleString('vi-VN')}
            </span>
          )}
        </div>
        {request.status === 'PENDING' && (
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onStatusChange(request.id, 'APPROVED')}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              <Plus className="h-4 w-4 mr-1" />
              Duyệt
            </button>
            <button
              onClick={() => onStatusChange(request.id, 'REJECTED')}
              className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <X className="h-4 w-4 mr-1" />
              Từ chối
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

