'use client'

import { Calendar, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface StatisticsCardsProps {
  totalBookings: number
  pendingBookings: number
  approvedBookings: number
  rejectedBookings: number
}

export default function StatisticsCards({
  totalBookings,
  pendingBookings,
  approvedBookings,
  rejectedBookings
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="group relative overflow-hidden bg-gradient-to-br from-navy-1 to-navy-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <Calendar className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{totalBookings}</div>
          <div className="text-sm opacity-90">Tổng số lịch đặt</div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-navy-1 opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-navy-1 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-navy-1 bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <AlertCircle className="h-6 w-6 text-navy-1" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{pendingBookings}</div>
          <div className="text-sm opacity-90 text-navy-2">Chờ duyệt</div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <CheckCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{approvedBookings}</div>
          <div className="text-sm opacity-90">Đã duyệt</div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-rose-400 to-rose-500 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.4s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <XCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{rejectedBookings}</div>
          <div className="text-sm opacity-90">Đã từ chối</div>
        </div>
      </div>
    </div>
  )
}

