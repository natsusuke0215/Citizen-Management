import { Booking, BookingStatus } from '../types'
import { getDayOfWeek } from './dateUtils'

export const filterBookings = (
  bookings: Booking[],
  searchTerm: string,
  statusFilter: BookingStatus
): Booking[] => {
  return bookings
    .filter(booking => {
      if (!searchTerm && statusFilter === 'ALL') return true

      // Search filter - enhanced with date/time search
      let matchesSearch = true
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase().trim()
        
        // Basic text search
        const basicMatch = [
          booking.title,
          booking.description,
          booking.culturalCenter?.name,
          booking.user?.name
        ].some(value => (value || '').toLowerCase().includes(searchLower))

        // Date/time search
        const startDate = new Date(booking.startTime)
        const endDate = new Date(booking.endTime)
        
        // Search in formatted dates
        const dateStr = startDate.toLocaleDateString('vi-VN')
        const timeStr = startDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
        const dayOfWeek = getDayOfWeek(booking.startTime)
        const month = startDate.toLocaleDateString('vi-VN', { month: 'long' })
        const year = startDate.getFullYear().toString()
        
        // Check if search term matches date/time patterns
        const dateTimeMatch = 
          dateStr.includes(searchLower) ||
          timeStr.includes(searchLower) ||
          dayOfWeek.toLowerCase().includes(searchLower) ||
          month.toLowerCase().includes(searchLower) ||
          year.includes(searchLower) ||
          // Also check end time
          endDate.toLocaleDateString('vi-VN').includes(searchLower) ||
          endDate.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }).includes(searchLower)

        matchesSearch = basicMatch || dateTimeMatch
      }

      // Status filter
      const matchesStatus = statusFilter === 'ALL' || booking.status === statusFilter

      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      // Sort by start time, newest first
      return new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
    })
}

