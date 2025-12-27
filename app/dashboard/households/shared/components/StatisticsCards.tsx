'use client'

import { Home, Users, TrendingUp } from 'lucide-react'

interface StatisticsCardsProps {
  totalHouseholds: number
  totalMembers: number
  avgMembersPerHousehold: string
}

export default function StatisticsCards({
  totalHouseholds,
  totalMembers,
  avgMembersPerHousehold
}: StatisticsCardsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="group relative overflow-hidden bg-gradient-to-br from-navy-1 to-navy-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.1s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <Home className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{totalHouseholds}</div>
          <div className="text-sm opacity-90">Tổng số hộ khẩu</div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-navy-2 to-navy-3 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.2s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-white relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{totalMembers}</div>
          <div className="text-sm opacity-90">Tổng số thành viên</div>
        </div>
      </div>

      <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.3s' }}>
        <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
        <div className="p-5 text-navy-1 relative">
          <div className="flex items-center justify-between mb-3">
            <div className="p-2.5 bg-navy-1 bg-opacity-10 rounded-[8px] backdrop-blur-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1">{avgMembersPerHousehold}</div>
          <div className="text-sm opacity-90">Trung bình thành viên/hộ</div>
        </div>
      </div>
    </div>
  )
}

