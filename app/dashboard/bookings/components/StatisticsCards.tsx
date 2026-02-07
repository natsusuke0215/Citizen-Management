'use client'

import { Calendar } from 'lucide-react'

interface StatisticsCardsProps {
  totalBookings: number
}

export default function StatisticsCards({
  totalBookings
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-1 lg:grid-cols-1">
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
    </div>
  )
}

