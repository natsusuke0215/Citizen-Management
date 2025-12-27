'use client'

import { useState } from 'react'
import { Calendar } from 'lucide-react'
import { useCenters } from './hooks/useCenters'
import { useBookings } from './hooks/useBookings'
import { getTimeSlots } from './utils/calendarUtils'
import { filterCentersByBuilding } from './utils/bookingUtils'
import CalendarFilters from './components/CalendarFilters'
import CalendarGrid from './components/CalendarGrid'
import CalendarLegend from './components/CalendarLegend'
import BuildingStats from './components/BuildingStats'
import { Building } from './types'

const BUILDINGS: Building[] = [
  { id: 'A', name: 'Tòa nhà A', color: 'bg-blue-500' },
  { id: 'B', name: 'Tòa nhà B', color: 'bg-green-500' },
  { id: 'C', name: 'Tòa nhà C', color: 'bg-purple-500' }
]

export default function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0])
  const [selectedBuilding, setSelectedBuilding] = useState<string>('all')
  const [showPrivate, setShowPrivate] = useState(false)

  const { centers } = useCenters()
  const { bookings, loading } = useBookings({ selectedDate, selectedBuilding, showPrivate })

  const filteredCenters = filterCentersByBuilding(centers, selectedBuilding)
  const timeSlots = getTimeSlots()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Lịch nhà văn hóa</h1>
          <p className="mt-2 text-sm text-gray-700">
            Xem lịch trống và lịch đã đăng ký của các nhà văn hóa
          </p>
        </div>
      </div>

      <CalendarFilters
        selectedDate={selectedDate}
        onDateChange={setSelectedDate}
        selectedBuilding={selectedBuilding}
        onBuildingChange={setSelectedBuilding}
        showPrivate={showPrivate}
        onShowPrivateChange={setShowPrivate}
        buildings={BUILDINGS}
      />

      <CalendarGrid
        centers={filteredCenters}
        bookings={bookings}
        timeSlots={timeSlots}
        showPrivate={showPrivate}
        buildings={BUILDINGS}
      />

      <CalendarLegend />

      <BuildingStats
        buildings={BUILDINGS}
        centers={filteredCenters}
        bookings={bookings}
      />
    </div>
  )
}
