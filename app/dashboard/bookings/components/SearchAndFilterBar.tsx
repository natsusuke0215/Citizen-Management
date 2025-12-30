'use client'

import { Search } from 'lucide-react'

interface SearchAndFilterBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
}

export default function SearchAndFilterBar({
  searchTerm,
  onSearchChange
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
      </div>
    </div>
  )
}

