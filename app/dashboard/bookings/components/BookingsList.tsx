'use client'

import { Booking } from '../types'
import BookingCard from './BookingCard'

interface BookingsListProps {
  bookings: Booking[]
  onEdit: (booking: Booking) => void
  onDelete: (id: string) => void
}

export default function BookingsList({ bookings, onEdit, onDelete }: BookingsListProps) {
  if (bookings.length === 0) {
    return null
  }

  return (
    <div className="space-y-4">
      {bookings.map((booking) => (
        <BookingCard
          key={booking.id}
          booking={booking}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

