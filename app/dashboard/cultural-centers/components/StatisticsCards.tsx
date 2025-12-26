'use client'

import { memo } from 'react'
import { Building, Users, Calendar, Activity, TreePine, Sparkles, TrendingUp } from 'lucide-react'

interface StatisticsCardsProps {
  totalCenters: number
  totalCapacity: number
  totalBookings: number
  indoorCenters: number
  outdoorCenters: number
  totalAmenities: number
  avgAmenities: number
  avgBookingsPerCenter: number
}

function StatisticsCards({
  totalCenters,
  totalCapacity,
  totalBookings,
  indoorCenters,
  outdoorCenters,
  totalAmenities,
  avgAmenities,
  avgBookingsPerCenter
}: StatisticsCardsProps) {
  return (
    <>
      {/* Main Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden bg-gradient-to-br from-navy-1 to-navy-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <Building className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalCenters}</div>
            <div className="text-sm opacity-90">Tổng số nhà văn hóa</div>
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
            <div className="text-3xl font-bold mb-1">{totalCapacity.toLocaleString()}</div>
            <div className="text-sm opacity-90">Tổng sức chứa</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-navy-3 to-navy-1 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalBookings}</div>
            <div className="text-sm opacity-90">Tổng lượt đặt</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-navy-1 opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-navy-1 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-navy-1 bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <Activity className="h-6 w-6 text-navy-1" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{indoorCenters}</div>
            <div className="text-sm opacity-90 text-navy-2">Phòng trong nhà</div>
          </div>
        </div>
      </div>

      {/* Additional Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="group relative overflow-hidden bg-gradient-to-br from-green-500 to-green-600 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.5s' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <TreePine className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{outdoorCenters}</div>
            <div className="text-sm opacity-90">Sân ngoài trời</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.6s' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <Sparkles className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalAmenities}</div>
            <div className="text-sm opacity-90">Tổng tiện ích</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-orange-500 to-orange-600 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.7s' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{avgAmenities}</div>
            <div className="text-sm opacity-90">TB tiện ích/phòng</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-teal-500 to-teal-600 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1 animate-slideUp" style={{ animationDelay: '0.8s' }}>
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{avgBookingsPerCenter}</div>
            <div className="text-sm opacity-90">TB lượt đặt/phòng</div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(StatisticsCards)

