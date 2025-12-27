'use client'

import { Search } from 'lucide-react'

const REQUEST_TYPES = {
  HOUSEHOLD_UPDATE: 'Cập nhật hộ khẩu',
  ADD_PERSON: 'Thêm nhân khẩu',
  REMOVE_PERSON: 'Xóa nhân khẩu',
  CULTURAL_CENTER_BOOKING: 'Đặt lịch nhà văn hóa'
}

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
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo mô tả, người dùng hoặc số hộ khẩu..."
            className="input pl-10"
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

