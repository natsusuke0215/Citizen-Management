'use client'

import { FileText } from 'lucide-react'
import { Request } from '../types'
import RequestCard from './RequestCard'

interface RequestsListProps {
  requests: Request[]
  searchTerm: string
  selectedStatus: string
  selectedType: string
}

export default function RequestsList({
  requests,
  searchTerm,
  selectedStatus,
  selectedType
}: RequestsListProps) {
  if (requests.length === 0) {
    return (
      <div className="text-center py-12">
        <FileText className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Không có yêu cầu nào</h3>
        <p className="mt-1 text-sm text-gray-500">
          {searchTerm || selectedStatus !== 'all' || selectedType !== 'all'
            ? 'Không tìm thấy yêu cầu phù hợp với bộ lọc.' 
            : 'Bạn chưa tạo yêu cầu nào. Hãy tạo yêu cầu đầu tiên!'}
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8 space-y-4">
      {requests.map((request) => (
        <RequestCard key={request.id} request={request} />
      ))}
    </div>
  )
}

