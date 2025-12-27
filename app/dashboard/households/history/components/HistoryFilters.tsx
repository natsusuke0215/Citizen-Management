'use client'

import { Filter, X } from 'lucide-react'
import { Household } from '../../shared/types'

interface HistoryFiltersProps {
  showFilters: boolean
  onToggleFilters: () => void
  filters: {
    householdId: string
    changeType: string
    startDate: string
    endDate: string
  }
  onFiltersChange: (filters: {
    householdId: string
    changeType: string
    startDate: string
    endDate: string
  }) => void
  households: Household[]
  onClearFilters: () => void
}

export default function HistoryFilters({
  showFilters,
  onToggleFilters,
  filters,
  onFiltersChange,
  households,
  onClearFilters
}: HistoryFiltersProps) {
  if (!showFilters) return null

  return (
    <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[8px]">
            <Filter className="h-5 w-5 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Bộ lọc</h2>
        </div>
        <button
          onClick={onToggleFilters}
          className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-[8px] transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hộ khẩu
          </label>
          <select
            className="input"
            value={filters.householdId}
            onChange={(e) => onFiltersChange({ ...filters, householdId: e.target.value })}
          >
            <option value="">Tất cả</option>
            {households.map((household) => (
              <option key={household.id} value={household.id}>
                {household.householdId} - {household.ownerName}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại thay đổi
          </label>
          <select
            className="input"
            value={filters.changeType}
            onChange={(e) => onFiltersChange({ ...filters, changeType: e.target.value })}
          >
            <option value="">Tất cả</option>
            <option value="CREATE">Tạo mới</option>
            <option value="UPDATE">Cập nhật</option>
            <option value="SPLIT">Tách hộ</option>
            <option value="TRANSFER">Chuyển hộ</option>
            <option value="MERGE">Nhập hộ</option>
            <option value="DELETE">Xóa</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Từ ngày
          </label>
          <input
            type="date"
            className="input"
            value={filters.startDate}
            onChange={(e) => onFiltersChange({ ...filters, startDate: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Đến ngày
          </label>
          <input
            type="date"
            className="input"
            value={filters.endDate}
            onChange={(e) => onFiltersChange({ ...filters, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <button
          onClick={onClearFilters}
          className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all duration-200"
        >
          Xóa bộ lọc
        </button>
      </div>
    </div>
  )
}

