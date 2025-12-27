'use client'

import { Users, UserMinus } from 'lucide-react'
import { Person } from '../types'

interface PersonCardProps {
  person: Person
  onRemove: (person: Person) => void
}

export default function PersonCard({ person, onRemove }: PersonCardProps) {
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-lg bg-blue-100">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="ml-4">
            <h4 className="text-lg font-medium text-gray-900">
              {person.fullName}
            </h4>
            <p className="text-sm text-gray-500">
              {person.relationship}
            </p>
          </div>
        </div>
        <button
          onClick={() => onRemove(person)}
          className="text-red-600 hover:text-red-900"
        >
          <UserMinus className="h-4 w-4" />
        </button>
      </div>
      
      <div className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Giới tính:</span>
          <span className="font-medium text-black">{person.gender}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Ngày sinh:</span>
          <span className="font-medium text-black">
            {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">CMND/CCCD:</span>
          <span className="font-medium text-black">{person.idNumber}</span>
        </div>
      </div>
    </div>
  )
}

