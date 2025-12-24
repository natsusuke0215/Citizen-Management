'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, MapPin, Building, Users, Calendar, Filter, Grid3x3, List, Sparkles, Star, Clock } from 'lucide-react'
import toast from 'react-hot-toast'

interface CulturalCenter {
  id: string
  name: string
  description: string | null
  capacity: number
  location: string
  amenities: string | null
  createdAt: string
  _count: {
    bookings: number
  }
}

export default function CulturalCentersPage() {
  const [centers, setCenters] = useState<CulturalCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [sortBy, setSortBy] = useState<'name' | 'capacity' | 'bookings'>('name')

  useEffect(() => {
    fetchCenters()
  }, [])

  const fetchCenters = async () => {
    try {
      const response = await fetch('/api/cultural-centers')
      if (response.ok) {
        const data = await response.json()
        setCenters(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách nhà văn hóa')
    } finally {
      setLoading(false)
    }
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
  const avgCapacity = totalCenters > 0 ? Math.round(totalCapacity / totalCenters) : 0

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
        <div className="group relative overflow-hidden bg-gradient-to-br from-navy-1 to-navy-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
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

        <div className="group relative overflow-hidden bg-gradient-to-br from-navy-2 to-navy-3 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
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

        <div className="group relative overflow-hidden bg-gradient-to-br from-navy-3 to-navy-1 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
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

        <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-navy-1 opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-navy-1 relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-navy-1 bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <Star className="h-6 w-6 text-navy-1" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{avgCapacity}</div>
            <div className="text-sm opacity-90 text-navy-2">Sức chứa trung bình</div>
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
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="group relative bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100"
            >
              {/* Decorative gradient overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-navy-1/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div className="relative p-6">
                {/* Header with Icon */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="p-4 rounded-[12px] bg-gradient-to-br from-navy-1 to-navy-2 shadow-drop group-hover:scale-110 transition-transform duration-300">
                      <Building className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 group-hover:text-navy-1 transition-colors">
                        {center.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Users className="h-4 w-4 text-gray-400" />
                        <span className="text-sm text-gray-600">
                          Tối đa {center.capacity.toLocaleString()} người
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
          {filteredCenters.map((center) => (
            <div
              key={center.id}
              className="group bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 border border-gray-100 overflow-hidden"
            >
              <div className="p-6 flex items-start gap-6">
                {/* Icon */}
                <div className="p-4 rounded-[12px] bg-gradient-to-br from-navy-1 to-navy-2 shadow-drop flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Building className="h-6 w-6 text-white" />
                </div>

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
                        {center.capacity.toLocaleString()} người
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
    </div>
  )
}
