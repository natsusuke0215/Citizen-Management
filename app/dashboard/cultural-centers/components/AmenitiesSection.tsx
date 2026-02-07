'use client'

import { memo, useState } from 'react'
import { Star, CheckCircle, Monitor, Volume2, Wind, Wifi, Zap, Sparkles } from 'lucide-react'
import { useAssets } from '../hooks/useAssets'

interface AmenitiesSectionProps {
  amenities: string[]
  centerId: string
  selectedAmenity: string | null
  onAmenityClick: (amenity: string | null) => void
}

const getAmenityIcon = (amenity: string) => {
  const lower = amenity.toLowerCase()
  if (lower.includes('máy chiếu') || lower.includes('projector')) return <Monitor className="h-4 w-4" />
  if (lower.includes('âm thanh') || lower.includes('loa') || lower.includes('sound')) return <Volume2 className="h-4 w-4" />
  if (lower.includes('điều hòa') || lower.includes('air')) return <Wind className="h-4 w-4" />
  if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="h-4 w-4" />
  if (lower.includes('đèn') || lower.includes('light')) return <Zap className="h-4 w-4" />
  return <Sparkles className="h-4 w-4" />
}

function AmenitiesSection({ amenities, centerId, selectedAmenity, onAmenityClick }: AmenitiesSectionProps) {
  const { getAssetsByAmenity } = useAssets(centerId)

  const handleAmenityClick = (amenity: string) => {
    if (selectedAmenity === amenity) {
      onAmenityClick(null)
    } else {
      onAmenityClick(amenity)
    }
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
        <Star className="h-5 w-5 text-yellow-500" />
        Tiện ích & Thiết bị
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
        {amenities.map((amenity, index) => {
          const relatedAssets = getAssetsByAmenity(amenity)
          const isSelected = selectedAmenity === amenity
          return (
            <div
              key={index}
              onClick={() => handleAmenityClick(amenity)}
              className={`group relative bg-gradient-to-br from-navy-1/5 to-navy-2/5 rounded-[12px] p-4 border transition-all duration-300 hover:-translate-y-1 cursor-pointer ${
                isSelected 
                  ? 'border-navy-1 shadow-lg bg-gradient-to-br from-navy-1/20 to-navy-2/20 ring-2 ring-navy-1/30' 
                  : 'border-navy-1/20 hover:border-navy-1/40 hover:shadow-lg'
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-[8px] text-navy-1 transition-all duration-300 ${
                  isSelected ? 'bg-navy-1/30 scale-110' : 'bg-navy-1/10 group-hover:bg-navy-1/20 group-hover:scale-110'
                }`}>
                  {getAmenityIcon(amenity)}
                </div>
                <span className={`text-sm font-medium transition-colors ${
                  isSelected ? 'text-navy-1 font-semibold' : 'text-gray-700 group-hover:text-navy-1'
                }`}>{amenity}</span>
              </div>
              <div className="absolute top-2 right-2">
                {relatedAssets.length > 0 ? (
                  <span className="text-xs bg-navy-1 text-white px-2 py-0.5 rounded-full">
                    {relatedAssets.length}
                  </span>
                ) : (
                  <CheckCircle className={`h-4 w-4 text-green-500 transition-opacity duration-300 ${
                    isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                  }`} />
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(AmenitiesSection)

