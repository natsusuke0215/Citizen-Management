import { useState, useEffect } from 'react'
import { Household } from '../types'

export function useHousehold() {
  const [household, setHousehold] = useState<Household | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchHousehold = async () => {
    try {
      const response = await fetch('/api/my-household')
      if (response.ok) {
        const data = await response.json()
        setHousehold(data)
      }
    } catch (error) {
      console.error('Error fetching household:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHousehold()
  }, [])

  return {
    household,
    loading,
    fetchHousehold,
    setHousehold
  }
}

