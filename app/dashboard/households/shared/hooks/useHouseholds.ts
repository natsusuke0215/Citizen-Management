import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Household } from '../types'

export function useHouseholds() {
  const [households, setHouseholds] = useState<Household[]>([])

  const fetchHouseholds = async () => {
    try {
      const response = await fetch('/api/households')
      if (response.ok) {
        const data = await response.json()
        setHouseholds(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách hộ khẩu')
    }
  }

  useEffect(() => {
    fetchHouseholds()
  }, [])

  return {
    households,
    fetchHouseholds,
    setHouseholds
  }
}

