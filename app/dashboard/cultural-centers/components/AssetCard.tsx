'use client'

import { memo } from 'react'
import { Edit, MapPin, Image as ImageIcon, CheckCircle, AlertCircle, Wrench } from 'lucide-react'
import { Asset } from '../types'

interface AssetCardProps {
  asset: Asset
  isAdmin: boolean
  onEdit: () => void
  selectedAmenity: string | null
}

const getConditionColor = (condition: string) => {
  switch (condition) {
    case 'GOOD':
      return 'bg-green-100 text-green-700 border-green-300'
    case 'FAIR':
      return 'bg-yellow-100 text-yellow-700 border-yellow-300'
    case 'POOR':
      return 'bg-orange-100 text-orange-700 border-orange-300'
    case 'DAMAGED':
      return 'bg-red-100 text-red-700 border-red-300'
    default:
      return 'bg-gray-100 text-gray-700 border-gray-300'
  }
}

const getConditionText = (condition: string) => {
  switch (condition) {
    case 'GOOD':
      return 'Tốt'
    case 'FAIR':
      return 'Khá'
    case 'POOR':
      return 'Kém'
    case 'DAMAGED':
      return 'Hỏng'
    default:
      return condition
  }
}

function AssetCard({ asset, isAdmin, onEdit, selectedAmenity }: AssetCardProps) {
  const brokenQuantity = (asset.poorQuantity || 0) + (asset.damagedQuantity || 0)
  const goodQty = asset.goodQuantity || 0
  const repairingQty = asset.repairingQuantity || 0
  const remainingQty = asset.quantity - goodQty - repairingQty - brokenQuantity

  return (
    <div
      className={`bg-white rounded-[12px] p-5 border shadow-sm transition-all duration-300 hover:shadow-lg ${
        selectedAmenity ? 'border-blue-100' : 'border-gray-200 hover:border-navy-1/40'
      }`}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h4 className="font-semibold text-gray-900 mb-2">{asset.name}</h4>
          {asset.category && (
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {asset.category}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {isAdmin && (
            <button
              onClick={onEdit}
              className="p-2 text-navy-1 hover:bg-navy-1/10 rounded-[8px] transition-colors"
            >
              <Edit className="h-4 w-4" />
            </button>
          )}
          <div className={`px-3 py-1 rounded-full text-xs font-medium border flex items-center gap-1.5 ${getConditionColor(asset.condition)}`}>
            {asset.condition === 'GOOD' && <CheckCircle className="h-3.5 w-3.5" />}
            {asset.condition === 'DAMAGED' && <AlertCircle className="h-3.5 w-3.5" />}
            {getConditionText(asset.condition)}
          </div>
        </div>
      </div>

      {/* Main Content: Image Left, Details Right */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Left: Image */}
        <div className="flex-shrink-0 w-full md:w-64">
          {asset.imageUrl ? (
            <div className="w-full aspect-square rounded-[10px] overflow-hidden border-2 border-gray-200 bg-gray-50">
              <img 
                src={asset.imageUrl} 
                alt={asset.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.style.display = 'none'
                  const placeholder = target.nextElementSibling as HTMLElement
                  if (placeholder) placeholder.style.display = 'flex'
                }}
              />
              <div className="hidden w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 items-center justify-center">
                <div className="text-center">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Hình ảnh {asset.name}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-[10px] flex items-center justify-center border-2 border-dashed border-gray-300">
              <div className="text-center">
                <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Hình ảnh {asset.name}</p>
                <p className="text-xs text-gray-400 mt-1">(Chưa có hình ảnh)</p>
              </div>
            </div>
          )}
        </div>

        {/* Right: Status and Description */}
        <div className="flex-1 space-y-4">
          {/* Quantity Details */}
          <div>
            <div className="text-sm font-medium text-gray-700 mb-3">Tình trạng thiết bị</div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-emerald-50 rounded-[8px] p-4 border border-emerald-200">
                <div className="text-xs text-emerald-600 font-medium mb-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Tốt
                </div>
                <div className="text-2xl font-bold text-emerald-700">{goodQty}</div>
              </div>
              <div className="bg-purple-50 rounded-[8px] p-4 border border-purple-200">
                <div className="text-xs text-purple-600 font-medium mb-2 flex items-center gap-1">
                  <Wrench className="h-4 w-4" />
                  Đang sửa chữa
                </div>
                <div className="text-2xl font-bold text-purple-700">{repairingQty}</div>
              </div>
              <div className="bg-red-50 rounded-[8px] p-4 border border-red-200">
                <div className="text-xs text-red-600 font-medium mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Hỏng/Kém
                </div>
                <div className="text-2xl font-bold text-red-700">{brokenQuantity}</div>
              </div>
            </div>
            {/* Total */}
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Tổng số lượng:</span>
                <span className="text-lg font-bold text-gray-900">{asset.quantity}</span>
              </div>
              {remainingQty !== 0 && (
                <div className="mt-1 text-xs text-orange-600">
                  ⚠️ Tổng các trạng thái ({goodQty + repairingQty + brokenQuantity}) không khớp với tổng số lượng ({asset.quantity})
                </div>
              )}
            </div>
          </div>

          {/* Location and Notes */}
          <div className="space-y-2">
            {asset.location && (
              <div className="flex items-start gap-2 text-sm text-gray-600">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{asset.location}</span>
              </div>
            )}
            {asset.notes && (
              <div className="text-sm text-gray-700 bg-gray-50 rounded-[8px] p-3 border border-gray-200">
                <div className="font-medium text-gray-900 mb-1">Mô tả:</div>
                <p className="text-gray-600">{asset.notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(AssetCard)

