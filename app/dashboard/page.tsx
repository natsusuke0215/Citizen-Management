'use client'

import { useState, useEffect } from 'react'
import { Users, Building, FileText, Calendar, TrendingUp, AlertCircle, Baby, Skull, ArrowRight, ArrowLeft, Users2, MapPin } from 'lucide-react'
import CalendarView from '@/components/CalendarView'

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

  useEffect(() => {
    fetchStats()
    fetchDetailedStats()
    fetchEvents()
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
        <p className="mt-1 text-sm text-gray-500">
          Thống kê tổng quan về hệ thống quản lý nhân khẩu và nhà văn hóa
        </p>
      </div>

      {/* Calendar Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Lịch trình sự kiện</h2>
        <CalendarView events={events} loading={eventsLoading} />
      </div>

      {/* Statistics Section */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Thống kê dân cư</h2>
        
        {/* Basic Stats */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-blue-500">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng số nhân khẩu
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {detailedStats?.totalPersons.toLocaleString() || stats.totalPersons.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-green-500">
                  <Building className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Tổng số hộ khẩu
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {detailedStats?.totalHouseholds.toLocaleString() || stats.totalHouseholds.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-purple-500">
                  <MapPin className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Mật độ dân cư
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {detailedStats?.populationDensity.toLocaleString() || '0'} người/km²
                  </dd>
                </dl>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="p-3 rounded-md bg-indigo-500">
                  <Users2 className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    Số khu phố
                  </dt>
                  <dd className="text-2xl font-semibold text-gray-900">
                    {stats.totalDistricts.toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        {detailedStats && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Age Groups */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố theo độ tuổi</h3>
              <div className="space-y-3">
                {Object.entries(detailedStats.ageGroups).map(([age, count]) => (
                  <div key={age} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{age} tuổi</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{
                            width: `${detailedStats.totalPersons > 0 ? (count / detailedStats.totalPersons) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Gender Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố theo giới tính</h3>
              <div className="space-y-3">
                {Object.entries(detailedStats.genderStats).map(([gender, count]) => (
                  <div key={gender} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{gender}</span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div
                          className={`h-2 rounded-full ${
                            gender === 'Nam' ? 'bg-blue-500' : gender === 'Nữ' ? 'bg-pink-500' : 'bg-gray-500'
                          }`}
                          style={{
                            width: `${detailedStats.totalPersons > 0 ? (count / detailedStats.totalPersons) * 100 : 0}%`
                          }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900 w-12 text-right">
                        {count.toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ethnicity Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố theo dân tộc</h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {Object.keys(detailedStats.ethnicityStats).length === 0 ? (
                  <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
                ) : (
                  Object.entries(detailedStats.ethnicityStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([ethnicity, count]) => (
                      <div key={ethnicity} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{ethnicity}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-500 h-2 rounded-full"
                              style={{
                                width: `${detailedStats.totalPersons > 0 ? (count / detailedStats.totalPersons) * 100 : 0}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Religion Stats */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Phân bố theo tôn giáo</h3>
              <div className="space-y-3">
                {Object.keys(detailedStats.religionStats).length === 0 ? (
                  <p className="text-sm text-gray-500">Chưa có dữ liệu</p>
                ) : (
                  Object.entries(detailedStats.religionStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([religion, count]) => (
                      <div key={religion} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{religion}</span>
                        <div className="flex items-center gap-3">
                          <div className="w-32 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full"
                              style={{
                                width: `${detailedStats.totalPersons > 0 ? (count / detailedStats.totalPersons) * 100 : 0}%`
                              }}
                            ></div>
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-12 text-right">
                            {count.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            {/* Births and Deaths */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sinh tử</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Baby className="h-5 w-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Sinh</span>
                  </div>
                  <div className="text-2xl font-bold text-green-600">
                    {detailedStats.births.thisYear.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Năm {new Date().getFullYear()}</div>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Skull className="h-5 w-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">Tử</span>
                  </div>
                  <div className="text-2xl font-bold text-red-600">
                    {detailedStats.deaths.thisYear.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Năm {new Date().getFullYear()}</div>
                </div>
              </div>
            </div>

            {/* Move In/Out */}
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chuyển đi / Chuyển đến</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowRight className="h-5 w-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Chuyển đi</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    {detailedStats.movedOut.thisYear.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Năm {new Date().getFullYear()}</div>
                  <div className="text-xs text-gray-400 mt-1">Tổng: {detailedStats.movedOut.total.toLocaleString()}</div>
                </div>
                <div className="p-4 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <ArrowLeft className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-gray-700">Chuyển đến</span>
                  </div>
                  <div className="text-2xl font-bold text-indigo-600">
                    {detailedStats.movedIn.thisYear.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">Năm {new Date().getFullYear()}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
