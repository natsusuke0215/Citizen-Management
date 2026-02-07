'use client'

import { Users, TrendingUp, MapPin } from 'lucide-react'
import AnimatedCounter from '../../components/AnimatedCounter'

interface StatsSummaryProps {
  total: number
  genderStats: {
    'Nam': number
    'Nữ': number
    'Khác': number
  }
  ageGroups: {
    '0-17': number
    '18-30': number
    '31-50': number
    '51-65': number
    '65+': number
  }
}

export default function StatsSummary({ total, genderStats, ageGroups }: StatsSummaryProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Count */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-navy-1 to-navy-2 rounded-[20px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="p-6 text-white relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-[10px] backdrop-blur-sm">
              <Users className="h-6 w-6" />
            </div>
          </div>
          <div className="text-4xl font-bold mb-2">
            <AnimatedCounter value={total} />
          </div>
          <div className="text-sm opacity-90">Tổng số nhân khẩu</div>
        </div>
      </div>

      {/* Gender Summary */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-navy-3 to-navy-2 rounded-[20px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="p-6 text-white relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-[10px] backdrop-blur-sm">
              <TrendingUp className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Nam</span>
              <span className="text-2xl font-bold"><AnimatedCounter value={genderStats['Nam']} /></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm opacity-90">Nữ</span>
              <span className="text-2xl font-bold"><AnimatedCounter value={genderStats['Nữ']} /></span>
            </div>
          </div>
        </div>
      </div>

      {/* Age Groups Summary */}
      <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[20px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
        <div className="absolute top-0 right-0 w-32 h-32 bg-navy-1 opacity-10 rounded-full -mr-16 -mt-16"></div>
        <div className="p-6 text-navy-1 relative">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-navy-1 bg-opacity-20 rounded-[10px]">
              <MapPin className="h-6 w-6" />
            </div>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="font-medium">0-17 tuổi</span>
              <span className="text-xl font-bold"><AnimatedCounter value={ageGroups['0-17']} /></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">18-30 tuổi</span>
              <span className="text-xl font-bold"><AnimatedCounter value={ageGroups['18-30']} /></span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">31-50 tuổi</span>
              <span className="text-xl font-bold"><AnimatedCounter value={ageGroups['31-50']} /></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

