'use client'

import { memo } from 'react'
import { Building, Users, Calendar, MapPin, TreePine } from 'lucide-react'

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

interface CenterListItemProps {
  center: CulturalCenter
  index: number
  onClick: () => void
}

function CenterListItem({ center, index, onClick }: CenterListItemProps) {
  const amenities = center.amenities ? JSON.parse(center.amenities) : []

  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 border border-gray-100 overflow-hidden animate-slideUp cursor-pointer"
      style={{ animationDelay: `${(index % 9) * 0.05}s` }}
    >
      <div className="p-6 flex items-start gap-6">
        {/* Icon */}
        {center.building === 'Khuôn viên' ? (
          <div className="p-4 rounded-[12px] bg-gradient-to-br from-green-500 to-green-600 shadow-drop flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <TreePine className="h-6 w-6 text-white" />
          </div>
        ) : (
          <div className="p-4 rounded-[12px] bg-gradient-to-br from-navy-1 to-navy-2 shadow-drop flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
            <Building className="h-6 w-6 text-white" />
          </div>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-4 mb-3">
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 group-hover:text-navy-1 transition-colors mb-2">
                {center.name}
              </h3>
              {center.description && (
                <p className="text-sm text-gray-600 mb-3">{center.description}</p>
              )}
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-navy-1/10 rounded-[8px] border border-navy-1/20">
              <Users className="h-4 w-4 text-navy-1" />
              <span className="text-sm font-semibold text-navy-1">
                {center.building === 'Khuôn viên' 
                  ? `${center.capacity.toLocaleString()} người chơi` 
                  : `${center.capacity.toLocaleString()} người`}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <MapPin className="h-4 w-4 text-navy-1" />
              <span>{center.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Calendar className="h-4 w-4 text-navy-1" />
              <span>{center._count.bookings} lượt đặt</span>
            </div>
            {amenities.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {amenities.slice(0, 3).map((amenity: string, idx: number) => (
                  <span
                    key={idx}
                    className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-navy-1/10 to-navy-2/10 text-navy-1 border border-navy-1/20"
                  >
                    {amenity}
                  </span>
                ))}
                {amenities.length > 3 && (
                  <span className="text-xs text-gray-500">+{amenities.length - 3}</span>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(CenterListItem)

