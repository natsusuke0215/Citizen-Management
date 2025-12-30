'use client'

import { Users, Edit, Trash2, Calendar, CreditCard, Home } from 'lucide-react'

interface Person {
  id: string
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string | null
  status: string
  household: {
    id: string
    householdId: string
    address: string
  }
}

interface PersonCardProps {
  person: Person
  index: number
  onEdit: (person: Person) => void
  onDelete: (id: string) => void
}

export default function PersonCard({
  person,
  index,
  onEdit,
  onDelete
}: PersonCardProps) {
  const getStatusInfo = () => {
    switch (person.status) {
      case 'ACTIVE':
        return { label: 'Đang thường trú', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✓' }
      case 'MOVED_OUT':
        return { label: 'Đã chuyển đi', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '→' }
      case 'DECEASED':
        return { label: 'Đã qua đời', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '✕' }
      default:
        return { label: person.status, color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '•' }
    }
  }
  const statusInfo = getStatusInfo()

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 dark:border-gray-700 overflow-hidden animate-slideUp"
      style={{ animationDelay: `${(index % 9) * 0.05}s` }}
    >
      {/* Card Header */}
      <div className="bg-gradient-to-r from-navy-1 to-navy-2 p-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <div className="font-bold text-lg">{person.fullName}</div>
              <div className="text-xs opacity-90">{person.gender}</div>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => onEdit(person)}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
              title="Thay đổi"
            >
              <Edit className="h-4 w-4" />
            </button>
            <button
              onClick={() => onDelete(person.id)}
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
        <div className="flex items-center gap-3 p-3 bg-yellow-2 dark:bg-navy-1/20 rounded-[8px]">
          <div className="p-2 bg-yellow-1 dark:bg-navy-2 rounded-[6px]">
            <Calendar className="h-4 w-4 text-navy-1 dark:text-navy-3" />
          </div>
          <div>
            <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">Ngày sinh</div>
            <div className="text-sm font-semibold text-navy-1 dark:text-navy-3">
              {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
            </div>
          </div>
        </div>

        {person.idNumber && (
          <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-[8px]">
            <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-[6px]">
              <CreditCard className="h-4 w-4 text-gray-600 dark:text-gray-300" />
            </div>
            <div>
              <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">CMND/CCCD</div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{person.idNumber}</div>
            </div>
          </div>
        )}

        <div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
            <Home className="h-3 w-3" />
            Hộ khẩu
          </div>
          <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{person.household.householdId}</div>
          <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{person.household.address}</div>
        </div>

        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusInfo.color}`}>
            <span>{statusInfo.icon}</span>
            <span>{statusInfo.label}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

