'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'

interface Event {
  id: string
  title: string
  description: string | null
  start: string
  end: string
  type: 'BOOKING' | 'ACTIVITY'
  status?: string
  visibility?: string
  activityType?: string
  organizer?: string
  participantCount?: number
  culturalCenter: {
    id: string
    name: string
    building: string
    floor: number | null
    room: string | null
  }
  user?: {
    id: string
    name: string
  }
  color: string
}

interface CalendarViewProps {
  events: Event[]
  loading?: boolean
}

export default function CalendarView({ events, loading }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  const monthNames = [
    'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6',
    'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'
  ]

  const dayNames = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7']

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    const days = []
    
    // Thêm các ngày của tháng trước
    const prevMonth = new Date(year, month - 1, 0)
    const daysInPrevMonth = prevMonth.getDate()
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
        isToday: false
      })
    }

    // Thêm các ngày của tháng hiện tại
    const today = new Date()
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day)
      days.push({
        date,
        isCurrentMonth: true,
        isToday: date.toDateString() === today.toDateString()
      })
    }

    // Thêm các ngày của tháng sau để đủ 6 tuần
    const remainingDays = 42 - days.length
    for (let day = 1; day <= remainingDays; day++) {
      days.push({
        date: new Date(year, month + 1, day),
        isCurrentMonth: false,
        isToday: false
      })
    }

    return days
  }

  const getEventsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => {
      const eventStart = new Date(event.start).toISOString().split('T')[0]
      return eventStart === dateStr
    })
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentDate(new Date())
  }

  const days = getDaysInMonth(currentDate)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex items-center gap-4">
          <button
            onClick={goToToday}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Hôm nay
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={goToPreviousMonth}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronLeft className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={goToNextMonth}
              className="p-2 hover:bg-gray-100 rounded-md"
            >
              <ChevronRight className="h-5 w-5 text-gray-600" />
            </button>
          </div>
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <CalendarIcon className="h-5 w-5" />
          <span>{events.length} sự kiện</span>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="text-center text-sm font-medium text-gray-500 py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString()

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day.date)}
                className={`min-h-[100px] border border-gray-200 rounded-md p-1 cursor-pointer transition-colors ${
                  !day.isCurrentMonth ? 'bg-gray-50' : 'bg-white'
                } ${
                  day.isToday ? 'border-blue-500 border-2' : ''
                } ${
                  isSelected ? 'bg-blue-50 border-blue-500' : 'hover:bg-gray-50'
                }`}
              >
                <div className={`text-sm font-medium mb-1 ${
                  !day.isCurrentMonth ? 'text-gray-400' : 
                  day.isToday ? 'text-blue-600' : 'text-gray-900'
                }`}>
                  {day.date.getDate()}
                </div>
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event) => (
                    <div
                      key={event.id}
                      className="text-xs px-1 py-0.5 rounded truncate text-white"
                      style={{ backgroundColor: event.color }}
                      title={event.title}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{dayEvents.length - 3} sự kiện
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Selected date events */}
      {selectedDate && (
        <div className="border-t border-gray-200 p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">
            Sự kiện ngày {selectedDate.toLocaleDateString('vi-VN', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </h3>
          <div className="space-y-2">
            {getEventsForDate(selectedDate).length === 0 ? (
              <p className="text-gray-500 text-sm">Không có sự kiện nào</p>
            ) : (
              getEventsForDate(selectedDate).map((event) => (
                <div
                  key={event.id}
                  className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: event.color }}
                        ></div>
                        <h4 className="font-medium text-gray-900">{event.title}</h4>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">
                          {event.type === 'BOOKING' ? 'Đặt lịch' : 'Hoạt động'}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-1">{event.description}</p>
                      )}
                      <div className="text-xs text-gray-500">
                        <div>
                          {new Date(event.start).toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })} - {new Date(event.end).toLocaleTimeString('vi-VN', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </div>
                        <div>
                          {event.culturalCenter.building} - {event.culturalCenter.name}
                          {event.culturalCenter.room && ` - ${event.culturalCenter.room}`}
                        </div>
                        {event.user && (
                          <div>Người đặt: {event.user.name}</div>
                        )}
                        {event.organizer && (
                          <div>Người tổ chức: {event.organizer}</div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

