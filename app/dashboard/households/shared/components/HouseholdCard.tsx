'use client'

import { Home, Users, MapPin, Eye, Edit, Trash2 } from 'lucide-react'
import { Household, Person } from '../types'

interface HouseholdCardProps {
  household: Household
  index: number
  onView: (household: Household) => void
  onEdit: (household: Household) => void
  onDelete: (id: string) => void
  getOwner: (household: Household) => Person | null
}

export default function HouseholdCard({
  household,
  index,
  onView,
  onEdit,
  onDelete,
  getOwner
}: HouseholdCardProps) {
  const owner = getOwner(household)
  const fullAddress = [
    household.address,
    household.street,
    household.ward,
    household.district,
    household.districtRelation.name
  ].filter(Boolean).join(', ')

  return (
    <div
      className="group bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden animate-slideUp"
      style={{ animationDelay: `${(index % 9) * 0.05}s` }}
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-navy-1 to-navy-2 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <Home className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-lg">{household.householdId}</div>
              <div className="text-xs opacity-90">Số hộ khẩu</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onView(household)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
              title="Xem chi tiết"
            >
              <Eye className="h-4 w-4" />
            </button>
            <button
              onClick={() => onEdit(household)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
              title="Chỉnh sửa"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(household.id)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
              title="Xóa"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">
            Chủ hộ
          </div>
          <div className="text-base font-semibold text-gray-900">
            {owner ? owner.fullName : household.ownerName}
          </div>
        </div>

        <div className="flex items-center gap-3 p-3 bg-yellow-2 rounded-[8px]">
          <div className="p-2 bg-yellow-1 rounded-[6px]">
            <Users className="h-4 w-4 text-navy-1" />
          </div>
          <div>
            <div className="text-sm font-semibold text-navy-1">
              {household.persons.length} thành viên
            </div>
            <div className="text-xs text-gray-600">Trong hộ khẩu</div>
          </div>
        </div>

        <div>
          <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
            <MapPin className="h-3 w-3" />
            Địa chỉ
          </div>
          <div className="text-sm text-gray-700 line-clamp-2">
            {fullAddress}
          </div>
        </div>
      </div>
    </div>
  )
}

