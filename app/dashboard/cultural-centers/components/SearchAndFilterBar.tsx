'use client'

import { memo } from 'react'
import { Search, Filter, Grid3x3, List } from 'lucide-react'

interface SearchAndFilterBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  sortBy: 'name' | 'capacity' | 'bookings'
  onSortChange: (sort: 'name' | 'capacity' | 'bookings') => void
  viewMode: 'grid' | 'list'
  onViewModeChange: (mode: 'grid' | 'list') => void
}

function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange
}: SearchAndFilterBarProps) {
  return (
    <div className="bg-white rounded-[15px] shadow-drop p-4">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
            placeholder="Tìm kiếm theo tên, mô tả, địa điểm hoặc tiện ích (máy chiếu, điều hòa...)"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={sortBy}
            onChange={(e) => {
              const newSort = e.target.value as 'name' | 'capacity' | 'bookings'
              onSortChange(newSort)
            }}
            className="px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200 cursor-pointer min-w-[180px]"
          >
            <option value="name">Sắp xếp theo tên</option>
            <option value="capacity">Sắp xếp theo sức chứa</option>
            <option value="bookings">Sắp xếp theo lượt đặt</option>
          </select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-[8px] p-1">
          <button
            onClick={() => onViewModeChange('grid')}
            className={`p-2 rounded-[6px] transition-all duration-200 ${
              viewMode === 'grid'
                ? 'bg-navy-1 text-white shadow-drop'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <Grid3x3 className="h-5 w-5" />
          </button>
          <button
            onClick={() => onViewModeChange('list')}
            className={`p-2 rounded-[6px] transition-all duration-200 ${
              viewMode === 'list'
                ? 'bg-navy-1 text-white shadow-drop'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default memo(SearchAndFilterBar)

