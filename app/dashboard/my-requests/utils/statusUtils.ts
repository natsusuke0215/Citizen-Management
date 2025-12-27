import { Check, X, Clock, AlertCircle } from 'lucide-react'

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'APPROVED': return 'bg-green-100 text-green-800'
    case 'REJECTED': return 'bg-red-100 text-red-800'
    case 'PENDING': return 'bg-yellow-100 text-yellow-800'
    default: return 'bg-gray-100 text-gray-800'
  }
}

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'APPROVED': return 'Đã duyệt'
    case 'REJECTED': return 'Từ chối'
    case 'PENDING': return 'Chờ duyệt'
    default: return status
  }
}

export const getStatusIcon = (status: string) => {
  switch (status) {
    case 'APPROVED': return Check
    case 'REJECTED': return X
    case 'PENDING': return Clock
    default: return AlertCircle
  }
}

