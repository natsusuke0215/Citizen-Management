'use client'

import { useState, useEffect, useRef } from 'react'
import { Users, Building, FileText, Calendar, TrendingUp, AlertCircle, Baby, Skull, ArrowRight, ArrowLeft, Users2, MapPin, TrendingDown, Sparkles, Clock, Zap } from 'lucide-react'
import CalendarView from '@/components/CalendarView'
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

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

// Animated Counter Component
function AnimatedCounter({ value, duration = 2000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number | null = null
    const startValue = 0
    const endValue = value

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)
      
      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentValue = Math.floor(startValue + (endValue - startValue) * easeOutQuart)
      
      setCount(currentValue)
      
      if (progress < 1) {
        requestAnimationFrame(animate)
      } else {
        setCount(endValue)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, value, duration])

  return <span ref={ref}>{count.toLocaleString()}</span>
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header with Animation */}
      <div className="relative overflow-hidden bg-gradient-to-br from-navy-1 via-navy-2 to-navy-3 rounded-[20px] shadow-drop-lg p-8 text-white">
        <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-white opacity-5 rounded-full -ml-36 -mb-36"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-white bg-opacity-20 rounded-[12px] backdrop-blur-sm animate-pulse">
                  <Sparkles className="h-8 w-8" />
                </div>
                <h1 className="text-4xl font-bold">Tổng quan hệ thống</h1>
              </div>
              <p className="text-lg opacity-90 mb-2">
                Thống kê tổng quan về hệ thống quản lý nhân khẩu và nhà văn hóa
              </p>
              <div className="flex items-center gap-2 text-sm opacity-80">
                <Clock className="h-4 w-4" />
                <span>
                  {currentTime.toLocaleDateString('vi-VN', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })} • {currentTime.toLocaleTimeString('vi-VN', { 
                    hour: '2-digit', 
                    minute: '2-digit' 
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Cards with Animation */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Persons Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-navy-1 to-navy-2 rounded-[20px] shadow-drop hover:shadow-drop-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-slideUp" style={{ animationDelay: '0.1s' }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-[12px] backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
                <Users className="h-7 w-7" />
              </div>
              <TrendingUp className="h-5 w-5 opacity-80" />
            </div>
            <div className="text-5xl font-bold mb-2">
              <AnimatedCounter value={detailedStats?.totalPersons || stats.totalPersons} />
            </div>
            <div className="text-sm opacity-90 font-medium">Tổng số nhân khẩu</div>
            <div className="mt-2 text-xs opacity-75">Dữ liệu thực tế</div>
          </div>
        </div>

        {/* Total Households Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-navy-2 to-navy-3 rounded-[20px] shadow-drop hover:shadow-drop-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-slideUp" style={{ animationDelay: '0.2s' }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-[12px] backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
                <Building className="h-7 w-7" />
              </div>
              <Building className="h-5 w-5 opacity-80" />
            </div>
            <div className="text-5xl font-bold mb-2">
              <AnimatedCounter value={detailedStats?.totalHouseholds || stats.totalHouseholds} />
            </div>
            <div className="text-sm opacity-90 font-medium">Tổng số hộ khẩu</div>
            <div className="mt-2 text-xs opacity-75">Đã đăng ký</div>
          </div>
        </div>

        {/* Population Density Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-navy-3 to-navy-1 rounded-[20px] shadow-drop hover:shadow-drop-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-slideUp" style={{ animationDelay: '0.3s' }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
          <div className="relative p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-white bg-opacity-20 rounded-[12px] backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
                <MapPin className="h-7 w-7" />
              </div>
              <MapPin className="h-5 w-5 opacity-80" />
            </div>
            <div className="text-5xl font-bold mb-2">
              {detailedStats?.populationDensity.toFixed(1) || '0.0'}
            </div>
            <div className="text-sm opacity-90 font-medium">Mật độ dân cư</div>
            <div className="mt-2 text-xs opacity-75">người/km²</div>
          </div>
        </div>

        {/* Total Districts Card */}
        <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[20px] shadow-drop hover:shadow-drop-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-slideUp" style={{ animationDelay: '0.4s' }}>
          <div className="absolute top-0 right-0 w-40 h-40 bg-navy-1 opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-navy-1 opacity-5 rounded-full -ml-16 -mb-16"></div>
          <div className="relative p-6 text-navy-1">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-navy-1 bg-opacity-20 rounded-[12px] backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300">
                <Users2 className="h-7 w-7 text-navy-1" />
              </div>
              <MapPin className="h-5 w-5 opacity-80" />
            </div>
            <div className="text-5xl font-bold mb-2 text-navy-1">
              <AnimatedCounter value={stats.totalDistricts} />
            </div>
            <div className="text-sm opacity-90 font-medium">Tổng số khu phố</div>
            <div className="mt-2 text-xs opacity-75">Khu vực</div>
          </div>
        </div>
      </div>

      {/* Enhanced Calendar - Full Width */}
      <div className="bg-white rounded-[20px] shadow-drop p-6 animate-fadeIn">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Lịch trình sự kiện</h2>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-yellow-2 rounded-[8px]">
            <Zap className="h-4 w-4 text-navy-1" />
            <span className="text-sm font-medium text-navy-1">{events.length} sự kiện</span>
          </div>
        </div>
        <CalendarView events={events} loading={eventsLoading} />
      </div>

      {/* Statistics Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Thống kê dân cư</h2>
          </div>
        </div>
        
        {/* Detailed Statistics */}
        {detailedStats && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Age Groups Chart */}
            <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Phân bố theo độ tuổi</h3>
                <div className="text-xs text-gray-500 bg-yellow-2 px-3 py-1.5 rounded-[8px] font-medium">
                  {detailedStats.totalPersons} người
                </div>
              </div>
              
              <div className="mb-6 h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={Object.entries(detailedStats.ageGroups).map(([age, count]) => ({
                    name: age.replace('-', '-'),
                    value: count,
                    percentage: detailedStats.totalPersons > 0 ? ((count / detailedStats.totalPersons) * 100).toFixed(1) : 0
                  }))}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number | undefined, name: string | undefined, props: any) => {
                        const val = value || 0
                        return [
                          `${val} người (${props.payload.percentage}%)`,
                          'Số lượng'
                        ]
                      }}
                    />
                    <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                      {Object.entries(detailedStats.ageGroups).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={['#516089', '#586995', '#7874F9', '#E9B880', '#F1E4D2'][index] || '#516089'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 border-t pt-4">
                {Object.entries(detailedStats.ageGroups).map(([age, count]) => {
                  const percentage = detailedStats.totalPersons > 0 ? (count / detailedStats.totalPersons) * 100 : 0
                  return (
                    <div key={age} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{age} tuổi</span>
                        <span className="text-sm font-bold text-gray-900">{count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-yellow-2 rounded-full h-3 overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-navy-1 to-navy-3 h-3 rounded-full transition-all duration-1000 ease-out"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Gender Stats Chart */}
            <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-gray-900">Phân bố theo giới tính</h3>
                <div className="text-xs text-gray-500 bg-yellow-2 px-3 py-1.5 rounded-[8px] font-medium">
                  {detailedStats.totalPersons} người
                </div>
              </div>

              <div className="mb-6 h-64 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={Object.entries(detailedStats.genderStats)
                        .filter(([, count]) => count > 0)
                        .map(([gender, count]) => ({
                          name: gender,
                          value: count,
                          percentage: detailedStats.totalPersons > 0 ? ((count / detailedStats.totalPersons) * 100).toFixed(1) : 0
                        }))}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, cx, cy, midAngle, innerRadius, outerRadius, payload }: any) => {
                        if (!midAngle || !outerRadius) return null
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 25;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        const percentage = payload?.percentage || '0'
                        
                        return (
                          <text 
                            x={x} 
                            y={y} 
                            fill="#374151" 
                            textAnchor={x > cx ? 'start' : 'end'} 
                            dominantBaseline="central"
                            className="text-sm font-semibold"
                          >
                            {`${name}: ${percentage}%`}
                          </text>
                        );
                      }}
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {Object.entries(detailedStats.genderStats)
                        .filter(([, count]) => count > 0)
                        .map(([gender], index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={gender === 'Nam' ? '#516089' : gender === 'Nữ' ? '#7874F9' : '#E9B880'} 
                          />
                        ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'white', 
                        border: '1px solid #e5e7eb',
                        borderRadius: '12px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number | undefined, name: string | undefined, props: any) => {
                        const val = value || 0
                        return [
                          `${val} người (${props.payload.percentage}%)`,
                          'Số lượng'
                        ]
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="space-y-3 border-t pt-4">
                {Object.entries(detailedStats.genderStats).map(([gender, count]) => {
                  const percentage = detailedStats.totalPersons > 0 ? (count / detailedStats.totalPersons) * 100 : 0
                  const colorClass = gender === 'Nam' ? 'from-navy-1 to-navy-2' : gender === 'Nữ' ? 'from-navy-3 to-navy-2' : 'from-yellow-1 to-yellow-2'
                  return (
                    <div key={gender} className="group">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-semibold text-gray-700">{gender}</span>
                        <span className="text-sm font-bold text-gray-900">{count.toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-yellow-2 rounded-full h-3 overflow-hidden">
                        <div
                          className={`bg-gradient-to-r ${colorClass} h-3 rounded-full transition-all duration-1000 ease-out`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Births and Deaths */}
            <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Sinh tử</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-[15px] border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200 opacity-20 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-emerald-500 rounded-[8px]">
                        <Baby className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-emerald-700">Sinh</span>
                    </div>
                    <div className="text-4xl font-bold text-emerald-600 mb-1">
                      <AnimatedCounter value={detailedStats.births.thisYear} />
                    </div>
                    <div className="text-xs text-emerald-600 font-medium">Năm {new Date().getFullYear()}</div>
                    {detailedStats.births.total > 0 && (
                      <div className="text-xs text-emerald-500 mt-2 pt-2 border-t border-emerald-200">
                        Tổng: {detailedStats.births.total.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[15px] border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gray-200 opacity-20 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-gray-500 rounded-[8px]">
                        <Skull className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Tử</span>
                    </div>
                    <div className="text-4xl font-bold text-gray-600 mb-1">
                      <AnimatedCounter value={detailedStats.deaths.thisYear} />
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Năm {new Date().getFullYear()}</div>
                    {detailedStats.deaths.total > 0 && (
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                        Tổng: {detailedStats.deaths.total.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Move In/Out */}
            <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Chuyển đi / Chuyển đến</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-[15px] border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 opacity-20 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-amber-500 rounded-[8px]">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-amber-700">Chuyển đi</span>
                    </div>
                    <div className="text-4xl font-bold text-amber-600 mb-1">
                      <AnimatedCounter value={detailedStats.movedOut.thisYear} />
                    </div>
                    <div className="text-xs text-amber-600 font-medium">Năm {new Date().getFullYear()}</div>
                  </div>
                </div>
                <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-[15px] border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-lg">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 opacity-20 rounded-full -mr-12 -mt-12"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-blue-500 rounded-[8px]">
                        <ArrowLeft className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-blue-700">Chuyển đến</span>
                    </div>
                    <div className="text-4xl font-bold text-blue-600 mb-1">
                      <AnimatedCounter value={detailedStats.movedIn.thisYear} />
                    </div>
                    <div className="text-xs text-blue-600 font-medium">Năm {new Date().getFullYear()}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
