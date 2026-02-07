'use client'

import { Calendar, Building, Clock, User, Edit, Trash2 } from 'lucide-react'
import { Booking } from '../types'
import { formatDateTime } from '../utils/dateUtils'

interface BookingCardProps {
  booking: Booking
  onEdit: (booking: Booking) => void
  onDelete: (id: string) => void
}

export default function BookingCard({ booking, onEdit, onDelete }: BookingCardProps) {
  const startDateTime = formatDateTime(booking.startTime)
  const endDateTime = formatDateTime(booking.endTime)
  const createdDateTime = formatDateTime(booking.createdAt)

  return (
    <div className="group relative bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-100">

      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

      <div className="relative p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
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
          {/* Event time (start / end) */}
          <div className="p-3 bg-yellow-2 rounded-[8px] border border-yellow-1">
            <div className="flex items-start gap-2">
              <Clock className="h-4 w-4 text-navy-1 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <div className="text-sm text-gray-900 mb-1">
                  Thời gian bắt đầu: <span className="font-semibold">{startDateTime.date} {startDateTime.time}</span>
                </div>
                <div className="text-sm text-gray-900">
                  Thời gian kết thúc: <span className="font-semibold">{endDateTime.date} {endDateTime.time}</span>
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
                  {booking.bookerName ? booking.bookerName : booking.user.name}
                </div>
                {booking.bookerPhone && (
                  <div className="text-xs text-gray-500 mt-1">{booking.bookerPhone}</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>Thời điểm đặt: {createdDateTime.full}</span>
            </div>
          </div>
          <div />
        </div>
      </div>
    </div>
  )
}

