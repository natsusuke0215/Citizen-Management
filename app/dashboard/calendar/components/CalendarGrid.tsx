'use client'

import { EyeOff } from 'lucide-react'
import { CulturalCenter, Booking, TimeSlot, Building } from '../types'
import { isTimeSlotBooked, getBookingForTimeSlot } from '../utils/bookingUtils'

interface CalendarGridProps {
  centers: CulturalCenter[]
  bookings: Booking[]
  timeSlots: TimeSlot[]
  showPrivate: boolean
  buildings: Building[]
}

export default function CalendarGrid({
  centers,
  bookings,
  timeSlots,
  showPrivate,
  buildings
}: CalendarGridProps) {
  return (
    <div className="mt-8">
      <div className="overflow-x-auto">
        <div className="min-w-full">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 mb-4">
            <div className="col-span-2">
              <div className="text-sm font-medium text-gray-500">Thời gian</div>
            </div>
            {centers.map((center) => {
              const building = buildings.find(b => b.id === center.building)
              return (
                <div key={center.id} className="col-span-1">
                  <div className="text-center">
                    <div className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-medium text-white ${building?.color || 'bg-gray-500'}`}>
                      {center.building}
                    </div>
                    <div className="mt-1 text-xs text-gray-600">
                      {center.name}
                    </div>
                    <div className="text-xs text-gray-500">
                      Tầng {center.floor || 'N/A'}
                      {center.room && ` - ${center.room}`}
                    </div>
                    <div className="text-xs text-gray-500">
                      {center.capacity} chỗ
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Time slots */}
          <div className="space-y-1">
            {timeSlots.map((slot) => (
              <div key={slot.time} className="grid grid-cols-12 gap-4">
                <div className="col-span-2 flex items-center">
                  <div className="text-sm font-medium text-gray-900">
                    {slot.time}
                  </div>
                </div>
                {centers.map((center) => {
                  const booked = isTimeSlotBooked(bookings, center.id, slot.hour)
                  const booking = getBookingForTimeSlot(bookings, center.id, slot.hour)
                  
                  return (
                    <div key={center.id} className="col-span-1">
                      <div className={`h-12 rounded-lg border-2 flex items-center justify-center ${
                        booked 
                          ? booking?.visibility === 'PUBLIC' || showPrivate
                            ? 'bg-red-100 border-red-300' 
                            : 'bg-gray-100 border-gray-300'
                          : 'bg-green-100 border-green-300'
                      }`}>
                        {booked ? (
                          booking?.visibility === 'PUBLIC' || showPrivate ? (
                            <div className="text-center">
                              <div className="text-xs font-medium text-red-800">
                                {booking?.title}
                              </div>
                              <div className="text-xs text-red-600">
                                {booking?.user.name}
                              </div>
                              {booking?.visibility === 'PRIVATE' && (
                                <EyeOff className="h-3 w-3 text-red-600 mx-auto mt-1" />
                              )}
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Đã đặt</div>
                              <EyeOff className="h-3 w-3 text-gray-500 mx-auto mt-1" />
                            </div>
                          )
                        ) : (
                          <div className="text-center">
                            <div className="text-xs text-green-600 font-medium">Trống</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

