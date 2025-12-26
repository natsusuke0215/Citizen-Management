'use client'

import { Plus, Home } from 'lucide-react'
import { Household, Person } from '../types'
import HouseholdCard from './HouseholdCard'

interface HouseholdGridProps {
  households: Household[]
  onView: (household: Household) => void
  onEdit: (household: Household) => void
  onDelete: (id: string) => void
  onAdd: () => void
  getOwner: (household: Household) => Person | null
  searchTerm: string
}

export default function HouseholdGrid({
  households,
  onView,
  onEdit,
  onDelete,
  onAdd,
  getOwner,
  searchTerm
}: HouseholdGridProps) {
  if (households.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-[15px] shadow-drop">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-1 to-navy-2 opacity-10 rounded-full blur-2xl"></div>
          <Home className="h-16 w-16 text-gray-400 mx-auto relative" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Không có hộ khẩu nào</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          {searchTerm ? 'Không tìm thấy hộ khẩu phù hợp với từ khóa tìm kiếm.' : 'Bắt đầu bằng cách thêm hộ khẩu đầu tiên.'}
        </p>
        {!searchTerm && (
          <button
            onClick={onAdd}
            className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm hộ khẩu đầu tiên
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {households.map((household, index) => (
        <HouseholdCard
          key={household.id}
          household={household}
          index={index}
          onView={onView}
          onEdit={onEdit}
          onDelete={onDelete}
          getOwner={getOwner}
        />
      ))}
    </div>
  )
}

