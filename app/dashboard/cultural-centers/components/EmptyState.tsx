'use client'

import { memo } from 'react'
import { Building } from 'lucide-react'

interface EmptyStateProps {
  searchTerm: string
  onClearSearch: () => void
}

function EmptyState({ searchTerm, onClearSearch }: EmptyStateProps) {
  return (
    <div className="text-center py-16 bg-white rounded-[15px] shadow-drop border border-gray-100">
      <div className="relative inline-block mb-6">
        <div className="absolute inset-0 bg-gradient-to-br from-navy-1/20 to-navy-3/20 rounded-full blur-2xl"></div>
        <Building className="relative h-20 w-20 text-gray-300 mx-auto" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 mb-2">
        {searchTerm ? 'Không tìm thấy kết quả' : 'Chưa có nhà văn hóa'}
      </h3>
      <p className="text-sm text-gray-500 max-w-md mx-auto">
        {searchTerm 
          ? `Không tìm thấy nhà văn hóa nào phù hợp với "${searchTerm}". Hãy thử từ khóa khác.` 
          : 'Hiện tại chưa có thông tin nhà văn hóa trong hệ thống.'}
      </p>
      {searchTerm && (
        <button
          onClick={onClearSearch}
          className="mt-6 px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          Xóa bộ lọc
        </button>
      )}
    </div>
  )
}

export default memo(EmptyState)

