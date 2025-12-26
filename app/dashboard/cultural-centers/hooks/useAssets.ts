import { useState, useEffect, useMemo } from 'react'
import toast from 'react-hot-toast'
import { Asset } from '../types'

const keywordMap: { [key: string]: string[] } = {
  'máy chiếu': ['máy chiếu', 'projector', 'màn chiếu'],
  'âm thanh': ['âm thanh', 'loa', 'speaker', 'sound', 'micro', 'mic'],
  'micro không dây': ['micro', 'mic', 'microphone', 'không dây', 'wireless'],
  'điều hòa': ['điều hòa', 'air', 'conditioner', 'ac', 'máy lạnh'],
  'wifi': ['wifi', 'internet', 'mạng', 'network'],
  'màn hình led': ['màn hình', 'led', 'screen', 'display', 'màn hình led'],
  'sân khấu': ['sân khấu', 'stage', 'platform'],
  'bàn ghế': ['bàn', 'ghế', 'table', 'chair', 'bàn ghế'],
  'bàn ghế di động': ['bàn', 'ghế', 'di động', 'table', 'chair', 'mobile'],
  'đèn': ['đèn', 'light', 'lamp', 'chiếu sáng'],
  'bảng trắng': ['bảng', 'whiteboard', 'board'],
  'tủ sách': ['tủ sách', 'bookshelf', 'shelf'],
  'máy tính': ['máy tính', 'computer', 'pc', 'laptop'],
  'gương tập': ['gương', 'mirror'],
  'sàn gỗ': ['sàn', 'floor', 'wood'],
  'hệ thống âm thanh': ['âm thanh', 'loa', 'speaker', 'sound', 'hệ thống'],
  'lưới cầu lông': ['lưới', 'net', 'cầu lông', 'badminton'],
  'lưới bóng chuyền': ['lưới', 'net', 'bóng chuyền', 'volleyball'],
  'vợt cầu lông': ['vợt', 'racket', 'cầu lông'],
  'bóng chuyền': ['bóng', 'ball', 'bóng chuyền', 'volleyball'],
  'cầu lông': ['cầu lông', 'badminton', 'shuttlecock'],
  'đèn chiếu sáng': ['đèn', 'light', 'lamp', 'chiếu sáng'],
  'ghế ngồi': ['ghế', 'chair', 'ngồi'],
  'mái che': ['mái', 'che', 'roof', 'cover']
}

export function useAssets(centerId: string | null) {
  const [assets, setAssets] = useState<Asset[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (centerId) {
      fetchAssets()
    } else {
      setAssets([])
    }
  }, [centerId])

  const fetchAssets = async () => {
    if (!centerId) return
    
    setLoading(true)
    try {
      const response = await fetch(`/api/cultural-centers/${centerId}/assets`)
      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách thiết bị')
    } finally {
      setLoading(false)
    }
  }

  const getAssetsByAmenity = useMemo(() => {
    return (amenity: string): Asset[] => {
      const amenityLower = amenity.toLowerCase()
      const keywords = keywordMap[amenityLower] || [amenityLower]
      
      return assets.filter(asset => {
        const assetNameLower = asset.name.toLowerCase()
        const assetCategoryLower = asset.category?.toLowerCase() || ''
        
        return keywords.some(keyword => 
          assetNameLower.includes(keyword) || 
          assetCategoryLower.includes(keyword)
        )
      })
    }
  }, [assets])

  return {
    assets,
    loading,
    getAssetsByAmenity,
    refetch: fetchAssets
  }
}

