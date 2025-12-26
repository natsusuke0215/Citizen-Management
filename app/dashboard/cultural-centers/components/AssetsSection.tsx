'use client'

import { memo, useState } from 'react'
import { Package, X } from 'lucide-react'
import { useAssets } from '../hooks/useAssets'
import AssetCard from './AssetCard'
import EditAssetModal from './EditAssetModal'

interface AssetsSectionProps {
  centerId: string
  selectedAmenity: string | null
  onClearAmenity: () => void
  isAdmin: boolean
}

function AssetsSection({ centerId, selectedAmenity, onClearAmenity, isAdmin }: AssetsSectionProps) {
  const { assets, loading, getAssetsByAmenity, refetch } = useAssets(centerId)
  const [editingAsset, setEditingAsset] = useState<any>(null)

  const displayAssets = selectedAmenity ? getAssetsByAmenity(selectedAmenity) : assets

  return (
    <>
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Package className="h-5 w-5 text-navy-1" />
            {selectedAmenity ? `Chi tiết: ${selectedAmenity}` : 'Chi tiết thiết bị'}
            {loading && <span className="text-sm font-normal text-gray-500">(Đang tải...)</span>}
          </h3>
          {selectedAmenity && (
            <button
              onClick={onClearAmenity}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-1"></div>
          </div>
        ) : displayAssets.length > 0 ? (
          <div className="space-y-4">
            {displayAssets.map((asset) => (
              <AssetCard
                key={asset.id}
                asset={asset}
                isAdmin={isAdmin}
                onEdit={() => setEditingAsset(asset)}
                selectedAmenity={selectedAmenity}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-[12px] border border-gray-200">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">
              {selectedAmenity 
                ? `Chưa có thiết bị liên quan đến "${selectedAmenity}"` 
                : 'Chưa có thiết bị được đăng ký'}
            </p>
          </div>
        )}
      </div>

      {editingAsset && (
        <EditAssetModal
          asset={editingAsset}
          centerId={centerId}
          onClose={() => setEditingAsset(null)}
          onUpdate={() => {
            setEditingAsset(null)
            refetch()
          }}
        />
      )}
    </>
  )
}

export default memo(AssetsSection)

