'use client'

import { useState, useEffect, useRef } from 'react'
import { Search, X, Plus, Sparkles, Calendar, Users, MapPin, GraduationCap, Briefcase, Filter, Zap } from 'lucide-react'

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

interface QueryBuilderProps {
  onFilterChange: (filters: any) => void
}

interface FilterChip {
  id: string
  type: string
  label: string
  value: string
  displayValue: string
  icon: React.ComponentType<{ className?: string }>
  color: string
}

const FILTER_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>, color: string, label: string }> = {
  gender: { icon: Users, color: 'from-pink-500 to-rose-500', label: 'Giới tính' },
  birthYear: { icon: Calendar, color: 'from-blue-500 to-cyan-500', label: 'Năm sinh' },
  minAge: { icon: Users, color: 'from-purple-500 to-indigo-500', label: 'Độ tuổi' },
  maxAge: { icon: Users, color: 'from-purple-500 to-indigo-500', label: 'Độ tuổi' },
  districtId: { icon: MapPin, color: 'from-green-500 to-emerald-500', label: 'Khu phố' },
  ward: { icon: MapPin, color: 'from-teal-500 to-cyan-500', label: 'Phường/Xã' },
  ethnicity: { icon: Users, color: 'from-orange-500 to-amber-500', label: 'Dân tộc' },
  religion: { icon: Users, color: 'from-violet-500 to-purple-500', label: 'Tôn giáo' },
  education: { icon: GraduationCap, color: 'from-indigo-500 to-blue-500', label: 'Học vấn' },
  occupation: { icon: Briefcase, color: 'from-red-500 to-pink-500', label: 'Nghề nghiệp' },
  status: { icon: Filter, color: 'from-gray-500 to-slate-500', label: 'Trạng thái' }
}

export default function QueryBuilder({ onFilterChange }: QueryBuilderProps) {
  const [filterOptions, setFilterOptions] = useState<FilterOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [showAddFilter, setShowAddFilter] = useState(false)
  const [activeFilterType, setActiveFilterType] = useState<string | null>(null)
  const [filterChips, setFilterChips] = useState<FilterChip[]>([])

  // Local state for input fields (for debouncing)
  const [inputValues, setInputValues] = useState({
    birthYear: '',
    minAge: '',
    maxAge: ''
  })

  // Actual filters that trigger search
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

  // Debounce timers
  const debounceTimers = useRef<Record<string, NodeJS.Timeout>>({})

  useEffect(() => {
    fetchFilterOptions()
  }, [])

  // Sync inputValues with filters when filters change externally (e.g., clear all)
  useEffect(() => {
    setInputValues({
      birthYear: filters.birthYear,
      minAge: filters.minAge,
      maxAge: filters.maxAge
    })
  }, [filters.birthYear, filters.minAge, filters.maxAge])

  // Debounce function for input fields
  const debounceUpdateFilter = (key: string, value: string, delay: number = 500) => {
    // Clear existing timer
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key])
    }

    // Set new timer
    debounceTimers.current[key] = setTimeout(() => {
      setFilters(prev => ({
        ...prev,
        [key]: value
      }))
    }, delay)
  }

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach(timer => clearTimeout(timer))
    }
  }, [])

  useEffect(() => {
    // Convert filters to chips
    const chips: FilterChip[] = []
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value && value !== '' && (key !== 'status' || value !== 'ACTIVE')) {
        const config = FILTER_CONFIG[key]
        if (config) {
          let displayValue = value
          
          if (key === 'gender') {
            displayValue = value
          } else if (key === 'birthYear') {
            displayValue = `Năm ${value}`
          } else if (key === 'minAge' || key === 'maxAge') {
            // Skip if we're processing maxAge and minAge exists (will be handled by minAge)
            if (key === 'maxAge' && filters.minAge) {
              return
            }
            // Only create chip for minAge if it exists, or maxAge if minAge doesn't exist
            if (key === 'minAge' && value) {
              const ageRange = filters.maxAge 
                ? `${filters.minAge} - ${filters.maxAge} tuổi`
                : `Từ ${filters.minAge} tuổi`
              chips.push({
                id: 'age-range',
                type: 'ageRange',
                label: 'Độ tuổi',
                value: `${filters.minAge}-${filters.maxAge || ''}`,
                displayValue: ageRange,
                icon: Users,
                color: 'from-purple-500 to-indigo-500'
              })
              return
            } else if (key === 'maxAge' && value && !filters.minAge) {
              chips.push({
                id: 'age-range',
                type: 'ageRange',
                label: 'Độ tuổi',
                value: `-${filters.maxAge}`,
                displayValue: `Đến ${filters.maxAge} tuổi`,
                icon: Users,
                color: 'from-purple-500 to-indigo-500'
              })
              return
            } else {
              return
            }
          } else if (key === 'districtId' && filterOptions) {
            const district = filterOptions.districts.find(d => d.id === value)
            displayValue = district?.name || value
          } else if (key === 'status') {
            displayValue = value === 'ACTIVE' ? 'Đang thường trú' : 
                          value === 'MOVED_OUT' ? 'Đã chuyển đi' : 
                          value === 'DECEASED' ? 'Đã qua đời' : value
          } else {
            displayValue = value
          }

          if (key !== 'maxAge') {
            chips.push({
              id: key,
              type: key,
              label: config.label,
              value: value,
              displayValue: displayValue,
              icon: config.icon,
              color: config.color
            })
          }
        }
      }
    })

    setFilterChips(chips)
    onFilterChange(filters)
  }, [filters, filterOptions, onFilterChange])

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

  const handleAddFilter = (type: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [type]: value
    }))
    setShowAddFilter(false)
    setActiveFilterType(null)
  }

  const handleRemoveFilter = (chipId: string) => {
    if (chipId === 'age-range') {
      // Clear debounce timers
      if (debounceTimers.current['minAge']) clearTimeout(debounceTimers.current['minAge'])
      if (debounceTimers.current['maxAge']) clearTimeout(debounceTimers.current['maxAge'])
      
      setInputValues(prev => ({ ...prev, minAge: '', maxAge: '' }))
      setFilters(prev => ({ ...prev, minAge: '', maxAge: '' }))
    } else if (chipId === 'birthYear') {
      if (debounceTimers.current['birthYear']) clearTimeout(debounceTimers.current['birthYear'])
      setInputValues(prev => ({ ...prev, birthYear: '' }))
      setFilters(prev => ({ ...prev, birthYear: '' }))
    } else {
      setFilters(prev => ({ ...prev, [chipId]: chipId === 'status' ? 'ACTIVE' : '' }))
    }
  }

  const clearAllFilters = () => {
    // Clear all debounce timers
    Object.keys(debounceTimers.current).forEach(key => {
      clearTimeout(debounceTimers.current[key])
    })
    
    setInputValues({
      birthYear: '',
      minAge: '',
      maxAge: ''
    })
    
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
    setFilterChips([])
  }

  if (loading || !filterOptions) {
    return (
      <div className="bg-gradient-to-br from-white via-yellow-50 to-white rounded-[24px] shadow-drop-lg p-8 border border-yellow-100">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
        </div>
      </div>
    )
  }

  // Generate natural language query
  const generateQueryText = () => {
    if (filterChips.length === 0) {
      return 'Hiển thị tất cả nhân khẩu đang thường trú'
    }

    const parts: string[] = []
    
    if (filters.gender) {
      parts.push(`nhân khẩu ${filters.gender.toLowerCase()}`)
    } else {
      parts.push('nhân khẩu')
    }

    if (filters.birthYear) {
      parts.push(`sinh năm ${filters.birthYear}`)
    }

    if (filters.minAge || filters.maxAge) {
      if (filters.minAge && filters.maxAge) {
        parts.push(`từ ${filters.minAge} đến ${filters.maxAge} tuổi`)
      } else if (filters.minAge) {
        parts.push(`từ ${filters.minAge} tuổi trở lên`)
      } else if (filters.maxAge) {
        parts.push(`dưới ${filters.maxAge} tuổi`)
      }
    }

    if (filters.districtId && filterOptions) {
      const district = filterOptions.districts.find(d => d.id === filters.districtId)
      if (district) {
        parts.push(`ở ${district.name}`)
      }
    }

    if (filters.ward) {
      parts.push(`phường ${filters.ward}`)
    }

    if (filters.ethnicity) {
      parts.push(`dân tộc ${filters.ethnicity}`)
    }

    if (filters.religion) {
      parts.push(`tôn giáo ${filters.religion}`)
    }

    if (filters.education) {
      parts.push(`trình độ ${filters.education}`)
    }

    if (filters.occupation) {
      parts.push(`nghề nghiệp ${filters.occupation}`)
    }

    return `Tìm kiếm ${parts.join(', ')}`
  }

  return (
    <div className="space-y-6">
      {/* Query Preview - Natural Language */}
      <div className="bg-gradient-to-br from-navy-1 via-navy-2 to-navy-3 rounded-[24px] shadow-drop-lg p-6 border border-navy-1/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-2 opacity-10 rounded-full -ml-24 -mb-24"></div>
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 bg-white/20 backdrop-blur-sm rounded-[12px]">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white">Truy vấn của bạn</h3>
          </div>
          
          <div className="bg-white/10 backdrop-blur-sm rounded-[16px] p-4 border border-white/20">
            <p className="text-white text-lg font-medium leading-relaxed">
              {generateQueryText()}
            </p>
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="bg-white rounded-[24px] shadow-drop-lg p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[12px]">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Bộ lọc</h3>
            {filterChips.length > 0 && (
              <span className="px-3 py-1 bg-navy-1 text-white text-sm font-semibold rounded-full">
                {filterChips.length}
              </span>
            )}
          </div>
          {filterChips.length > 0 && (
            <button
              onClick={clearAllFilters}
              className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-[10px] transition-all flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Xóa tất cả
            </button>
          )}
        </div>

        {/* Filter Chips Display */}
        <div className="flex flex-wrap gap-3 mb-4 min-h-[60px]">
          {filterChips.length === 0 ? (
            <div className="w-full py-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-yellow-2 to-yellow-1 rounded-full mb-3">
                <Search className="h-8 w-8 text-navy-1" />
              </div>
              <p className="text-gray-500 text-sm">Chưa có bộ lọc nào. Nhấn nút bên dưới để thêm bộ lọc</p>
            </div>
          ) : (
            filterChips.map((chip) => {
              const Icon = chip.icon
              return (
                <div
                  key={chip.id}
                  className="group relative animate-slideUp"
                  style={{ animationDelay: `${filterChips.indexOf(chip) * 50}ms` }}
                >
                  <div className={`bg-gradient-to-r ${chip.color} rounded-[16px] px-4 py-3 pr-10 shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-3 text-white`}>
                    <Icon className="h-4 w-4" />
                    <div>
                      <div className="text-xs opacity-90 font-medium">{chip.label}</div>
                      <div className="text-sm font-bold">{chip.displayValue}</div>
                    </div>
                    <button
                      onClick={() => handleRemoveFilter(chip.id)}
                      className="absolute top-2 right-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Add Filter Button */}
        <button
          onClick={() => setShowAddFilter(!showAddFilter)}
          className="w-full py-3 px-4 bg-gradient-to-r from-yellow-2 to-yellow-1 hover:from-yellow-1 hover:to-yellow-2 text-navy-1 rounded-[12px] font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
        >
          <Plus className="h-5 w-5" />
          {showAddFilter ? 'Đóng' : 'Thêm bộ lọc'}
        </button>

        {/* Filter Options Panel */}
        {showAddFilter && (
          <div className="mt-4 p-4 bg-gray-50 rounded-[16px] border border-gray-200 animate-fadeIn">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {/* Gender */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-navy-1" />
                  Giới tính
                </label>
                <select
                  value={filters.gender}
                  onChange={(e) => handleAddFilter('gender', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm"
                >
                  <option value="">Chọn giới tính</option>
                  {filterOptions.genders.map(gender => (
                    <option key={gender} value={gender}>{gender}</option>
                  ))}
                </select>
              </div>

              {/* Birth Year */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-navy-1" />
                  Năm sinh
                </label>
                <input
                  type="number"
                  value={inputValues.birthYear}
                  onChange={(e) => {
                    const value = e.target.value
                    setInputValues(prev => ({ ...prev, birthYear: value }))
                    debounceUpdateFilter('birthYear', value)
                  }}
                  onBlur={(e) => {
                    // Update immediately on blur
                    const value = e.target.value
                    if (debounceTimers.current['birthYear']) {
                      clearTimeout(debounceTimers.current['birthYear'])
                    }
                    setFilters(prev => ({ ...prev, birthYear: value }))
                  }}
                  placeholder="VD: 1982, 2005"
                  min={filterOptions.birthYearRange.min}
                  max={filterOptions.birthYearRange.max}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm"
                />
              </div>

              {/* Age Range */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-navy-1" />
                  Độ tuổi
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={inputValues.minAge}
                    onChange={(e) => {
                      const value = e.target.value
                      setInputValues(prev => ({ ...prev, minAge: value }))
                      debounceUpdateFilter('minAge', value)
                    }}
                    onBlur={(e) => {
                      const value = e.target.value
                      if (debounceTimers.current['minAge']) {
                        clearTimeout(debounceTimers.current['minAge'])
                      }
                      setFilters(prev => ({ ...prev, minAge: value }))
                    }}
                    placeholder="Từ"
                    min="0"
                    max="120"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm"
                  />
                  <span className="text-gray-500">-</span>
                  <input
                    type="number"
                    value={inputValues.maxAge}
                    onChange={(e) => {
                      const value = e.target.value
                      setInputValues(prev => ({ ...prev, maxAge: value }))
                      debounceUpdateFilter('maxAge', value)
                    }}
                    onBlur={(e) => {
                      const value = e.target.value
                      if (debounceTimers.current['maxAge']) {
                        clearTimeout(debounceTimers.current['maxAge'])
                      }
                      setFilters(prev => ({ ...prev, maxAge: value }))
                    }}
                    placeholder="Đến"
                    min="0"
                    max="120"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm"
                  />
                </div>
              </div>

              {/* District */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-navy-1" />
                  Khu phố
                </label>
                <select
                  value={filters.districtId}
                  onChange={(e) => {
                    handleAddFilter('districtId', e.target.value)
                    setFilters(prev => ({ ...prev, ward: '' }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm"
                >
                  <option value="">Chọn khu phố</option>
                  {filterOptions.districts.map(district => (
                    <option key={district.id} value={district.id}>{district.name}</option>
                  ))}
                </select>
              </div>

              {/* Ward */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-navy-1" />
                  Phường/Xã
                </label>
                <select
                  value={filters.ward}
                  onChange={(e) => handleAddFilter('ward', e.target.value)}
                  disabled={!filters.districtId}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">Chọn phường/xã</option>
                  {filterOptions.wards.map(ward => (
                    <option key={ward} value={ward}>{ward}</option>
                  ))}
                </select>
              </div>

              {/* Status */}
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Filter className="h-4 w-4 text-navy-1" />
                  Trạng thái
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleAddFilter('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm"
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

              {/* Ethnicity */}
              {filterOptions.ethnicities.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users className="h-4 w-4 text-navy-1" />
                    Dân tộc
                  </label>
                  <select
                    value={filters.ethnicity}
                    onChange={(e) => handleAddFilter('ethnicity', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm"
                  >
                    <option value="">Chọn dân tộc</option>
                    {filterOptions.ethnicities.map(ethnicity => (
                      <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Religion */}
              {filterOptions.religions.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Users className="h-4 w-4 text-navy-1" />
                    Tôn giáo
                  </label>
                  <select
                    value={filters.religion}
                    onChange={(e) => handleAddFilter('religion', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm"
                  >
                    <option value="">Chọn tôn giáo</option>
                    {filterOptions.religions.map(religion => (
                      <option key={religion} value={religion}>{religion}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Education */}
              {filterOptions.educations.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4 text-navy-1" />
                    Trình độ học vấn
                  </label>
                  <select
                    value={filters.education}
                    onChange={(e) => handleAddFilter('education', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm"
                  >
                    <option value="">Chọn trình độ</option>
                    {filterOptions.educations.map(education => (
                      <option key={education} value={education}>{education}</option>
                    ))}
                  </select>
                </div>
              )}

              {/* Occupation */}
              {filterOptions.occupations.length > 0 && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                    <Briefcase className="h-4 w-4 text-navy-1" />
                    Nghề nghiệp
                  </label>
                  <select
                    value={filters.occupation}
                    onChange={(e) => handleAddFilter('occupation', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-[10px] focus:ring-2 focus:ring-navy-1 focus:border-navy-1 transition-all text-sm"
                  >
                    <option value="">Chọn nghề nghiệp</option>
                    {filterOptions.occupations.map(occupation => (
                      <option key={occupation} value={occupation}>{occupation}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

