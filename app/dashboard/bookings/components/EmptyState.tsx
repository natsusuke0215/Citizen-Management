'use client'

import { Calendar } from 'lucide-react'

interface EmptyStateProps {
  searchTerm: string
  onClearFilters: () => void
}

export default function EmptyState({ searchTerm, onClearFilters }: EmptyStateProps) {
  const hasFilters = !!searchTerm

  return (
    <div className="text-center py-16 bg-white rounded-[15px] shadow-drop border border-gray-100">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-1/20 to-navy-3/20 rounded-full blur-2xl"></div>
        <Calendar className="relative h-20 w-20 text-gray-300 mx-auto" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {hasFilters ? 'Không tìm thấy kết quả' : 'Chưa có lịch đặt'}
      </h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto mb-6">
        {hasFilters
          ? `Không tìm thấy lịch đặt nào phù hợp với từ khóa tìm kiếm. Hãy thử điều chỉnh từ khóa tìm kiếm.`
          : 'Bắt đầu bằng cách đặt lịch đầu tiên cho nhà văn hóa.'}
      </p>
      {hasFilters && (
        <button
          onClick={onClearFilters}
          className="px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  )
}

