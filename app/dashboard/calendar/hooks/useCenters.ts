import { useState, useEffect } from 'react'
import { CulturalCenter } from '../types'

export function useCenters() {
  const [centers, setCenters] = useState<CulturalCenter[]>([])

  const fetchCenters = async () => {
    try {
      const response = await fetch('/api/cultural-centers')
      if (response.ok) {
        const data = await response.json()
        setCenters(data)
      }
    } catch (error) {
      console.error('Error fetching centers:', error)
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

