'use client'

import { useState, useEffect, useMemo } from 'react'
import { Users, Building, Calendar, Users2, MapPin, Zap, TrendingUp } from 'lucide-react'
import CalendarView from '@/components/CalendarView'
import DashboardHeader from './components/DashboardHeader'
import StatsCard from './components/StatsCard'
import AgeGroupsChart from './components/AgeGroupsChart'
import GenderStatsChart from './components/GenderStatsChart'
import BirthsDeathsCards from './components/BirthsDeathsCards'
import MoveInOutCards from './components/MoveInOutCards'

interface DashboardStats {
  totalHouseholds: number
  totalPersons: number
  totalDistricts: number
  totalRequests: number
  pendingRequests: number
  totalBookings: number
}

interface DetailedStats {
  totalPersons: number
  totalHouseholds: number
  populationDensity: number
  ageGroups: {
    '0-17': number
    '18-30': number
    '31-50': number
    '51-65': number
    '65+': number
  }
  genderStats: {
    'Nam': number
    'Nữ': number
    'Khác': number
  }
  ethnicityStats: Record<string, number>
  religionStats: Record<string, number>
  births: {
    total: number
    thisYear: number
  }
  deaths: {
    total: number
    thisYear: number
  }
  movedOut: {
    total: number
    thisYear: number
  }
  movedIn: {
    thisYear: number
  }
}

interface Event {
  id: string
  title: string
  description: string | null
  start: string
  end: string
  type: 'BOOKING' | 'ACTIVITY'
  status?: string
  visibility?: string
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


export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalHouseholds: 0,
    totalPersons: 0,
    totalDistricts: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalBookings: 0
  })
  const [detailedStats, setDetailedStats] = useState<DetailedStats | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [eventsLoading, setEventsLoading] = useState(true)
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    fetchStats()
    fetchDetailedStats()
    fetchEvents()
    
    // Update time every minute
    const timeInterval = setInterval(() => {
      setCurrentTime(new Date())
    }, 60000)

    return () => clearInterval(timeInterval)
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchDetailedStats = async () => {
    try {
      const response = await fetch('/api/dashboard/detailed-stats')
      if (response.ok) {
        const data = await response.json()
        setDetailedStats(data)
      }
    } catch (error) {
      console.error('Error fetching detailed stats:', error)
    }
  }

  const fetchEvents = async () => {
    try {
      const startDate = new Date()
      const endDate = new Date()
      endDate.setMonth(endDate.getMonth() + 1)
      
      const response = await fetch(
        `/api/events?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}`
      )
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setEventsLoading(false)
    }
  }

  // Move useMemo before early return to follow Rules of Hooks
  const statsCards = useMemo(() => [
    {
      title: 'Tổng số nhân khẩu',
      value: detailedStats?.totalPersons || stats.totalPersons,
      subtitle: 'Dữ liệu thực tế',
      icon: Users,
      gradient: 'bg-gradient-to-br from-navy-1 to-navy-2',
      iconBg: 'bg-white bg-opacity-20',
      delay: '0.1s'
    },
    {
      title: 'Tổng số hộ khẩu',
      value: detailedStats?.totalHouseholds || stats.totalHouseholds,
      subtitle: 'Đã đăng ký',
      icon: Building,
      gradient: 'bg-gradient-to-br from-navy-2 to-navy-3',
      iconBg: 'bg-white bg-opacity-20',
      delay: '0.2s'
    },
    {
      title: 'Mật độ dân cư',
      value: detailedStats?.populationDensity.toFixed(1) || '0.0',
      subtitle: 'người/km²',
      icon: MapPin,
      gradient: 'bg-gradient-to-br from-navy-3 to-navy-1',
      iconBg: 'bg-white bg-opacity-20',
      delay: '0.3s',
      useCounter: false
    },
    {
      title: 'Tổng số khu phố',
      value: stats.totalDistricts,
      subtitle: 'Khu vực',
      icon: Users2,
      gradient: 'bg-gradient-to-br from-yellow-1 to-yellow-2',
      iconBg: 'bg-navy-1 bg-opacity-20',
      delay: '0.4s',
      textColor: 'text-navy-1'
    }
  ], [detailedStats, stats])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1 dark:border-navy-3 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <DashboardHeader currentTime={currentTime} />

      {/* Quick Stats Cards */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((card, index) => (
          <StatsCard key={index} {...card} />
        ))}
      </div>

      {/* Enhanced Calendar - Full Width */}
      <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-drop p-6 animate-fadeIn border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 dark:from-navy-2 dark:to-navy-3 rounded-[10px]">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Lịch trình sự kiện</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-2 dark:bg-navy-1/30 rounded-[8px]">
            <Zap className="h-4 w-4 text-navy-1 dark:text-navy-3" />
            <span className="text-sm font-medium text-navy-1 dark:text-navy-3">{events.length} sự kiện</span>
          </div>
        </div>
        <CalendarView events={events} loading={eventsLoading} />
      </div>

      {/* Statistics Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 dark:from-navy-2 dark:to-navy-3 rounded-[10px]">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Thống kê dân cư</h2>
          </div>
        </div>
        
        {/* Detailed Statistics */}
        {detailedStats && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <AgeGroupsChart
              ageGroups={detailedStats.ageGroups}
              totalPersons={detailedStats.totalPersons}
            />
            <GenderStatsChart
              genderStats={detailedStats.genderStats}
              totalPersons={detailedStats.totalPersons}
            />
            <BirthsDeathsCards
              births={detailedStats.births}
              deaths={detailedStats.deaths}
            />
            <MoveInOutCards
              movedOut={detailedStats.movedOut}
              movedIn={detailedStats.movedIn}
            />
          </div>
        )}
      </div>
    </div>
  )
}
