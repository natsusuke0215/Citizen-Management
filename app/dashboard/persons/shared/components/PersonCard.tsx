'use client'

import { Users, Edit, Trash2, Calendar, CreditCard, Home, MapPin } from 'lucide-react'

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
  temporaryResidences?: Array<{
    id: string
    status: string
    startDate: string
    endDate: string | null
    originalAddress: string | null
    householdId: string | null
  }>
  temporaryAbsences?: Array<{
    id: string
    status: string
    startDate: string
    endDate: string | null
    reason: string | null
    destination: string | null
  }>
}

interface PersonCardProps {
  person: Person
  index: number
  onEdit: (person: Person) => void
  onDelete: (person: Person) => void
}

export default function PersonCard({
  person,
  index,
  onEdit,
  onDelete
}: PersonCardProps) {
  const getStatusInfo = () => {
    // Kiểm tra nếu có tạm trú hoặc tạm vắng active
    const hasActiveTemporaryResidence = person.temporaryResidences && person.temporaryResidences.length > 0
    const hasActiveTemporaryAbsence = person.temporaryAbsences && person.temporaryAbsences.length > 0
    
    switch (person.status) {
      case 'ACTIVE':
        if (hasActiveTemporaryResidence) {
          return { label: 'Đang tạm trú', color: 'bg-green-50 text-green-700 border-green-200', icon: '📍' }
        }
        if (hasActiveTemporaryAbsence) {
          return { label: 'Đang tạm vắng', color: 'bg-orange-50 text-orange-700 border-orange-200', icon: '📅' }
        }
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
              onClick={() => onDelete(person)}
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
          {person.temporaryResidences && person.temporaryResidences.length > 0 ? (
            <>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Home className="h-3 w-3" />
                Địa chỉ tạm trú
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {person.temporaryResidences[0].originalAddress || 'Chưa có thông tin'}
              </div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <div>
                  <span className="font-medium">Ngày bắt đầu:</span>{' '}
                  {person.temporaryResidences[0].startDate 
                    ? new Date(person.temporaryResidences[0].startDate).toLocaleDateString('vi-VN')
                    : 'Chưa có'}
                </div>
                <div>
                  <span className="font-medium">Ngày kết thúc:</span>{' '}
                  {person.temporaryResidences[0].endDate 
                    ? new Date(person.temporaryResidences[0].endDate).toLocaleDateString('vi-VN')
                    : 'Chưa xác định'}
                </div>
              </div>
            </>
          ) : person.temporaryAbsences && person.temporaryAbsences.length > 0 ? (
            <>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                Lý do tạm vắng
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {person.temporaryAbsences[0].reason || person.temporaryAbsences[0].destination || 'Chưa có thông tin'}
              </div>
              {person.temporaryAbsences[0].destination && person.temporaryAbsences[0].reason && (
                <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Nơi đến: {person.temporaryAbsences[0].destination}
                </div>
              )}
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-2 space-y-1">
                <div>
                  <span className="font-medium">Ngày bắt đầu:</span>{' '}
                  {person.temporaryAbsences[0].startDate 
                    ? new Date(person.temporaryAbsences[0].startDate).toLocaleDateString('vi-VN')
                    : 'Chưa có'}
                </div>
                <div>
                  <span className="font-medium">Ngày kết thúc:</span>{' '}
                  {person.temporaryAbsences[0].endDate 
                    ? new Date(person.temporaryAbsences[0].endDate).toLocaleDateString('vi-VN')
                    : 'Chưa xác định'}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-1 flex items-center gap-1">
                <Home className="h-3 w-3" />
                Hộ khẩu
              </div>
              <div className="text-sm font-semibold text-gray-900 dark:text-gray-100">{person.household.householdId}</div>
              <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">{person.household.address}</div>
            </>
          )}
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

