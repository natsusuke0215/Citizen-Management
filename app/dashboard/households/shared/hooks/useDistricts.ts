import { useState, useEffect } from 'react'
import { District } from '../types'

export function useDistricts() {
  const [districts, setDistricts] = useState<District[]>([])

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/districts')
      if (response.ok) {
        const data = await response.json()
        setDistricts(data)
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
    }
  }

  useEffect(() => {
    fetchDistricts()
  }, [])

  return {
    districts,
    fetchDistricts,
    setDistricts
  }
}

