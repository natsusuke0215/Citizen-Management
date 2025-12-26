'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, MapPin, Building, Users, Calendar, Filter, Grid3x3, List, Sparkles, Star, Clock, TreePine, X, CheckCircle, AlertCircle, Package, Wifi, Monitor, Volume2, Wind, Zap, Image as ImageIcon, Save, TrendingUp, Activity, Wrench } from 'lucide-react'
import toast from 'react-hot-toast'

interface CulturalCenter {
  id: string
  name: string
  description: string | null
  capacity: number
  location: string
  building: string
  floor: number | null
  room: string | null
  amenities: string | null
  imageUrl: string | null
  createdAt: string
  _count: {
    bookings: number
  }
}

interface Asset {
  id: string
  name: string
  category: string | null
  quantity: number
  condition: string
  location: string | null
  notes: string | null
  imageUrl: string | null
  goodQuantity: number | null
  fairQuantity: number | null
  poorQuantity: number | null
  damagedQuantity: number | null
  repairingQuantity: number | null
}

interface User {
  role: string
}

export default function CulturalCentersPage() {
  const [centers, setCenters] = useState<CulturalCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'bookings'>('name')
  const [selectedCenter, setSelectedCenter] = useState<CulturalCenter | null>(null)
  const [assets, setAssets] = useState<Asset[]>([])
  const [loadingAssets, setLoadingAssets] = useState(false)
  const [selectedAmenity, setSelectedAmenity] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [editingAsset, setEditingAsset] = useState<Asset | null>(null)
  const [imageLoadError, setImageLoadError] = useState(false)

  useEffect(() => {
    fetchCenters()
    fetchUser()
  }, [])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && selectedCenter) {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleEscape)
    return () => window.removeEventListener('keydown', handleEscape)
  }, [selectedCenter])

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me')
      if (response.ok) {
        const data = await response.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Error fetching user:', error)
    }
  }

  // Helper function to normalize image URL
  const normalizeImageUrl = (url: string | null | undefined): string | null => {
    if (!url) return null
    // If it's already a full URL (http/https), return as is
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url
    }
    // If it's a relative path, ensure it starts with /
    if (!url.startsWith('/')) {
      return '/' + url
    }
    return url
  }

  const fetchCenters = async () => {
    try {
      const response = await fetch('/api/cultural-centers')
      if (response.ok) {
        const data = await response.json()
        console.log('Fetched centers:', data)
        if (data.length > 0) {
          console.log('First center:', data[0])
          console.log('First center imageUrl:', data[0].imageUrl)
        }
        setCenters(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách nhà văn hóa')
    } finally {
      setLoading(false)
    }
  }

  const handleCenterClick = async (center: CulturalCenter) => {
    console.log('Selected center:', center)
    console.log('Image URL:', center.imageUrl)
    setSelectedCenter(center)
    setSelectedAmenity(null)
    setImageLoadError(false) // Reset image error state when opening modal
    setLoadingAssets(true)
    try {
      const response = await fetch(`/api/cultural-centers/${center.id}/assets`)
      if (response.ok) {
        const data = await response.json()
        setAssets(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách thiết bị')
    } finally {
      setLoadingAssets(false)
    }
  }

  const closeModal = () => {
    setSelectedCenter(null)
    setAssets([])
    setSelectedAmenity(null)
    setEditingAsset(null)
    setImageLoadError(false)
  }

  const handleAmenityClick = (amenity: string) => {
    if (selectedAmenity === amenity) {
      setSelectedAmenity(null)
    } else {
      setSelectedAmenity(amenity)
    }
  }

  const getAssetsByAmenity = (amenity: string): Asset[] => {
    const amenityLower = amenity.toLowerCase()
    
    // 创建关键词映射表，用于更智能的匹配
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
    
    // 查找匹配的关键词
    const keywords = keywordMap[amenityLower] || [amenityLower]
    
    return assets.filter(asset => {
      const assetNameLower = asset.name.toLowerCase()
      const assetCategoryLower = asset.category?.toLowerCase() || ''
      
      // 检查是否匹配任何关键词
      return keywords.some(keyword => 
        assetNameLower.includes(keyword) || 
        assetCategoryLower.includes(keyword)
      )
    })
  }

  const isAdmin = () => {
    return user?.role === 'ADMIN' || user?.role === 'TEAM_LEADER' || user?.role === 'LEADER' || user?.role === 'FACILITY_MANAGER'
  }

  const handleUpdateAsset = async (assetId: string, updates: Partial<Asset>) => {
    try {
      // 验证总数是否匹配
      const goodQty = updates.goodQuantity || 0
      const repairingQty = updates.repairingQuantity || 0
      const brokenQty = (updates.poorQuantity || 0) + (updates.damagedQuantity || 0)
      const total = goodQty + repairingQty + brokenQty
      
      if (total !== updates.quantity) {
        toast.error(`Tổng số lượng các trạng thái (${total}) phải bằng tổng số lượng thiết bị (${updates.quantity})`)
        return
      }

      const response = await fetch(`/api/cultural-centers/${selectedCenter?.id}/assets/${assetId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })
      if (response.ok) {
        const updatedAsset = await response.json()
        setAssets(assets.map(a => a.id === assetId ? updatedAsset : a))
        setEditingAsset(null)
        toast.success('Cập nhật thiết bị thành công')
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật thiết bị')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật thiết bị')
    }
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

  const getAmenityIcon = (amenity: string) => {
    const lower = amenity.toLowerCase()
    if (lower.includes('máy chiếu') || lower.includes('projector')) return <Monitor className="h-4 w-4" />
    if (lower.includes('âm thanh') || lower.includes('loa') || lower.includes('sound')) return <Volume2 className="h-4 w-4" />
    if (lower.includes('điều hòa') || lower.includes('air')) return <Wind className="h-4 w-4" />
    if (lower.includes('wifi') || lower.includes('internet')) return <Wifi className="h-4 w-4" />
    if (lower.includes('đèn') || lower.includes('light')) return <Zap className="h-4 w-4" />
    return <Sparkles className="h-4 w-4" />
  }

  const filteredCenters = centers
    .filter(center => {
      if (!searchTerm) return true
      
      const searchLower = searchTerm.toLowerCase().trim()
      
      // Search in name, description, location
      const basicMatch = [
        center.name,
        center.description,
        center.location
      ].some(value => (value || '').toLowerCase().includes(searchLower))
      
      // Search in amenities
      let amenitiesMatch = false
      if (center.amenities) {
        try {
          const amenities = JSON.parse(center.amenities)
          amenitiesMatch = amenities.some((amenity: string) =>
            amenity.toLowerCase().includes(searchLower)
          )
        } catch (e) {
          // If parsing fails, treat as string
          amenitiesMatch = center.amenities.toLowerCase().includes(searchLower)
        }
      }
      
      return basicMatch || amenitiesMatch
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'capacity':
          return b.capacity - a.capacity
        case 'bookings':
          return b._count.bookings - a._count.bookings
        case 'name':
        default:
          return a.name.localeCompare(b.name, 'vi')
      }
    })

  // Calculate statistics
  const totalCenters = centers.length
  const totalCapacity = centers.reduce((sum, c) => sum + c.capacity, 0)
  const totalBookings = centers.reduce((sum, c) => sum + c._count.bookings, 0)
  const indoorCenters = centers.filter(c => c.building !== 'Khuôn viên').length
  const outdoorCenters = centers.filter(c => c.building === 'Khuôn viên').length
  const totalAmenities = centers.reduce((sum, c) => {
    if (c.amenities) {
      try {
        const amenities = JSON.parse(c.amenities)
        return sum + amenities.length
      } catch {
        return sum
      }
    }
    return sum
  }, 0)
  const avgAmenities = totalCenters > 0 ? Math.round(totalAmenities / totalCenters) : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slideUp">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Building className="h-8 w-8 text-navy-1" />
            Nhà văn hóa
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý và khám phá các nhà văn hóa trong khu dân cư
          </p>
        </div>
      </div>

      {/* Statistics Cards */}
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

      {/* Additional Statistics Row */}
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
            <div className="text-3xl font-bold mb-1">{totalBookings > 0 ? Math.round(totalBookings / totalCenters * 10) / 10 : 0}</div>
            <div className="text-sm opacity-90">TB lượt đặt/phòng</div>
          </div>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="bg-white rounded-[15px] shadow-drop p-4">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
              placeholder="Tìm kiếm theo tên, mô tả, địa điểm hoặc tiện ích (máy chiếu, điều hòa...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => {
                const newSort = e.target.value as 'name' | 'capacity' | 'bookings'
                setSortBy(newSort)
              }}
              className="px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200 cursor-pointer min-w-[180px]"
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="capacity">Sắp xếp theo sức chứa</option>
              <option value="bookings">Sắp xếp theo lượt đặt</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-gray-50 rounded-[8px] p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-[6px] transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-navy-1 text-white shadow-drop'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <Grid3x3 className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-[6px] transition-all duration-200 ${
                viewMode === 'list'
                  ? 'bg-navy-1 text-white shadow-drop'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Cultural Centers List */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCenters.map((center, index) => (
            <div
              key={center.id}
              onClick={() => handleCenterClick(center)}
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
                          {center.building === 'Khuôn viên' ? `Tối đa ${center.capacity.toLocaleString()} người chơi` : `Tối đa ${center.capacity.toLocaleString()} người`}
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
                {center.amenities && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                          <div className="flex flex-wrap gap-2">
                      {JSON.parse(center.amenities).map((amenity: string, index: number) => (
                              <span
                                key={index}
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
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCenters.map((center, index) => (
            <div
              key={center.id}
              onClick={() => handleCenterClick(center)}
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
                        {center.building === 'Khuôn viên' ? `${center.capacity.toLocaleString()} người chơi` : `${center.capacity.toLocaleString()} người`}
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
                    {center.amenities && (
                  <div className="flex flex-wrap gap-2">
                        {JSON.parse(center.amenities).slice(0, 3).map((amenity: string, index: number) => (
                      <span
                        key={index}
                            className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-navy-1/10 to-navy-2/10 text-navy-1 border border-navy-1/20"
                      >
                        {amenity}
                      </span>
                    ))}
                        {JSON.parse(center.amenities).length > 3 && (
                      <span className="text-xs text-gray-500">+{JSON.parse(center.amenities).length - 3}</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {filteredCenters.length === 0 && (
        <div className="text-center py-16 bg-white rounded-[15px] shadow-drop border border-gray-100">
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-navy-1/20 to-navy-3/20 rounded-full blur-2xl"></div>
            <Building className="relative h-20 w-20 text-gray-300 mx-auto" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có nhà văn hóa'}
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            {searchTerm 
              ? `Không tìm thấy nhà văn hóa nào phù hợp với "${searchTerm}". Hãy thử từ khóa khác.` 
              : 'Hiện tại chưa có thông tin nhà văn hóa trong hệ thống.'}
          </p>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Xóa bộ lọc
            </button>
          )}
        </div>
      )}

      {/* Detail Modal */}
      {selectedCenter && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn"
          onClick={closeModal}
        >
          <div 
            className="relative w-full max-w-5xl max-h-[90vh] bg-white rounded-[20px] shadow-2xl overflow-hidden animate-slideUp"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 hover:bg-white rounded-full shadow-lg transition-all duration-200 hover:scale-110"
            >
              <X className="h-5 w-5 text-gray-600" />
            </button>

            {/* Scrollable Content */}
            <div className="overflow-y-auto max-h-[90vh]">
              {/* Hero Image Section */}
              <div className="relative h-64 bg-gradient-to-br from-navy-1 via-navy-2 to-navy-3 overflow-hidden">
                {normalizeImageUrl(selectedCenter.imageUrl) && !imageLoadError ? (
                  <>
                    <img 
                      src={normalizeImageUrl(selectedCenter.imageUrl) || ''} 
                      alt={selectedCenter.name}
                      className="absolute inset-0 w-full h-full object-cover"
                      onError={(e) => {
                        console.error('Image failed to load:', normalizeImageUrl(selectedCenter.imageUrl))
                        setImageLoadError(true)
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                      onLoad={() => {
                        console.log('Image loaded successfully:', normalizeImageUrl(selectedCenter.imageUrl))
                        setImageLoadError(false)
                      }}
                    />
                    <div className="absolute inset-0 bg-black/40"></div>
                  </>
                ) : (
                  <>
                    <div className="absolute inset-0 bg-black/20"></div>
                    {/* Decorative Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl"></div>
                      <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl"></div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      {selectedCenter.building === 'Khuôn viên' ? (
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
                    {selectedCenter.building === 'Khuôn viên' ? (
                      <div className="p-4 rounded-[12px] bg-white/20 backdrop-blur-sm">
                        <TreePine className="h-8 w-8" />
                      </div>
                    ) : (
                      <div className="p-4 rounded-[12px] bg-white/20 backdrop-blur-sm">
                        <Building className="h-8 w-8" />
                      </div>
                    )}
                    <div>
                      <h2 className="text-3xl font-bold mb-2">{selectedCenter.name}</h2>
                      <div className="flex items-center gap-4 text-sm opacity-90">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4" />
                          <span>{selectedCenter.building === 'Khuôn viên' ? `${selectedCenter.capacity} người chơi` : `${selectedCenter.capacity} người`}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          <span>{selectedCenter.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          <span>{selectedCenter._count.bookings} lượt đặt</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-8 space-y-8">
                {/* Description */}
                {selectedCenter.description && (
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-[15px] p-6 border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-navy-1" />
                      Mô tả
                    </h3>
                    <p className="text-gray-700 leading-relaxed">{selectedCenter.description}</p>
                  </div>
                )}

                 {/* Amenities Section */}
                 {selectedCenter.amenities && (
                   <div>
                     <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                       <Star className="h-5 w-5 text-yellow-500" />
                       Tiện ích & Thiết bị
                     </h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                       {JSON.parse(selectedCenter.amenities).map((amenity: string, index: number) => {
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
                 )}

                 {/* Assets Section - Combined */}
                 <div>
                   <div className="flex items-center justify-between mb-4">
                     <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                       <Package className="h-5 w-5 text-navy-1" />
                       {selectedAmenity ? `Chi tiết: ${selectedAmenity}` : 'Chi tiết thiết bị'}
                       {loadingAssets && <span className="text-sm font-normal text-gray-500">(Đang tải...)</span>}
                     </h3>
                     {selectedAmenity && (
                       <button
                         onClick={() => setSelectedAmenity(null)}
                         className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
                       >
                         <X className="h-4 w-4" />
                       </button>
                     )}
                   </div>
                  
                  {loadingAssets ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-1"></div>
                    </div>
                   ) : (() => {
                     const displayAssets = selectedAmenity ? getAssetsByAmenity(selectedAmenity) : assets
                     return displayAssets.length > 0 ? (
                       <div className="space-y-4">
                         {displayAssets.map((asset) => {
                           // Tính toán số lượng hỏng/kém (合并poor和damaged)
                           const brokenQuantity = (asset.poorQuantity || 0) + (asset.damagedQuantity || 0)
                           const goodQty = asset.goodQuantity || 0
                           const repairingQty = asset.repairingQuantity || 0
                           // Tính số lượng còn lại (nếu总数不等于各状态之和)
                           const remainingQty = asset.quantity - goodQty - repairingQty - brokenQuantity
                           
                           return (
                             <div
                               key={asset.id}
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
                                   {isAdmin() && (
                                     <button
                                       onClick={() => setEditingAsset(asset)}
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
                                   {/* Quantity Details - 3 states only */}
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
                                       {(remainingQty !== 0) && (
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
                         })}
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
                     )
                   })()}
                </div>

                 {/* Additional Info */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {selectedCenter.floor !== null && (
                     <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-[12px] p-4 border border-blue-200">
                       <div className="text-sm text-blue-600 font-medium mb-1">Tầng</div>
                       <div className="text-xl font-bold text-blue-900">{selectedCenter.floor}</div>
                     </div>
                   )}
                   {selectedCenter.room && (
                     <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-[12px] p-4 border border-purple-200">
                       <div className="text-sm text-purple-600 font-medium mb-1">Phòng</div>
                       <div className="text-xl font-bold text-purple-900">{selectedCenter.room}</div>
                     </div>
                   )}
                 </div>
               </div>
             </div>
           </div>
         </div>
       )}

       {/* Edit Asset Modal */}
       {editingAsset && (
         <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
           <div className="relative w-full max-w-2xl bg-white rounded-[20px] shadow-2xl overflow-hidden animate-slideUp">
             <div className="p-6 border-b border-gray-200">
               <div className="flex items-center justify-between">
                 <h3 className="text-xl font-bold text-gray-900">Chỉnh sửa thiết bị</h3>
                 <button
                   onClick={() => setEditingAsset(null)}
                   className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                 >
                   <X className="h-5 w-5 text-gray-600" />
                 </button>
               </div>
             </div>
             <div className="p-6 overflow-y-auto max-h-[80vh]">
               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Tên thiết bị</label>
                   <input
                     type="text"
                     value={editingAsset.name}
                     onChange={(e) => setEditingAsset({ ...editingAsset, name: e.target.value })}
                     className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Danh mục</label>
                   <input
                     type="text"
                     value={editingAsset.category || ''}
                     onChange={(e) => setEditingAsset({ ...editingAsset, category: e.target.value })}
                     className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Tổng số lượng</label>
                   <input
                     type="number"
                     value={editingAsset.quantity}
                     onChange={(e) => setEditingAsset({ ...editingAsset, quantity: parseInt(e.target.value) || 0 })}
                     className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Tình trạng chung</label>
                   <select
                     value={editingAsset.condition}
                     onChange={(e) => setEditingAsset({ ...editingAsset, condition: e.target.value })}
                     className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
                   >
                     <option value="GOOD">Tốt</option>
                     <option value="FAIR">Khá</option>
                     <option value="POOR">Kém</option>
                     <option value="DAMAGED">Hỏng</option>
                   </select>
                 </div>
                 <div className="bg-blue-50 rounded-[8px] p-4 border border-blue-200 mb-4">
                   <div className="text-sm font-medium text-blue-900 mb-2">⚠️ Lưu ý: Tổng số lượng các trạng thái phải bằng tổng số lượng thiết bị</div>
                   <div className="text-xs text-blue-700">
                     Tổng hiện tại: {(editingAsset.goodQuantity || 0) + (editingAsset.repairingQuantity || 0) + ((editingAsset.poorQuantity || 0) + (editingAsset.damagedQuantity || 0))} / {editingAsset.quantity}
                     {(editingAsset.goodQuantity || 0) + (editingAsset.repairingQuantity || 0) + ((editingAsset.poorQuantity || 0) + (editingAsset.damagedQuantity || 0)) !== editingAsset.quantity && (
                       <span className="text-red-600 font-semibold"> (Không khớp!)</span>
                     )}
                   </div>
                 </div>
                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                       <CheckCircle className="h-4 w-4 text-emerald-600" />
                       Số lượng tốt
                     </label>
                     <input
                       type="number"
                       min="0"
                       max={editingAsset.quantity}
                       value={editingAsset.goodQuantity || ''}
                       onChange={(e) => setEditingAsset({ ...editingAsset, goodQuantity: e.target.value ? parseInt(e.target.value) : null })}
                       className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                       <Wrench className="h-4 w-4 text-purple-600" />
                       Số lượng đang sửa chữa
                     </label>
                     <input
                       type="number"
                       min="0"
                       max={editingAsset.quantity}
                       value={editingAsset.repairingQuantity || ''}
                       onChange={(e) => setEditingAsset({ ...editingAsset, repairingQuantity: e.target.value ? parseInt(e.target.value) : null })}
                       className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                     />
                   </div>
                   <div>
                     <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-1">
                       <AlertCircle className="h-4 w-4 text-red-600" />
                       Số lượng hỏng/kém
                     </label>
                     <div className="space-y-2">
                       <input
                         type="number"
                         min="0"
                         max={editingAsset.quantity}
                         value={(editingAsset.poorQuantity || 0) + (editingAsset.damagedQuantity || 0)}
                         onChange={(e) => {
                           const value = e.target.value ? parseInt(e.target.value) : 0
                           // 保持现有比例或平均分配
                           const currentTotal = (editingAsset.poorQuantity || 0) + (editingAsset.damagedQuantity || 0)
                           const damagedRatio = currentTotal > 0 ? (editingAsset.damagedQuantity || 0) / currentTotal : 0.5
                           setEditingAsset({ 
                             ...editingAsset, 
                             damagedQuantity: value > 0 ? Math.round(value * damagedRatio) : null,
                             poorQuantity: value > 0 ? value - Math.round(value * damagedRatio) : null
                           })
                         }}
                         className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-red-500 focus:border-transparent"
                         placeholder="Tổng hỏng/kém"
                       />
                       <div className="flex gap-2 text-xs">
                         <div className="flex-1">
                           <label className="block text-xs text-gray-600 mb-1">Hỏng</label>
                           <input
                             type="number"
                             placeholder="0"
                             min="0"
                             value={editingAsset.damagedQuantity || ''}
                             onChange={(e) => {
                               const damaged = e.target.value ? parseInt(e.target.value) : null
                               const totalBroken = (editingAsset.poorQuantity || 0) + (editingAsset.damagedQuantity || 0)
                               const newTotal = damaged || 0
                               setEditingAsset({ 
                                 ...editingAsset, 
                                 damagedQuantity: damaged,
                                 poorQuantity: totalBroken - newTotal > 0 ? totalBroken - newTotal : null
                               })
                             }}
                             className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                           />
                         </div>
                         <div className="flex-1">
                           <label className="block text-xs text-gray-600 mb-1">Kém</label>
                           <input
                             type="number"
                             placeholder="0"
                             min="0"
                             value={editingAsset.poorQuantity || ''}
                             onChange={(e) => {
                               const poor = e.target.value ? parseInt(e.target.value) : null
                               const totalBroken = (editingAsset.poorQuantity || 0) + (editingAsset.damagedQuantity || 0)
                               const newTotal = poor || 0
                               setEditingAsset({ 
                                 ...editingAsset, 
                                 poorQuantity: poor,
                                 damagedQuantity: totalBroken - newTotal > 0 ? totalBroken - newTotal : null
                               })
                             }}
                             className="w-full px-2 py-1 border border-gray-300 rounded text-xs"
                           />
                         </div>
                       </div>
                     </div>
                   </div>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Vị trí</label>
                   <input
                     type="text"
                     value={editingAsset.location || ''}
                     onChange={(e) => setEditingAsset({ ...editingAsset, location: e.target.value })}
                     className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
                   />
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Đường dẫn hình ảnh</label>
                   <input
                     type="text"
                     value={editingAsset.imageUrl || ''}
                     onChange={(e) => setEditingAsset({ ...editingAsset, imageUrl: e.target.value })}
                     placeholder="/assets/images/center/ten-file.jpg"
                     className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
                   />
                   <p className="text-xs text-gray-500 mt-1">Ví dụ: /assets/images/center/loa-bluetooth.jpg</p>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-2">Ghi chú</label>
                   <textarea
                     value={editingAsset.notes || ''}
                     onChange={(e) => setEditingAsset({ ...editingAsset, notes: e.target.value })}
                     rows={3}
                     className="w-full px-4 py-2 border border-gray-300 rounded-[8px] focus:ring-2 focus:ring-navy-1 focus:border-transparent"
                   />
                 </div>
                 <div className="flex gap-3 pt-4">
                   <button
                     onClick={() => handleUpdateAsset(editingAsset.id, editingAsset)}
                     className="flex-1 px-4 py-2 bg-navy-1 text-white rounded-[8px] font-medium hover:bg-navy-2 transition-colors flex items-center justify-center gap-2"
                   >
                     <Save className="h-4 w-4" />
                     Lưu thay đổi
                   </button>
                   <button
                     onClick={() => setEditingAsset(null)}
                     className="px-4 py-2 bg-gray-200 text-gray-700 rounded-[8px] font-medium hover:bg-gray-300 transition-colors"
                   >
                     Hủy
                   </button>
                 </div>
               </div>
             </div>
           </div>
        </div>
      )}
    </div>
  )
}
