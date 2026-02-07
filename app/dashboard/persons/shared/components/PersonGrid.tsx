'use client'

import { Plus, Users } from 'lucide-react'
import PersonCard from './PersonCard'

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

interface PersonGridProps {
  persons: Person[]
  onEdit: (person: Person) => void
  onDelete: (person: Person) => void
  onAdd: () => void
  searchTerm: string
}

export default function PersonGrid({
  persons,
  onEdit,
  onDelete,
  onAdd,
  searchTerm
}: PersonGridProps) {
  if (persons.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-[15px] shadow-drop">
        <div className="relative inline-block">
          <div className="absolute inset-0 bg-gradient-to-br from-navy-1 to-navy-2 opacity-10 rounded-full blur-2xl"></div>
          <Users className="h-16 w-16 text-gray-400 mx-auto relative" />
        </div>
        <h3 className="mt-4 text-lg font-semibold text-gray-900">Không có nhân khẩu nào</h3>
        <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
          {searchTerm ? 'Không tìm thấy nhân khẩu phù hợp với từ khóa tìm kiếm.' : 'Bắt đầu bằng cách thêm nhân khẩu đầu tiên.'}
        </p>
        {!searchTerm && (
          <button
            onClick={onAdd}
            className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm nhân khẩu đầu tiên
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {persons.map((person, index) => (
        <PersonCard
          key={person.id}
          person={person}
          index={index}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  )
}

