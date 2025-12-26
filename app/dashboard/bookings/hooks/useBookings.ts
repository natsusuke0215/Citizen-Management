import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Booking } from '../types'

export function useBookings() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/bookings')
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      } else {
        toast.error('Có lỗi xảy ra khi tải danh sách lịch đặt')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách lịch đặt')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [])

  return {
    bookings,
    loading,
    fetchBookings,
    setBookings
  }
}

