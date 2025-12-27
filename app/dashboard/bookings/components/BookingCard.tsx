'use client'

import { Calendar, Building, Clock, User, Eye, EyeOff, Edit, Trash2 } from 'lucide-react'
import { Booking } from '../types'
import { formatDateTime } from '../utils/dateUtils'
import { getStatusInfo } from '../utils/statusUtils'

interface BookingCardProps {
  booking: Booking
  onEdit: (booking: Booking) => void
  onDelete: (id: string) => void
}

export default function BookingCard({ booking, onEdit, onDelete }: BookingCardProps) {
  const statusInfo = getStatusInfo(booking.status)
  const StatusIcon = statusInfo.icon
  const startDateTime = formatDateTime(booking.startTime)
  const endDateTime = formatDateTime(booking.endTime)
  const createdDateTime = formatDateTime(booking.createdAt)

  return (
    <div className="group relative bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">
      {/* Status Badge */}
      <div className={`absolute top-4 right-4 ${statusInfo.bgColor} ${statusInfo.borderColor} border rounded-[8px] px-3 py-1.5 flex items-center gap-2`}>
        <StatusIcon className={`h-4 w-4 ${statusInfo.color}`} />
        <span className={`text-xs font-semibold ${statusInfo.color}`}>
          {statusInfo.label}
        </span>
      </div>

      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4 pr-24">
          <div className="p-4 rounded-[12px] bg-gradient-to-br from-navy-1 to-navy-2 shadow-drop group-hover:scale-110 transition-transform duration-300 flex-shrink-0">
            <Calendar className="h-7 w-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-xl font-bold text-gray-900 group-hover:text-navy-1 transition-colors mb-2">
              {booking.title}
            </h3>
            <div className="flex items-center gap-2 mb-2">
              <Building className="h-4 w-4 text-navy-1" />
              <span className="text-sm font-medium text-gray-700">
                {booking.culturalCenter.name}
              </span>
            </div>
            {booking.description && (
              <p className="text-sm text-gray-600 line-clamp-2 mt-2">
                {booking.description}
              </p>
            )}
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Time */}
          <div className="p-3 bg-yellow-2 rounded-[8px] border border-yellow-1">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-navy-1 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Thời gian</div>
                <div className="text-sm font-semibold text-gray-900">
                  {startDateTime.date} {startDateTime.time}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  đến {endDateTime.date} {endDateTime.time}
                </div>
              </div>
            </div>
          </div>

          {/* User */}
          <div className="p-3 bg-gray-50 rounded-[8px] border border-gray-200">
            <div className="flex items-start gap-2">
              <User className="h-4 w-4 text-navy-1 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-xs text-gray-500 mb-1">Người đặt</div>
                <div className="text-sm font-semibold text-gray-900">
                  {booking.user.name}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Tạo lúc: {createdDateTime.full}</span>
            </div>
            <div className="flex items-center gap-1">
              {booking.visibility === 'PUBLIC' ? (
                <>
                  <Eye className="h-3 w-3 text-green-600" />
                  <span className="text-green-600">Công khai</span>
                </>
              ) : (
                <>
                  <EyeOff className="h-3 w-3 text-gray-400" />
                  <span>Riêng tư</span>
                </>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => onEdit(booking)}
              className="p-2 text-navy-1 hover:bg-navy-1/10 rounded-[6px] transition-all duration-200 hover:scale-110"
              title="Chỉnh sửa"
            >
              <Edit className="h-5 w-5" />
            </button>
            <button
              onClick={() => onDelete(booking.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-[6px] transition-all duration-200 hover:scale-110"
              title="Xóa"
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

