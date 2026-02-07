'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin, Users, Heart, UsersRound, PartyPopper, Trophy, Music, Megaphone } from 'lucide-react'

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
  const [hoveredDate, setHoveredDate] = useState<Date | null>(null)

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

  // Get event type icon based on event title and type
  const getEventIcon = (event: Event) => {
    const title = event.title.toLowerCase()
    const description = (event.description || '').toLowerCase()
    const activityType = (event.activityType || '').toLowerCase()
    const searchText = `${title} ${description} ${activityType}`

    // Wedding - Đám cưới
    if (searchText.includes('cưới') || searchText.includes('wedding') || searchText.includes('hôn lễ')) {
      return { icon: Heart, color: 'text-pink-500', bg: 'bg-pink-100' }
    }
    // Meeting - Họp
    if (searchText.includes('họp') || searchText.includes('meeting') || searchText.includes('hội nghị') || searchText.includes('hội thảo')) {
      return { icon: UsersRound, color: 'text-blue-500', bg: 'bg-blue-100' }
    }
    // Festival - Lễ hội
    if (searchText.includes('lễ hội') || searchText.includes('festival') || searchText.includes('tết') || searchText.includes('lễ')) {
      return { icon: PartyPopper, color: 'text-yellow-500', bg: 'bg-yellow-100' }
    }
    // Sports - Thể thao
    if (searchText.includes('thể thao') || searchText.includes('sports') || searchText.includes('thi đấu') || searchText.includes('giải đấu')) {
      return { icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-100' }
    }
    // Arts - Văn nghệ
    if (searchText.includes('văn nghệ') || searchText.includes('arts') || searchText.includes('biểu diễn') || searchText.includes('ca nhạc')) {
      return { icon: Music, color: 'text-purple-500', bg: 'bg-purple-100' }
    }
    // Assembly - Đại hội
    if (searchText.includes('đại hội') || searchText.includes('assembly') || searchText.includes('đại biểu')) {
      return { icon: Megaphone, color: 'text-red-500', bg: 'bg-red-100' }
    }
    
    // Default icon
    return { icon: CalendarIcon, color: 'text-gray-500', bg: 'bg-gray-100' }
  }

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))
    setSelectedDate(null)
  }

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))
    setSelectedDate(null)
  }

  const goToToday = () => {
    setCurrentDate(new Date())
    setSelectedDate(new Date())
  }

  const days = getDaysInMonth(currentDate)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-1 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải lịch...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[20px] shadow-drop overflow-hidden">
      {/* Enhanced Header */}
      <div className="bg-gradient-to-r from-navy-1 to-navy-2 p-6 text-white">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={goToToday}
              className="px-4 py-2 text-sm font-semibold bg-white bg-opacity-20 hover:bg-opacity-30 rounded-[10px] transition-all duration-200 backdrop-blur-sm"
            >
              Hôm nay
            </button>
            <div className="flex items-center gap-2">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-all duration-200"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-all duration-200"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white bg-opacity-20 rounded-[10px] backdrop-blur-sm">
            <CalendarIcon className="h-5 w-5" />
            <span className="text-sm font-semibold">{events.length} sự kiện</span>
          </div>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day names */}
        <div className="grid grid-cols-7 gap-2 mb-3">
          {dayNames.map((day, index) => (
            <div
              key={index}
              className="text-center text-sm font-bold text-gray-600 py-3"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-2">
          {days.map((day, index) => {
            const dayEvents = getEventsForDate(day.date)
            const isSelected = selectedDate && day.date.toDateString() === selectedDate.toDateString()
            const isHovered = hoveredDate && day.date.toDateString() === hoveredDate.toDateString()

            return (
              <div
                key={index}
                onClick={() => setSelectedDate(day.date)}
                onMouseEnter={() => setHoveredDate(day.date)}
                onMouseLeave={() => setHoveredDate(null)}
                className={`min-h-[120px] border-2 rounded-[12px] p-2 cursor-pointer transition-all duration-300 ${
                  !day.isCurrentMonth 
                    ? 'bg-gray-50 border-gray-100 opacity-50' 
                    : 'bg-white border-gray-200'
                } ${
                  day.isToday 
                    ? 'border-navy-1 bg-gradient-to-br from-navy-1/10 to-navy-2/10 shadow-md' 
                    : ''
                } ${
                  isSelected 
                    ? 'border-navy-1 bg-gradient-to-br from-navy-1/20 to-navy-2/20 shadow-lg scale-105' 
                    : ''
                } ${
                  isHovered && !isSelected
                    ? 'border-navy-1/50 bg-yellow-2/30 shadow-md scale-[1.02]'
                    : 'hover:border-navy-1/30 hover:bg-yellow-2/20'
                }`}
              >
                <div className={`text-sm font-bold mb-2 ${
                  !day.isCurrentMonth 
                    ? 'text-gray-400' 
                    : day.isToday 
                    ? 'text-navy-1' 
                    : 'text-gray-900'
                }`}>
                  {day.date.getDate()}
                  {day.isToday && (
                    <span className="ml-1 text-xs bg-navy-1 text-white px-1.5 py-0.5 rounded-full">
                      Hôm nay
                    </span>
                  )}
                </div>
                <div className="space-y-1.5">
                  {dayEvents.slice(0, 2).map((event, eventIndex) => {
                    const eventIcon = getEventIcon(event)
                    const IconComponent = eventIcon.icon
                    return (
                      <div
                        key={event.id}
                        className="text-xs px-2 py-1 rounded-[6px] text-white font-medium truncate shadow-sm hover:shadow-md transition-all duration-200 hover:scale-105 flex items-center gap-1.5"
                        style={{ backgroundColor: event.color }}
                        title={event.title}
                      >
                        <IconComponent className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{event.title}</span>
                      </div>
                    )
                  })}
                  {dayEvents.length > 2 && (
                    <div className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-[6px] font-medium">
                      +{dayEvents.length - 2} sự kiện
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Enhanced Selected date events */}
      {selectedDate && (
        <div className="border-t border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 animate-slideUp">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <CalendarIcon className="h-5 w-5 text-navy-1" />
              Sự kiện ngày {selectedDate.toLocaleDateString('vi-VN', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            <button
              onClick={() => setSelectedDate(null)}
              className="p-2 hover:bg-gray-200 rounded-[8px] transition-colors"
            >
              <ChevronRight className="h-5 w-5 text-gray-500 rotate-90" />
            </button>
          </div>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {getEventsForDate(selectedDate).length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm">Không có sự kiện nào trong ngày này</p>
              </div>
            ) : (
              getEventsForDate(selectedDate).map((event, index) => (
                <div
                  key={event.id}
                  className="p-4 border-2 border-gray-200 rounded-[12px] hover:border-navy-1 hover:shadow-md transition-all duration-300 bg-white animate-slideUp"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-start gap-3">
                    {(() => {
                      const eventIcon = getEventIcon(event)
                      const IconComponent = eventIcon.icon
                      return (
                        <div className={`p-2 ${eventIcon.bg} rounded-[8px] flex-shrink-0`}>
                          <IconComponent className={`h-5 w-5 ${eventIcon.color}`} />
                        </div>
                      )
                    })()}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-bold text-gray-900">{event.title}</h4>
                        <span className={`text-xs px-2.5 py-1 rounded-[8px] font-semibold ${
                          event.type === 'BOOKING' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {event.type === 'BOOKING' ? 'Đặt lịch' : 'Hoạt động'}
                        </span>
                      </div>
                      {event.description && (
                        <p className="text-sm text-gray-600 mb-3">{event.description}</p>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Clock className="h-4 w-4 text-navy-1" />
                          <span>
                            {new Date(event.start).toLocaleTimeString('vi-VN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} - {new Date(event.end).toLocaleTimeString('vi-VN', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <MapPin className="h-4 w-4 text-navy-1" />
                          <span>
                            {event.culturalCenter.building} - {event.culturalCenter.name}
                            {event.culturalCenter.room && ` - ${event.culturalCenter.room}`}
                          </span>
                        </div>
                        {event.user && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4 text-navy-1" />
                            <span>Người đặt: {event.user.name}</span>
                          </div>
                        )}
                        {event.organizer && (
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Users className="h-4 w-4 text-navy-1" />
                            <span>Người tổ chức: {event.organizer}</span>
                          </div>
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
