'use client'

import { memo } from 'react'
import { Sparkles, Clock } from 'lucide-react'

interface DashboardHeaderProps {
  currentTime: Date
}

function DashboardHeader({ currentTime }: DashboardHeaderProps) {
  return (
    <div className="relative overflow-hidden bg-gradient-to-br from-navy-1 via-navy-2 to-navy-3 rounded-[20px] shadow-drop-lg p-8 text-white">
      <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
      <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -ml-36 -mb-36"></div>
      <div className="relative z-10">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 bg-white bg-opacity-20 rounded-[12px] backdrop-blur-sm animate-pulse">
                <Sparkles className="h-8 w-8" />
              </div>
              <h1 className="text-4xl font-bold">Tổng quan hệ thống</h1>
            </div>
            <p className="text-lg opacity-90 mb-2">
              Thống kê tổng quan về hệ thống quản lý nhân khẩu và nhà văn hóa
            </p>
            <div className="flex items-center gap-2 text-sm opacity-80">
              <Clock className="h-4 w-4" />
              <span>
                {currentTime.toLocaleDateString('vi-VN', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })} • {currentTime.toLocaleTimeString('vi-VN', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(DashboardHeader)

