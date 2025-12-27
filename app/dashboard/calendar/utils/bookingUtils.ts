import { Booking, CulturalCenter } from '../types'

export const getBookingsForCenter = (bookings: Booking[], centerId: string): Booking[] => {
  return bookings.filter(booking => 
    booking.culturalCenter.id === centerId && 
    booking.status === 'APPROVED'
  )
}

export const isTimeSlotBooked = (bookings: Booking[], centerId: string, hour: number): boolean => {
  const centerBookings = getBookingsForCenter(bookings, centerId)
  return centerBookings.some(booking => {
    const startHour = new Date(booking.startTime).getHours()
    const endHour = new Date(booking.endTime).getHours()
    return hour >= startHour && hour < endHour
  })
}

export const getBookingForTimeSlot = (bookings: Booking[], centerId: string, hour: number): Booking | undefined => {
  const centerBookings = getBookingsForCenter(bookings, centerId)
  return centerBookings.find(booking => {
    const startHour = new Date(booking.startTime).getHours()
    const endHour = new Date(booking.endTime).getHours()
    return hour >= startHour && hour < endHour
  })
}

export const filterCentersByBuilding = (centers: CulturalCenter[], selectedBuilding: string): CulturalCenter[] => {
  return centers.filter(center => 
    selectedBuilding === 'all' || center.building === selectedBuilding
  )
}

