'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

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

interface StatisticsFiltersProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  onClear: () => void
}

export default function StatisticsFilters({ filters, onFiltersChange, onClear }: StatisticsFiltersProps) {
  const [districts, setDistricts] = useState<Array<{ id: string; name: string }>>([])
  const [wards, setWards] = useState<string[]>([])
  const [ethnicities, setEthnicities] = useState<string[]>([])
  const [religions, setReligions] = useState<string[]>([])
  const [educations, setEducations] = useState<string[]>([])

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  const fetchFilterOptions = async () => {
    try {
      const [districtsRes, statsRes] = await Promise.all([
        fetch('/api/districts'),
        fetch('/api/dashboard/detailed-stats')
      ])

      if (districtsRes.ok) {
        const districtsData = await districtsRes.json()
        setDistricts(districtsData)
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setEthnicities(Object.keys(statsData.ethnicityStats || {}).sort())
        setReligions(Object.keys(statsData.religionStats || {}).sort())
        setEducations(Object.keys(statsData.educationStats || {}).sort())
        // Get unique wards from wardStats
        if (statsData.wardStats) {
          setWards(Object.keys(statsData.wardStats).sort())
        }
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
    }
  }

  const updateFilter = (key: keyof FilterState, value: any) => {
    onFiltersChange({
      ...filters,
      [key]: value || undefined
    })
  }

  const currentYear = new Date().getFullYear()
  const minBirthYear = 1950
  const maxBirthYear = currentYear

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-gray-900">Bộ lọc thống kê</h3>
        <button
          onClick={onClear}
          className="text-sm text-gray-500 hover:text-gray-700 flex items-center gap-1"
        >
          <X className="h-4 w-4" />
          Xóa tất cả
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Giới tính */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Giới tính</label>
          <select
            value={filters.gender || ''}
            onChange={(e) => updateFilter('gender', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          >
            <option value="">Tất cả</option>
            <option value="Nam">Nam</option>
            <option value="Nữ">Nữ</option>
          </select>
        </div>

        {/* Năm sinh từ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Năm sinh từ</label>
          <input
            type="number"
            min={minBirthYear}
            max={maxBirthYear}
            value={filters.birthYearFrom || ''}
            onChange={(e) => updateFilter('birthYearFrom', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="VD: 1980"
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          />
        </div>

        {/* Năm sinh đến */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Năm sinh đến</label>
          <input
            type="number"
            min={minBirthYear}
            max={maxBirthYear}
            value={filters.birthYearTo || ''}
            onChange={(e) => updateFilter('birthYearTo', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="VD: 2000"
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          />
        </div>

        {/* Độ tuổi từ */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Độ tuổi từ</label>
          <input
            type="number"
            min={0}
            max={120}
            value={filters.ageFrom || ''}
            onChange={(e) => updateFilter('ageFrom', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="VD: 18"
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          />
        </div>

        {/* Độ tuổi đến */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Độ tuổi đến</label>
          <input
            type="number"
            min={0}
            max={120}
            value={filters.ageTo || ''}
            onChange={(e) => updateFilter('ageTo', e.target.value ? parseInt(e.target.value) : undefined)}
            placeholder="VD: 65"
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          />
        </div>

        {/* Khu phố */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Khu phố</label>
          <select
            value={filters.districtId || ''}
            onChange={(e) => {
              updateFilter('districtId', e.target.value)
              updateFilter('ward', undefined) // Reset ward when district changes
            }}
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          >
            <option value="">Tất cả</option>
            {districts.map((district) => (
              <option key={district.id} value={district.id}>
                {district.name}
              </option>
            ))}
          </select>
        </div>

        {/* Phường/Xã */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Phường/Xã</label>
          <select
            value={filters.ward || ''}
            onChange={(e) => updateFilter('ward', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          >
            <option value="">Tất cả</option>
            {wards.map((ward) => (
              <option key={ward} value={ward}>
                {ward}
              </option>
            ))}
          </select>
        </div>

        {/* Dân tộc */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dân tộc</label>
          <select
            value={filters.ethnicity || ''}
            onChange={(e) => updateFilter('ethnicity', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          >
            <option value="">Tất cả</option>
            {ethnicities.map((ethnicity) => (
              <option key={ethnicity} value={ethnicity}>
                {ethnicity}
              </option>
            ))}
          </select>
        </div>

        {/* Tôn giáo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tôn giáo</label>
          <select
            value={filters.religion || ''}
            onChange={(e) => updateFilter('religion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          >
            <option value="">Tất cả</option>
            {religions.map((religion) => (
              <option key={religion} value={religion}>
                {religion}
              </option>
            ))}
          </select>
        </div>

        {/* Trình độ học vấn */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trình độ học vấn</label>
          <select
            value={filters.education || ''}
            onChange={(e) => updateFilter('education', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          >
            <option value="">Tất cả</option>
            {educations.map((education) => (
              <option key={education} value={education}>
                {education}
              </option>
            ))}
          </select>
        </div>

        {/* Trạng thái */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái</label>
          <select
            value={filters.status || ''}
            onChange={(e) => updateFilter('status', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-[8px] focus:outline-none focus:ring-2 focus:ring-navy-1"
          >
            <option value="">Tất cả</option>
            <option value="ACTIVE">Đang thường trú</option>
            <option value="MOVED_OUT">Đã chuyển đi</option>
            <option value="DECEASED">Đã qua đời</option>
          </select>
        </div>
      </div>

      {/* Quick Filters */}
      <div className="pt-4 border-t">
        <p className="text-sm font-medium text-gray-700 mb-3">Bộ lọc nhanh:</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => updateFilter('gender', 'Nam')}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-[8px] transition-colors"
          >
            Nam giới
          </button>
          <button
            onClick={() => updateFilter('gender', 'Nữ')}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-[8px] transition-colors"
          >
            Nữ giới
          </button>
          <button
            onClick={() => {
              updateFilter('ageFrom', 18)
              updateFilter('ageTo', 60)
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-[8px] transition-colors"
          >
            Độ tuổi lao động (18-60)
          </button>
          <button
            onClick={() => {
              updateFilter('ageFrom', 65)
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-[8px] transition-colors"
          >
            Người cao tuổi (65+)
          </button>
          <button
            onClick={() => {
              updateFilter('ageFrom', 0)
              updateFilter('ageTo', 17)
            }}
            className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 rounded-[8px] transition-colors"
          >
            Trẻ em (0-17)
          </button>
        </div>
      </div>
    </div>
  )
}

