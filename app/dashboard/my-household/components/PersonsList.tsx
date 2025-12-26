'use client'

import { Users } from 'lucide-react'
import { Person } from '../types'
import PersonCard from './PersonCard'

interface PersonsListProps {
  persons: Person[]
  onRemove: (person: Person) => void
}

export default function PersonsList({ persons, onRemove }: PersonsListProps) {
  if (persons.length === 0) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có nhân khẩu</h3>
        <p className="mt-1 text-sm text-gray-500">
          Hộ khẩu này chưa có nhân khẩu nào. Hãy thêm nhân khẩu đầu tiên.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Danh sách nhân khẩu
      </h3>
      
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {persons.map((person) => (
          <PersonCard
            key={person.id}
            person={person}
            onRemove={onRemove}
          />
        ))}
      </div>
    </div>
  )
}

