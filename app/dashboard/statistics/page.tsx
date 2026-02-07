'use client'

import { useState, useEffect, useCallback } from 'react'
import { BarChart3, Download, RefreshCw } from 'lucide-react'
import QueryBuilder from './components/QueryBuilder'
import StatsSummary from './components/StatsSummary'
import YearOfBirthChart from './components/YearOfBirthChart'
import EthnicityChart from './components/EthnicityChart'
import DistrictChart from './components/DistrictChart'
import GenderStatsChart from '../components/GenderStatsChart'
import AgeGroupsChart from '../components/AgeGroupsChart'

interface StatisticsData {
  total: number
  genderStats: {
    'Nam': number
    'Nữ': number
    'Khác': number
  }
  ageGroups: {
    '0-17': number
    '18-30': number
    '31-50': number
    '51-65': number
    '65+': number
  }
  birthYearStats: Record<number, number>
  districtStats: Record<string, number>
  wardStats: Record<string, number>
  ethnicityStats: Record<string, number>
  religionStats: Record<string, number>
  educationStats: Record<string, number>
  occupationStats: Record<string, number>
  persons: any[]
}

export default function StatisticsPage() {
  const [data, setData] = useState<StatisticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<any>({})

  const fetchStatistics = useCallback(async (currentFilters: any) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      if (currentFilters.gender) params.append('gender', currentFilters.gender)
      if (currentFilters.birthYear) params.append('birthYear', currentFilters.birthYear)
      if (currentFilters.minAge) params.append('minAge', currentFilters.minAge)
      if (currentFilters.maxAge) params.append('maxAge', currentFilters.maxAge)
      if (currentFilters.districtId) params.append('districtId', currentFilters.districtId)
      if (currentFilters.ward) params.append('ward', currentFilters.ward)
      if (currentFilters.ethnicity) params.append('ethnicity', currentFilters.ethnicity)
      if (currentFilters.religion) params.append('religion', currentFilters.religion)
      if (currentFilters.education) params.append('education', currentFilters.education)
      if (currentFilters.occupation) params.append('occupation', currentFilters.occupation)
      if (currentFilters.status) params.append('status', currentFilters.status)

      const response = await fetch(`/api/persons/advanced-stats?${params.toString()}`)
      if (response.ok) {
        const result = await response.json()
        setData(result)
      } else {
        console.error('Error fetching statistics')
      }
    } catch (error) {
      console.error('Error fetching statistics:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStatistics(filters)
  }, [filters, fetchStatistics])

  const handleExport = () => {
    if (!data) return
    
    // Create CSV content
    const headers = ['Họ tên', 'Ngày sinh', 'Giới tính', 'Dân tộc', 'Tôn giáo', 'Trình độ học vấn', 'Nghề nghiệp', 'Khu phố', 'Phường/Xã', 'Trạng thái']
    const rows = data.persons.map(person => [
      person.fullName,
      new Date(person.dateOfBirth).toLocaleDateString('vi-VN'),
      person.gender,
      person.ethnicity || '',
      person.religion || '',
      person.education || '',
      person.occupation || '',
      person.household.districtName || person.household.district || '',
      person.household.ward || '',
      person.status
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')

    // Download CSV
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `thong-ke-nhan-khau-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading && !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-32 w-32 border-4 border-navy-1/20 border-t-navy-1 mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <BarChart3 className="h-12 w-12 text-navy-1 animate-pulse" />
            </div>
          </div>
          <p className="text-gray-600 text-lg font-medium mt-4">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[15px]">
            <BarChart3 className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thống kê nhân khẩu</h1>
            <p className="text-gray-600 mt-1">Phân tích và truy vấn dữ liệu nhân khẩu chi tiết</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => fetchStatistics(filters)}
            disabled={loading}
            className="px-4 py-2.5 bg-white border border-gray-300 text-gray-700 rounded-[10px] hover:bg-gray-50 transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Làm mới
          </button>
          {data && data.persons.length > 0 && (
            <button
              onClick={handleExport}
              className="px-4 py-2.5 bg-gradient-to-br from-navy-1 to-navy-2 text-white rounded-[10px] hover:shadow-drop-lg transition-all flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Xuất Excel
            </button>
          )}
        </div>
      </div>

      {/* Query Builder */}
      <QueryBuilder onFilterChange={setFilters} />

      {/* Statistics Summary */}
      {data && (
        <>
          {/* Results Banner */}
          <div className="bg-gradient-to-r from-navy-1 via-navy-2 to-navy-3 rounded-[24px] shadow-drop-lg p-8 border border-navy-1/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white opacity-5 rounded-full -mr-48 -mt-48"></div>
            <div className="absolute bottom-0 left-0 w-72 h-72 bg-yellow-2 opacity-10 rounded-full -ml-36 -mb-36"></div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-[12px]">
                      <BarChart3 className="h-6 w-6 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-white">Kết quả truy vấn</h2>
                  </div>
                  <p className="text-white/90 text-lg">
                    Tìm thấy <span className="font-bold text-yellow-2 text-2xl">{data.total.toLocaleString()}</span> nhân khẩu phù hợp
                  </p>
                </div>
                {data.total > 0 && (
                  <button
                    onClick={handleExport}
                    className="px-6 py-3 bg-white text-navy-1 rounded-[12px] hover:shadow-lg transition-all flex items-center gap-2 font-semibold transform hover:-translate-y-0.5"
                  >
                    <Download className="h-5 w-5" />
                    Xuất Excel
                  </button>
                )}
              </div>
            </div>
          </div>

          <StatsSummary
            total={data.total}
            genderStats={data.genderStats}
            ageGroups={data.ageGroups}
          />

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gender Chart */}
            <GenderStatsChart
              genderStats={data.genderStats}
              totalPersons={data.total}
            />

            {/* Age Groups Chart */}
            <AgeGroupsChart
              ageGroups={data.ageGroups}
              totalPersons={data.total}
            />

            {/* Year of Birth Chart */}
            {Object.keys(data.birthYearStats).length > 0 && (
              <YearOfBirthChart
                birthYearStats={data.birthYearStats}
                total={data.total}
              />
            )}

            {/* District Chart */}
            {Object.keys(data.districtStats).length > 0 && (
              <DistrictChart
                districtStats={data.districtStats}
                total={data.total}
              />
            )}

            {/* Ethnicity Chart */}
            {Object.keys(data.ethnicityStats).length > 0 && (
              <EthnicityChart
                ethnicityStats={data.ethnicityStats}
                total={data.total}
              />
            )}

            {/* Religion Chart (if data exists) */}
            {Object.keys(data.religionStats).length > 0 && (
              <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Phân bố theo tôn giáo</h3>
                <div className="space-y-3">
                  {Object.entries(data.religionStats)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([religion, count]) => {
                      const percentage = data.total > 0 ? (count / data.total) * 100 : 0
                      return (
                        <div key={religion}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">{religion}</span>
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
            )}

            {/* Education Chart (if data exists) */}
            {Object.keys(data.educationStats).length > 0 && (
              <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Phân bố theo trình độ học vấn</h3>
                <div className="space-y-3">
                  {Object.entries(data.educationStats)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 10)
                    .map(([education, count]) => {
                      const percentage = data.total > 0 ? (count / data.total) * 100 : 0
                      return (
                        <div key={education}>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-semibold text-gray-700">{education}</span>
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
            )}
          </div>

        </>
      )}

      {!loading && data && data.total === 0 && (
        <div className="bg-white rounded-[20px] shadow-drop p-12 text-center">
          <BarChart3 className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-900 mb-2">Không tìm thấy dữ liệu</h3>
          <p className="text-gray-600">Vui lòng thử điều chỉnh bộ lọc để tìm kiếm</p>
        </div>
      )}
    </div>
  )
}

