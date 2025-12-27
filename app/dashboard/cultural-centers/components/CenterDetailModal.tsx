'use client'

import { memo, useState, useEffect } from 'react'
import { X, Building, Users, MapPin, Calendar, Sparkles, TreePine, Image as ImageIcon } from 'lucide-react'
import { CulturalCenter } from '../types'
import AmenitiesSection from './AmenitiesSection'
import AssetsSection from './AssetsSection'

interface CenterDetailModalProps {
  center: CulturalCenter
  onClose: () => void
  isAdmin: boolean
}

function CenterDetailModal({ center, onClose, isAdmin }: CenterDetailModalProps) {
  const [imageLoadError, setImageLoadError] = useState(false)
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null)

  const normalizeImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    if (!url.startsWith('/')) {
      return '/' + url
    }
    return url
  }

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [onClose])

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[20px] shadow-2xl overflow-hidden animate-slideUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
        >
          <X className="h-5 w-5 text-gray-600" />
        </button>

        {/* Scrollable Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Hero Image Section */}
          <div className="relative h-64 bg-gradient-to-br from-navy-1 via-navy-2 to-navy-3 overflow-hidden">
            {normalizeImageUrl(center.imageUrl) && !imageLoadError ? (
              <>
                <img 
                  src={normalizeImageUrl(center.imageUrl) || ''} 
                  alt={center.name}
                  className="absolute inset-0 w-full h-full object-cover"
                  onError={() => setImageLoadError(true)}
                  onLoad={() => setImageLoadError(false)}
                />
                <div className="absolute inset-0 bg-black/40"></div>
              </>
            ) : (
              <>
                <div className="absolute inset-0 bg-black/20"></div>
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                  <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  {center.building === 'Khuôn viên' ? (
                    <div className="relative">
                      <TreePine className="h-32 w-32 text-white/30 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-white/20" />
                      </div>
                    </div>
                  ) : (
                    <div className="relative">
                      <Building className="h-32 w-32 text-white/30 animate-pulse" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-white/20" />
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <div className="flex items-center gap-4 mb-4">
                {center.building === 'Khuôn viên' ? (
                  <div className="p-4 rounded-[12px] bg-white/20 backdrop-blur-sm">
                    <TreePine className="h-8 w-8" />
                  </div>
                ) : (
                  <div className="p-4 rounded-[12px] bg-white/20 backdrop-blur-sm">
                    <Building className="h-8 w-8" />
                  </div>
                )}
                <div>
                  <h2 className="text-3xl font-bold mb-2">{center.name}</h2>
                  <div className="flex items-center gap-4 text-sm opacity-90">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      <span>{center.building === 'Khuôn viên' ? `${center.capacity} người chơi` : `${center.capacity} người`}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span>{center.location}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>{center._count.bookings} lượt đặt</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-8 space-y-8">
            {/* Description */}
            {center.description && (
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-[15px] p-6 border border-gray-100">
                <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-navy-1" />
                  Mô tả
                </h3>
                <p className="text-gray-700 leading-relaxed">{center.description}</p>
              </div>
            )}

            {/* Amenities Section */}
            {center.amenities && (
              <AmenitiesSection
                amenities={JSON.parse(center.amenities)}
                centerId={center.id}
                selectedAmenity={selectedAmenity}
                onAmenityClick={setSelectedAmenity}
              />
            )}

            {/* Assets Section */}
            <AssetsSection
              centerId={center.id}
              selectedAmenity={selectedAmenity}
              onClearAmenity={() => setSelectedAmenity(null)}
              isAdmin={isAdmin}
            />

            {/* Additional Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {center.floor !== null && (
                <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px] p-4 border border-blue-200">
                  <div className="text-sm text-blue-600 font-medium mb-1">Tầng</div>
                  <div className="text-xl font-bold text-blue-900">{center.floor}</div>
                </div>
              )}
              {center.room && (
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-[12px] p-4 border border-purple-200">
                  <div className="text-sm text-purple-600 font-medium mb-1">Phòng</div>
                  <div className="text-xl font-bold text-purple-900">{center.room}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(CenterDetailModal)

