'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, MapPin, Building, Users, Calendar } from 'lucide-react'
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

  const filteredCenters = centers.filter(center => {
    const searchLower = (searchTerm || '').toLowerCase()

    const valuesToSearch = [
      center.name,
      center.description,
      center.location
    ]

    return valuesToSearch.some(value =>
      (value || '').toLowerCase().includes(searchLower)
    )
  })

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Nhà văn hóa</h1>
          <p className="mt-2 text-sm text-gray-700">
            Thông tin các nhà văn hóa trong khu dân cư
          </p>
        </div>
      </div>

      {/* Tìm kiếm */}
      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-5 h-5 text-gray-400" />
            </div>
            
            {/* Input Field */}
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm transition duration-150 ease-in-out"
              placeholder="Tìm kiếm theo tên, mô tả hoặc địa điểm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Danh sách nhà văn hóa */}
      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCenters.map((center) => (
          <div key={center.id} className="card">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="p-3 rounded-lg bg-blue-500">
                  <Building className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {center.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Sức chứa tối đa {center.capacity} người
                  </p>
                </div>
              </div>
            </div>
            
            {center.description && (
              <div className="mt-4">
                <p className="text-sm text-gray-600">{center.description}</p>
              </div>
            )}
            
            <div className="mt-4 flex items-center text-sm">
              <Calendar className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-gray-500">Số lịch đã đặt:</span>
              <span className="ml-1 font-medium text-black">{center._count.bookings}</span>
            </div>
            
            <div className="mt-4">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                <span className="text-sm text-gray-500">{center.location}</span>
              </div>
            </div>
            
            {center.amenities && (
              <div className="mt-4">
                <p className="text-xs text-gray-500 mb-2">Tiện nghi:</p>
                <div className="flex flex-wrap gap-1">
                  {JSON.parse(center.amenities).map((amenity: string, index: number) => (
                    <span key={index} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {filteredCenters.length === 0 && (
        <div className="text-center py-12">
          <Building className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có nhà văn hóa nào</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm 
              ? 'Không tìm thấy nhà văn hóa phù hợp với từ khóa tìm kiếm.' 
              : 'Chưa có thông tin nhà văn hóa.'}
          </p>
        </div>
      )}
    </div>
  )
}
