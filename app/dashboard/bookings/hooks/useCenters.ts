import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { CulturalCenter } from '../types'

export function useCenters() {
  const [centers, setCenters] = useState<CulturalCenter[]>([])

  const fetchCenters = async () => {
    try {
      const response = await fetch('/api/cultural-centers')
      if (response.ok) {
        const data = await response.json()
        setCenters(data)
      } else {
        toast.error('Có lỗi xảy ra khi tải danh sách nhà văn hóa')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách nhà văn hóa')
    }
  }

  useEffect(() => {
    fetchCenters()
  }, [])

  return {
    centers,
    fetchCenters,
    setCenters
  }
}

