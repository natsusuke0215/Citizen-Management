import { useState, useEffect } from 'react'
import { Booking } from '../types'

interface UseBookingsParams {
  selectedDate: string
  selectedBuilding: string
  showPrivate: boolean
}

export function useBookings({ selectedDate, selectedBuilding, showPrivate }: UseBookingsParams) {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/bookings/calendar?date=${selectedDate}&building=${selectedBuilding}&showPrivate=${showPrivate}`)
      if (response.ok) {
        const data = await response.json()
        setBookings(data)
      }
    } catch (error) {
      console.error('Error fetching bookings:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBookings()
  }, [selectedDate, selectedBuilding, showPrivate])

  return {
    bookings,
    loading,
    fetchBookings,
    setBookings
  }
}

