'use client'

import { Search, Filter } from 'lucide-react'
import { BookingStatus } from '../types'

interface SearchAndFilterBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  statusFilter: BookingStatus
  onStatusFilterChange: (value: BookingStatus) => void
}

export default function SearchAndFilterBar({
  searchTerm,
  onSearchChange,
  statusFilter,
  onStatusFilterChange
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
            placeholder="Tìm kiếm theo tên, mô tả, địa điểm, người đặt, ngày tháng, giờ hoặc thứ..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value as BookingStatus)}
            className="px-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200 cursor-pointer min-w-[160px]"
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="PENDING">Chờ duyệt</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECTED">Đã từ chối</option>
          </select>
        </div>
      </div>
    </div>
  )
}

