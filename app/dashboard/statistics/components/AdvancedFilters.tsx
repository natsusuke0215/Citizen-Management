'use client'

import { useState, useEffect } from 'react'
import { Filter, X, Search, Calendar, Users, MapPin, GraduationCap, Briefcase } from 'lucide-react'

interface FilterOptions {
  genders: string[]
  ethnicities: string[]
  religions: string[]
  educations: string[]
  occupations: string[]
  statuses: string[]
  districts: { id: string; name: string }[]
  wards: string[]
  birthYearRange: { min: number; max: number }
}

interface AdvancedFiltersProps {
  onFilterChange: (filters: any) => void
}

export default function AdvancedFilters({ onFilterChange }: AdvancedFiltersProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [isExpanded, setIsExpanded] = useState(false)

  const [filters, setFilters] = useState({
    gender: '',
    birthYear: '',
    minAge: '',
    maxAge: '',
    districtId: '',
    ward: '',
    ethnicity: '',
    religion: '',
    education: '',
    occupation: '',
    status: 'ACTIVE'
  })

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  useEffect(() => {
    onFilterChange(filters)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters])

  const fetchFilterOptions = async () => {
    try {
      const response = await fetch('/api/persons/filter-options')
      if (response.ok) {
        const data = await response.json()
        setFilterOptions(data)
      }
    } catch (error) {
      console.error('Error fetching filter options:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const clearFilters = () => {
    setFilters({
      gender: '',
      birthYear: '',
      minAge: '',
      maxAge: '',
      districtId: '',
      ward: '',
      ethnicity: '',
      religion: '',
      education: '',
      occupation: '',
      status: 'ACTIVE'
    })
  }

  const hasActiveFilters = Object.values(filters).some(
    (value, index) => index !== Object.keys(filters).indexOf('status') && value !== '' && value !== 'ACTIVE'
  )

  if (loading || !filterOptions) {
    return (
      <div className="bg-white rounded-[20px] shadow-drop p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/4"></div>
          <div className="h-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Bộ lọc nâng cao</h3>
        </div>
        <div className="flex items-center gap-2">
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="px-3 py-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-[8px] transition-colors flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Xóa bộ lọc
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1.5 text-sm font-medium text-navy-1 hover:bg-navy-1 hover:text-white rounded-[8px] transition-colors"
          >
            {isExpanded ? 'Thu gọn' : 'Mở rộng'}
          </button>
        </div>
      </div>

      <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 transition-all duration-300 ${isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
        {/* Gender Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Users className="h-4 w-4 text-navy-1" />
            Giới tính
          </label>
          <select
            value={filters.gender}
            onChange={(e) => handleFilterChange('gender', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
          >
            <option value="">Tất cả</option>
            {filterOptions.genders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        {/* Birth Year Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Calendar className="h-4 w-4 text-navy-1" />
            Năm sinh
          </label>
          <input
            type="number"
            value={filters.birthYear}
            onChange={(e) => handleFilterChange('birthYear', e.target.value)}
            placeholder="VD: 1982, 2005"
            min={filterOptions.birthYearRange.min}
            max={filterOptions.birthYearRange.max}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
          />
        </div>

        {/* Age Range */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Users className="h-4 w-4 text-navy-1" />
            Độ tuổi
          </label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              value={filters.minAge}
              onChange={(e) => handleFilterChange('minAge', e.target.value)}
              placeholder="Từ"
              min="0"
              max="120"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
            />
            <span className="text-gray-500">-</span>
            <input
              type="number"
              value={filters.maxAge}
              onChange={(e) => handleFilterChange('maxAge', e.target.value)}
              placeholder="Đến"
              min="0"
              max="120"
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
            />
          </div>
        </div>

        {/* District Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin className="h-4 w-4 text-navy-1" />
            Khu phố
          </label>
          <select
            value={filters.districtId}
            onChange={(e) => {
              handleFilterChange('districtId', e.target.value)
              handleFilterChange('ward', '') // Reset ward when district changes
            }}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
          >
            <option value="">Tất cả</option>
            {filterOptions.districts.map(district => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </select>
        </div>

        {/* Ward Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <MapPin className="h-4 w-4 text-navy-1" />
            Phường/Xã
          </label>
          <select
            value={filters.ward}
            onChange={(e) => handleFilterChange('ward', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
            disabled={!filters.districtId}
          >
            <option value="">Tất cả</option>
            {filterOptions.wards.map(ward => (
              <option key={ward} value={ward}>{ward}</option>
            ))}
          </select>
        </div>

        {/* Status Filter */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
            <Users className="h-4 w-4 text-navy-1" />
            Trạng thái
          </label>
          <select
            value={filters.status}
            onChange={(e) => handleFilterChange('status', e.target.value)}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
          >
            {filterOptions.statuses.map(status => (
              <option key={status} value={status}>
                {status === 'ACTIVE' ? 'Đang thường trú' : 
                 status === 'MOVED_OUT' ? 'Đã chuyển đi' : 
                 status === 'DECEASED' ? 'Đã qua đời' : status}
              </option>
            ))}
          </select>
        </div>

        {/* Ethnicity Filter */}
        {filterOptions.ethnicities.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users className="h-4 w-4 text-navy-1" />
              Dân tộc
            </label>
            <select
              value={filters.ethnicity}
              onChange={(e) => handleFilterChange('ethnicity', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
            >
              <option value="">Tất cả</option>
              {filterOptions.ethnicities.map(ethnicity => (
                <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
              ))}
            </select>
          </div>
        )}

        {/* Religion Filter */}
        {filterOptions.religions.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Users className="h-4 w-4 text-navy-1" />
              Tôn giáo
            </label>
            <select
              value={filters.religion}
              onChange={(e) => handleFilterChange('religion', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
            >
              <option value="">Tất cả</option>
              {filterOptions.religions.map(religion => (
                <option key={religion} value={religion}>{religion}</option>
              ))}
            </select>
          </div>
        )}

        {/* Education Filter */}
        {filterOptions.educations.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <GraduationCap className="h-4 w-4 text-navy-1" />
              Trình độ học vấn
            </label>
            <select
              value={filters.education}
              onChange={(e) => handleFilterChange('education', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
            >
              <option value="">Tất cả</option>
              {filterOptions.educations.map(education => (
                <option key={education} value={education}>{education}</option>
              ))}
            </select>
          </div>
        )}

        {/* Occupation Filter */}
        {filterOptions.occupations.length > 0 && (
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-semibold text-gray-700">
              <Briefcase className="h-4 w-4 text-navy-1" />
              Nghề nghiệp
            </label>
            <select
              value={filters.occupation}
              onChange={(e) => handleFilterChange('occupation', e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all"
            >
              <option value="">Tất cả</option>
              {filterOptions.occupations.map(occupation => (
                <option key={occupation} value={occupation}>{occupation}</option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Active Filters Summary */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm font-semibold text-gray-700">Bộ lọc đang áp dụng:</span>
            {filters.gender && (
              <span className="px-3 py-1 bg-navy-1 text-white text-sm rounded-full">Giới tính: {filters.gender}</span>
            )}
            {filters.birthYear && (
              <span className="px-3 py-1 bg-navy-1 text-white text-sm rounded-full">Năm sinh: {filters.birthYear}</span>
            )}
            {(filters.minAge || filters.maxAge) && (
              <span className="px-3 py-1 bg-navy-1 text-white text-sm rounded-full">
                Tuổi: {filters.minAge || '0'} - {filters.maxAge || '∞'}
              </span>
            )}
            {filters.districtId && (
              <span className="px-3 py-1 bg-navy-1 text-white text-sm rounded-full">
                Khu phố: {filterOptions.districts.find(d => d.id === filters.districtId)?.name}
              </span>
            )}
            {filters.ward && (
              <span className="px-3 py-1 bg-navy-1 text-white text-sm rounded-full">Phường: {filters.ward}</span>
            )}
            {filters.ethnicity && (
              <span className="px-3 py-1 bg-navy-1 text-white text-sm rounded-full">Dân tộc: {filters.ethnicity}</span>
            )}
            {filters.religion && (
              <span className="px-3 py-1 bg-navy-1 text-white text-sm rounded-full">Tôn giáo: {filters.religion}</span>
            )}
            {filters.education && (
              <span className="px-3 py-1 bg-navy-1 text-white text-sm rounded-full">Học vấn: {filters.education}</span>
            )}
            {filters.occupation && (
              <span className="px-3 py-1 bg-navy-1 text-white text-sm rounded-full">Nghề nghiệp: {filters.occupation}</span>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

