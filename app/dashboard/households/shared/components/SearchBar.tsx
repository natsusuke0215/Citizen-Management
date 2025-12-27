'use client'

import { Search } from 'lucide-react'

interface SearchBarProps {
  searchTerm: string
  onSearchChange: (value: string) => void
  placeholder?: string
}

export default function SearchBar({ 
  searchTerm, 
  onSearchChange,
  placeholder = "Tìm kiếm theo số hộ khẩu, chủ hộ, địa chỉ..."
}: SearchBarProps) {
  return (
    <div className="bg-white rounded-[15px] shadow-drop p-4">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  )
}

