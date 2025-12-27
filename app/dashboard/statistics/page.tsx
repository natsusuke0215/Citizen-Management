'use client'

import { useState, useEffect, useMemo } from 'react'
import { TrendingUp, Filter, Download, RefreshCw } from 'lucide-react'
import AgeGroupsChart from '../components/AgeGroupsChart'
import GenderStatsChart from '../components/GenderStatsChart'
import YearOfBirthChart from '../components/YearOfBirthChart'
import GeographicDistributionChart from '../components/GeographicDistributionChart'
import EthnicityReligionChart from '../components/EthnicityReligionChart'
import HouseholdSizeChart from '../components/HouseholdSizeChart'
import BirthsDeathsCards from '../components/BirthsDeathsCards'
import MoveInOutCards from '../components/MoveInOutCards'
import StatisticsFilters from './components/StatisticsFilters'

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
  educationStats?: Record<string, number>
  occupationStats?: Record<string, number>
  birthYearStats?: Record<number, { total: number; male: number; female: number }>
  districtStats?: Record<string, { name: string; count: number; households: number }>
  wardStats?: Record<string, number>
  householdSizeStats?: Record<number, number>
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

interface FilterState {
  gender?: string
  birthYearFrom?: number
  birthYearTo?: number
  ageFrom?: number
  ageTo?: number
  districtId?: string
  ward?: string
  ethnicity?: string
  religion?: string
  education?: string
  status?: string
}

export default function StatisticsPage() {
  const [detailedStats, setDetailedStats] = useState<DetailedStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState<FilterState>({})
  const [showFilters, setShowFilters] = useState(false)
  const [filteredStats, setFilteredStats] = useState<DetailedStats | null>(null)

  useEffect(() => {
    fetchStats()
  }, [])

  useEffect(() => {
    if (Object.keys(filters).length > 0) {
      applyFilters()
    } else {
      setFilteredStats(null)
    }
  }, [filters, detailedStats])

  const fetchStats = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/dashboard/detailed-stats')
      if (response.ok) {
        const data = await response.json()
        setDetailedStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const applyFilters = async () => {
    try {
      const queryParams = new URLSearchParams()
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value))
        }
      })

      const response = await fetch(`/api/statistics/query?${queryParams.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setFilteredStats(data)
      }
    } catch (error) {
      console.error('Error applying filters:', error)
    }
  }

  const currentStats = filteredStats || detailedStats
  const hasActiveFilters = Object.keys(filters).length > 0

  const handleExport = () => {
    if (!currentStats) return
    
    const data = {
      'Tổng số nhân khẩu': currentStats.totalPersons,
      'Tổng số hộ khẩu': currentStats.totalHouseholds,
      'Mật độ dân cư': currentStats.populationDensity,
      'Giới tính': currentStats.genderStats,
      'Độ tuổi': currentStats.ageGroups,
      'Dân tộc': currentStats.ethnicityStats,
      'Tôn giáo': currentStats.religionStats,
      'Sinh': currentStats.births,
      'Tử': currentStats.deaths,
      'Chuyển đi': currentStats.movedOut,
      'Chuyển đến': currentStats.movedIn,
    }

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `thong-ke-dan-so-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1 mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải dữ liệu thống kê...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
            <TrendingUp className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Thống kê dân số</h1>
            <p className="text-sm text-gray-500 mt-1">
              Tra cứu và phân tích dữ liệu dân cư chi tiết
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 rounded-[10px] font-medium transition-all flex items-center gap-2 ${
              showFilters || hasActiveFilters
                ? 'bg-navy-1 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
            }`}
          >
            <Filter className="h-4 w-4" />
            Bộ lọc {hasActiveFilters && `(${Object.keys(filters).length})`}
          </button>
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-white text-gray-700 rounded-[10px] font-medium hover:bg-gray-50 border border-gray-200 transition-all flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Xuất dữ liệu
          </button>
          <button
            onClick={fetchStats}
            className="px-4 py-2 bg-white text-gray-700 rounded-[10px] font-medium hover:bg-gray-50 border border-gray-200 transition-all flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Làm mới
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="bg-white rounded-[20px] shadow-drop p-6 animate-fadeIn">
          <StatisticsFilters
            filters={filters}
            onFiltersChange={setFilters}
            onClear={() => {
              setFilters({})
              setFilteredStats(null)
            }}
          />
        </div>
      )}

      {/* Active Filters Badge */}
      {hasActiveFilters && (
        <div className="bg-yellow-2 rounded-[15px] p-4 flex items-center gap-2">
          <Filter className="h-5 w-5 text-navy-1" />
          <span className="text-sm font-medium text-navy-1">
            Đang áp dụng bộ lọc. Hiển thị kết quả đã lọc.
          </span>
          <button
            onClick={() => {
              setFilters({})
              setFilteredStats(null)
            }}
            className="ml-auto text-sm text-navy-1 hover:underline font-medium"
          >
            Xóa bộ lọc
          </button>
        </div>
      )}

      {/* Statistics Charts */}
      {currentStats && (
        <>
          {/* Summary Cards */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
            <BirthsDeathsCards
              births={currentStats.births}
              deaths={currentStats.deaths}
            />
            <MoveInOutCards
              movedOut={currentStats.movedOut}
              movedIn={currentStats.movedIn}
            />
          </div>

          {/* Basic Demographics */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
            <AgeGroupsChart
              ageGroups={currentStats.ageGroups}
              totalPersons={currentStats.totalPersons}
            />
            <GenderStatsChart
              genderStats={currentStats.genderStats}
              totalPersons={currentStats.totalPersons}
            />
          </div>

          {/* Birth Year and Geography */}
          {currentStats.birthYearStats && currentStats.districtStats && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
              <YearOfBirthChart
                birthYearStats={currentStats.birthYearStats}
                totalPersons={currentStats.totalPersons}
              />
              <GeographicDistributionChart
                districtStats={currentStats.districtStats}
                wardStats={currentStats.wardStats || {}}
                totalPersons={currentStats.totalPersons}
              />
            </div>
          )}

          {/* Ethnicity/Religion and Household Size */}
          {currentStats.ethnicityStats && currentStats.householdSizeStats && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 mb-6">
              <EthnicityReligionChart
                ethnicityStats={currentStats.ethnicityStats}
                religionStats={currentStats.religionStats}
                totalPersons={currentStats.totalPersons}
              />
              <HouseholdSizeChart
                householdSizeStats={currentStats.householdSizeStats}
                totalHouseholds={currentStats.totalHouseholds}
              />
            </div>
          )}
        </>
      )}

      {!currentStats && (
        <div className="text-center py-12 text-gray-500">
          <TrendingUp className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Không có dữ liệu thống kê</p>
        </div>
      )}
    </div>
  )
}

