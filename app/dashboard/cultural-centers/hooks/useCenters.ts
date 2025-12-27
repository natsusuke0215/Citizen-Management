import { useState, useEffect, useMemo } from 'react'
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

export function useCenters() {
  const [centers, setCenters] = useState<CulturalCenter[]>([])
  const [loading, setLoading] = useState(true)

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

  const statistics = useMemo(() => {
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
    const avgBookingsPerCenter = totalBookings > 0 && totalCenters > 0 
      ? Math.round((totalBookings / totalCenters) * 10) / 10 
      : 0

    return {
      totalCenters,
      totalCapacity,
      totalBookings,
      indoorCenters,
      outdoorCenters,
      totalAmenities,
      avgAmenities,
      avgBookingsPerCenter
    }
  }, [centers])

  return {
    centers,
    loading,
    statistics,
    refetch: fetchCenters
  }
}

