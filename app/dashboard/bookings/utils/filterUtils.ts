import { Booking } from '../types'
import { getDayOfWeek } from './dateUtils'

export type SortMode = 'event' | 'created'

export const filterBookings = (
  bookings: Booking[],
  searchTerm: string,
  sortMode: SortMode = 'created'
): Booking[] => {
  const filtered = bookings.filter(booking => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase().trim()
    // Only search by booker name or phone (and title optionally)
    const nameMatch = (booking.bookerName || '').toLowerCase().includes(searchLower)
    const phoneMatch = (booking.bookerPhone || '').toLowerCase().includes(searchLower)
    const titleMatch = (booking.title || '').toLowerCase().includes(searchLower)
    return nameMatch || phoneMatch || titleMatch
  })

  const sorted = filtered.sort((a, b) => {
    if (sortMode === 'event') {
      // Sort by event startTime ascending
      return new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
    }
    // Default: sort by createdAt descending (most recent first)
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  })

  return sorted
}

