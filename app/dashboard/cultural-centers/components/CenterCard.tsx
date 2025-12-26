'use client'

import { memo } from 'react'
import { Building, Users, Calendar, MapPin, Sparkles, TreePine } from 'lucide-react'

interface CulturalCenter {
  id: string
  name: string
  description: string | null
  capacity: number
  location: string
  building: string
  amenities: string | null
  _count: {
    bookings: number
  }
}

interface CenterCardProps {
  center: CulturalCenter
  index: number
  onClick: () => void
}

function CenterCard({ center, index, onClick }: CenterCardProps) {
  const amenities = center.amenities ? JSON.parse(center.amenities) : []

  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 animate-slideUp cursor-pointer"
      style={{ animationDelay: `${(index % 9) * 0.05}s` }}
    >
      {/* Decorative gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-navy-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      
      <div className="relative p-6">
        {/* Header with Icon */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-4">
            {center.building === 'Khuôn viên' ? (
              <div className="p-4 rounded-[12px] bg-gradient-to-br from-green-500 to-green-600 shadow-drop group-hover:scale-110 transition-transform duration-300">
                <TreePine className="h-7 w-7 text-white" />
              </div>
            ) : (
              <div className="p-4 rounded-[12px] bg-gradient-to-br from-navy-1 to-navy-2 shadow-drop group-hover:scale-110 transition-transform duration-300">
                <Building className="h-7 w-7 text-white" />
              </div>
            )}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-navy-1 transition-colors">
                {center.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Users className="h-4 w-4 text-gray-400" />
                <span className="text-sm text-gray-600">
                  {center.building === 'Khuôn viên' 
                    ? `Tối đa ${center.capacity.toLocaleString()} người chơi` 
                    : `Tối đa ${center.capacity.toLocaleString()} người`}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Description */}
        {center.description && (
          <div className="mb-4">
            <p className="text-sm text-gray-600 line-clamp-2">{center.description}</p>
          </div>
        )}

        {/* Location */}
        <div className="mb-4 p-3 bg-yellow-2 rounded-[8px] border border-yellow-1">
          <div className="flex items-start gap-2">
            <MapPin className="h-4 w-4 text-navy-1 mt-0.5 flex-shrink-0" />
            <span className="text-sm text-gray-700">{center.location}</span>
          </div>
        </div>

        {/* Bookings Count */}
        <div className="mb-4 flex items-center justify-between p-3 bg-gray-50 rounded-[8px]">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-navy-1" />
            <span className="text-sm text-gray-600">Lượt đặt</span>
          </div>
          <span className="text-lg font-bold text-navy-1">{center._count.bookings}</span>
        </div>

        {/* Amenities */}
        {amenities.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex flex-wrap gap-2">
              {amenities.map((amenity: string, idx: number) => (
                <span
                  key={idx}
                  className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-gradient-to-r from-navy-1/10 to-navy-2/10 text-navy-1 border border-navy-1/20 hover:from-navy-1/20 hover:to-navy-2/20 transition-all duration-200"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  {amenity}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(CenterCard)

