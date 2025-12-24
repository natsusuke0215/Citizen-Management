'use client'

import { useState, useEffect } from 'react'
import { Users, Building, FileText, Calendar, TrendingUp, AlertCircle, Baby, Skull, ArrowRight, ArrowLeft, Users2, MapPin, TrendingDown } from 'lucide-react'
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
        
        {/* Basic Stats - Enhanced Design with New Color Palette */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {/* Total Persons Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-navy-1 to-navy-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                  <Users className="h-7 w-7" />
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-80">Tổng số</div>
                  <div className="text-sm font-semibold">Nhân khẩu</div>
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">
                {detailedStats?.totalPersons.toLocaleString() || stats.totalPersons.toLocaleString()}
              </div>
              <div className="flex items-center text-sm opacity-90">
                <TrendingUp className="h-4 w-4 mr-1" />
                <span>Dữ liệu thực tế</span>
              </div>
            </div>
          </div>

          {/* Total Households Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-navy-2 to-navy-3 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                  <Building className="h-7 w-7" />
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-80">Tổng số</div>
                  <div className="text-sm font-semibold">Hộ khẩu</div>
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">
                {detailedStats?.totalHouseholds.toLocaleString() || stats.totalHouseholds.toLocaleString()}
              </div>
              <div className="flex items-center text-sm opacity-90">
                <Building className="h-4 w-4 mr-1" />
                <span>Đã đăng ký</span>
              </div>
            </div>
          </div>

          {/* Population Density Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-navy-3 to-navy-1 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                  <MapPin className="h-7 w-7" />
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-80">Mật độ</div>
                  <div className="text-sm font-semibold">Dân cư</div>
                </div>
              </div>
              <div className="text-4xl font-bold mb-2">
                {detailedStats?.populationDensity.toFixed(1) || '0.0'}
              </div>
              <div className="text-sm opacity-90">người/km²</div>
            </div>
          </div>

          {/* Total Districts Card */}
          <div className="group relative overflow-hidden bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-navy-1 opacity-10 rounded-full -mr-16 -mt-16"></div>
            <div className="p-6 text-navy-1">
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 bg-navy-1 bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                  <Users2 className="h-7 w-7 text-navy-1" />
                </div>
                <div className="text-right">
                  <div className="text-xs opacity-80">Tổng số</div>
                  <div className="text-sm font-semibold">Khu phố</div>
                </div>
              </div>
              <div className="text-4xl font-bold mb-2 text-navy-1">
                {stats.totalDistricts.toLocaleString()}
              </div>
              <div className="flex items-center text-sm opacity-90 text-navy-2">
                <MapPin className="h-4 w-4 mr-1" />
                <span>Khu vực</span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Statistics */}
        {detailedStats && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Age Groups - Enhanced with Chart */}
            <div className="card hover:shadow-drop-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Phân bố theo độ tuổi</h3>
                <div className="text-xs text-gray-500 bg-yellow-2 px-2 py-1 rounded-[8px]">
                  {detailedStats.totalPersons} người
                </div>
              </div>
              
              {/* Bar Chart for Age Groups */}
              <div className="mb-6 h-48">
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
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        `${value} người (${props.payload.percentage}%)`,
                        'Số lượng'
                      ]}
                    />
                    <Bar dataKey="value" fill="#516089" radius={[8, 8, 0, 0]}>
                      {Object.entries(detailedStats.ageGroups).map((_, index) => (
                        <Cell key={`cell-${index}`} fill={['#516089', '#586995', '#7874F9', '#E9B880', '#F1E4D2'][index] || '#516089'} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed List */}
              <div className="space-y-3 border-t pt-4">
                {Object.entries(detailedStats.ageGroups).map(([age, count]) => {
                  const percentage = detailedStats.totalPersons > 0 ? (count / detailedStats.totalPersons) * 100 : 0
                  return (
                    <div key={age} className="flex items-center justify-between group">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{age} tuổi</span>
                          <span className="text-sm font-semibold text-gray-900">{count.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-yellow-2 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-navy-1 to-navy-3 h-2.5 rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Gender Stats - Enhanced with Pie Chart */}
            <div className="card hover:shadow-drop-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Phân bố theo giới tính</h3>
                <div className="text-xs text-gray-500 bg-yellow-2 px-2 py-1 rounded-[8px]">
                  {detailedStats.totalPersons} người
                </div>
              </div>

              {/* Pie Chart for Gender */}
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
                      label={({ name, percentage, cx, cy, midAngle, innerRadius, outerRadius }) => {
                        const RADIAN = Math.PI / 180;
                        const radius = outerRadius + 25;
                        const x = cx + radius * Math.cos(-midAngle * RADIAN);
                        const y = cy + radius * Math.sin(-midAngle * RADIAN);
                        
                        return (
                          <text 
                            x={x} 
                            y={y} 
                            fill="#374151" 
                            textAnchor={x > cx ? 'start' : 'end'} 
                            dominantBaseline="central"
                            className="text-sm font-medium"
                          >
                            {`${name}: ${percentage}%`}
                          </text>
                        );
                      }}
                      outerRadius={80}
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
                        borderRadius: '8px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                      }}
                      formatter={(value: number, name: string, props: any) => [
                        `${value} người (${props.payload.percentage}%)`,
                        'Số lượng'
                      ]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Detailed List */}
              <div className="space-y-3 border-t pt-4">
                {Object.entries(detailedStats.genderStats).map(([gender, count]) => {
                  const percentage = detailedStats.totalPersons > 0 ? (count / detailedStats.totalPersons) * 100 : 0
                  const colorClass = gender === 'Nam' ? 'from-navy-1 to-navy-2' : gender === 'Nữ' ? 'from-navy-3 to-navy-2' : 'from-yellow-1 to-yellow-2'
                  return (
                    <div key={gender} className="flex items-center justify-between group">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{gender}</span>
                          <span className="text-sm font-semibold text-gray-900">{count.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-yellow-2 rounded-full h-2.5 overflow-hidden">
                          <div
                            className={`bg-gradient-to-r ${colorClass} h-2.5 rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Ethnicity Stats - Enhanced */}
            <div className="card hover:shadow-drop-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Phân bố theo dân tộc</h3>
                {Object.keys(detailedStats.ethnicityStats).length > 0 && (
                  <div className="text-xs text-gray-500 bg-yellow-2 px-2 py-1 rounded-[8px]">
                    {Object.keys(detailedStats.ethnicityStats).length} nhóm
                  </div>
                )}
              </div>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {Object.keys(detailedStats.ethnicityStats).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <Users className="h-12 w-12 mb-2 opacity-50" />
                    <p className="text-sm">Chưa có dữ liệu</p>
                  </div>
                ) : (
                  Object.entries(detailedStats.ethnicityStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([ethnicity, count], index) => {
                      const percentage = detailedStats.totalPersons > 0 ? (count / detailedStats.totalPersons) * 100 : 0
                      return (
                        <div key={ethnicity} className="flex items-center justify-between group p-2 rounded-[8px] hover:bg-yellow-2 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{ethnicity}</span>
                              <span className="text-sm font-semibold text-gray-900">{count.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-yellow-2 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-navy-2 to-navy-3 h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      )
                    })
                )}
              </div>
            </div>

            {/* Religion Stats - Enhanced */}
            <div className="card hover:shadow-drop-lg transition-shadow duration-300">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Phân bố theo tôn giáo</h3>
                {Object.keys(detailedStats.religionStats).length > 0 && (
                  <div className="text-xs text-gray-500 bg-yellow-2 px-2 py-1 rounded-[8px]">
                    {Object.keys(detailedStats.religionStats).length} nhóm
                  </div>
                )}
              </div>
              <div className="space-y-3">
                {Object.keys(detailedStats.religionStats).length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                    <FileText className="h-12 w-12 mb-2 opacity-50" />
                    <p className="text-sm">Chưa có dữ liệu</p>
                  </div>
                ) : (
                  Object.entries(detailedStats.religionStats)
                    .sort(([, a], [, b]) => b - a)
                    .map(([religion, count]) => {
                      const percentage = detailedStats.totalPersons > 0 ? (count / detailedStats.totalPersons) * 100 : 0
                      return (
                        <div key={religion} className="flex items-center justify-between group p-2 rounded-[8px] hover:bg-yellow-2 transition-colors">
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-sm font-medium text-gray-700">{religion}</span>
                              <span className="text-sm font-semibold text-gray-900">{count.toLocaleString()}</span>
                            </div>
                            <div className="w-full bg-yellow-2 rounded-full h-2.5 overflow-hidden">
                              <div
                                className="bg-gradient-to-r from-navy-1 to-navy-3 h-2.5 rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${percentage}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                          </div>
                        </div>
                      )
                    })
                )}
              </div>
            </div>

            {/* Births and Deaths - Enhanced */}
            <div className="card hover:shadow-drop-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Sinh tử</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="group relative overflow-hidden p-5 bg-gradient-to-br from-yellow-2 to-gradient-1 rounded-[15px] border border-yellow-1 hover:border-navy-3 transition-all duration-300 shadow-drop">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-1 opacity-20 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-navy-1 rounded-[8px]">
                        <Baby className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Sinh</span>
                    </div>
                    <div className="text-3xl font-bold text-navy-1 mb-1">
                      {detailedStats.births.thisYear.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Năm {new Date().getFullYear()}</div>
                    {detailedStats.births.total > 0 && (
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-yellow-1">
                        Tổng: {detailedStats.births.total.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="group relative overflow-hidden p-5 bg-gradient-to-br from-yellow-2 to-gradient-1 rounded-[15px] border border-yellow-1 hover:border-navy-3 transition-all duration-300 shadow-drop">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-navy-1 opacity-20 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-navy-2 rounded-[8px]">
                        <Skull className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Tử</span>
                    </div>
                    <div className="text-3xl font-bold text-navy-2 mb-1">
                      {detailedStats.deaths.thisYear.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Năm {new Date().getFullYear()}</div>
                    {detailedStats.deaths.total > 0 && (
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-yellow-1">
                        Tổng: {detailedStats.deaths.total.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Move In/Out - Enhanced */}
            <div className="card hover:shadow-drop-lg transition-shadow duration-300">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chuyển đi / Chuyển đến</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="group relative overflow-hidden p-5 bg-gradient-to-br from-yellow-2 to-gradient-1 rounded-[15px] border border-yellow-1 hover:border-navy-3 transition-all duration-300 shadow-drop">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-navy-3 opacity-20 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-navy-3 rounded-[8px]">
                        <ArrowRight className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Chuyển đi</span>
                    </div>
                    <div className="text-3xl font-bold text-navy-3 mb-1">
                      {detailedStats.movedOut.thisYear.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Năm {new Date().getFullYear()}</div>
                    {detailedStats.movedOut.total > 0 && (
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-yellow-1">
                        Tổng: {detailedStats.movedOut.total.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="group relative overflow-hidden p-5 bg-gradient-to-br from-yellow-2 to-gradient-1 rounded-[15px] border border-yellow-1 hover:border-navy-3 transition-all duration-300 shadow-drop">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-1 opacity-20 rounded-full -mr-10 -mt-10"></div>
                  <div className="relative">
                    <div className="flex items-center gap-2 mb-3">
                      <div className="p-2 bg-navy-2 rounded-[8px]">
                        <ArrowLeft className="h-5 w-5 text-white" />
                      </div>
                      <span className="text-sm font-semibold text-gray-700">Chuyển đến</span>
                    </div>
                    <div className="text-3xl font-bold text-navy-2 mb-1">
                      {detailedStats.movedIn.thisYear.toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-600 font-medium">Năm {new Date().getFullYear()}</div>
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
