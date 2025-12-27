'use client'

import { Users, UserPlus, TrendingUp, AlertCircle } from 'lucide-react'

interface PersonStatisticsProps {
  totalPersons: number
  activePersons: number
  movedOutPersons: number
  deceasedPersons: number
}

export default function PersonStatistics({
  totalPersons,
  activePersons,
  movedOutPersons,
  deceasedPersons
}: PersonStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="group relative overflow-hidden bg-gradient-to-br from-navy-1 to-navy-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{totalPersons}</div>
          <div className="text-sm opacity-90">Tổng số nhân khẩu</div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <UserPlus className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{activePersons}</div>
          <div className="text-sm opacity-90">Đang thường trú</div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-amber-400 to-amber-500 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{movedOutPersons}</div>
          <div className="text-sm opacity-90">Đã chuyển đi</div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-gray-400 to-gray-500 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.4s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <AlertCircle className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{deceasedPersons}</div>
          <div className="text-sm opacity-90">Đã qua đời</div>
        </div>
      </div>
    </div>
  )
}

