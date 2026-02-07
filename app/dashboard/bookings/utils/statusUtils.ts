import { CheckCircle, XCircle, Hourglass } from 'lucide-react'
import { Booking } from '../types'

export interface StatusInfo {
  color: string
  bgColor: string
  borderColor: string
  icon: typeof CheckCircle
  label: string
}

export const getStatusInfo = (status: string): StatusInfo => {
  switch (status) {
    case 'APPROVED':
      return {
        color: 'text-emerald-700',
        bgColor: 'bg-emerald-50',
        borderColor: 'border-emerald-200',
        icon: CheckCircle,
        label: 'Đã duyệt'
      }
    case 'REJECTED':
      return {
        color: 'text-rose-700',
        bgColor: 'bg-rose-50',
        borderColor: 'border-rose-200',
        icon: XCircle,
        label: 'Đã từ chối'
      }
    case 'PENDING':
    default:
      return {
        color: 'text-amber-700',
        bgColor: 'bg-amber-50',
        borderColor: 'border-amber-200',
        icon: Hourglass,
        label: 'Chờ duyệt'
      }
  }
}

