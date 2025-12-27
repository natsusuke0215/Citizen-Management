'use client'

import { Search } from 'lucide-react'
import { REQUEST_TYPES } from '../types'

interface RequestFiltersProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedStatus: string
  onStatusChange: (value: string) => void
  selectedType: string
  onTypeChange: (value: string) => void
}

export default function RequestFilters({
  searchTerm,
  onSearchChange,
  selectedStatus,
  onStatusChange,
  selectedType,
  onTypeChange
}: RequestFiltersProps) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-transparent rounded-md leading-5 bg-gray-700 text-gray-300 placeholder-gray-400 focus:outline-none focus:bg-white focus:text-gray-900 sm:text-sm transition duration-150 ease-in-out"
            placeholder="Tìm kiếm theo tên, mô tả hoặc địa điểm..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>
      <div className="sm:w-48">
        <select
          className="input"
          value={selectedStatus}
          onChange={(e) => onStatusChange(e.target.value)}
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="PENDING">Chờ duyệt</option>
          <option value="APPROVED">Đã duyệt</option>
          <option value="REJECTED">Từ chối</option>
        </select>
      </div>
      <div className="sm:w-48">
        <select
          className="input"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
        >
          <option value="all">Tất cả loại</option>
          {Object.entries(REQUEST_TYPES).map(([key, value]) => (
            <option key={key} value={key}>
              {value}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

