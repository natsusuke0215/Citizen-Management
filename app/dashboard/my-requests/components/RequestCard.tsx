'use client'

import { FileText } from 'lucide-react'
import { Request, REQUEST_TYPES } from '../types'
import { getStatusColor, getStatusText, getStatusIcon } from '../utils/statusUtils'

interface RequestCardProps {
  request: Request
}

export default function RequestCard({ request }: RequestCardProps) {
  const StatusIcon = getStatusIcon(request.status)

  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-lg bg-primary-100">
              <FileText className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              {REQUEST_TYPES[request.type as keyof typeof REQUEST_TYPES]}
            </h3>
            <p className="text-sm text-gray-500">
              {request.description}
            </p>
            {request.household && (
              <p className="text-sm text-gray-500">
                Hộ khẩu: {request.household.householdId} - {request.household.address}
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <StatusIcon className={`h-5 w-5 ${
            request.status === 'APPROVED' ? 'text-green-600' :
            request.status === 'REJECTED' ? 'text-red-600' :
            'text-yellow-600'
          }`} />
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
            {getStatusText(request.status)}
          </span>
        </div>
      </div>
      
      <div className="mt-4 flex items-center justify-between">
        <div className="text-xs text-gray-500">
          Tạo lúc: {new Date(request.createdAt).toLocaleString('vi-VN')}
          {request.updatedAt !== request.createdAt && (
            <span className="ml-2">
              - Cập nhật: {new Date(request.updatedAt).toLocaleString('vi-VN')}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

