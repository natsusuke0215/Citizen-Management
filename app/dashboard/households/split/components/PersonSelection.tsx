'use client'

import { Check } from 'lucide-react'
import { Household } from '../../shared/types'

interface PersonSelectionProps {
  household: Household
  selectedPersons: Set<string>
  personRelationships: Record<string, string>
  onTogglePerson: (personId: string) => void
  onUpdateRelationship: (personId: string, relationship: string) => void
}

export default function PersonSelection({
  household,
  selectedPersons,
  personRelationships,
  onTogglePerson,
  onUpdateRelationship
}: PersonSelectionProps) {
  return (
    <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[10px]">
          <Check className="h-6 w-6 text-navy-1" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Chọn thành viên để tách</h2>
      </div>
      <div className="space-y-3">
        {household.persons.map((person) => (
          <div
            key={person.id}
            className={`p-4 border-2 rounded-[10px] cursor-pointer transition-all duration-200 ${
              selectedPersons.has(person.id)
                ? 'border-navy-1 bg-gradient-to-r from-navy-1 to-navy-2 text-white shadow-drop'
                : 'border-gray-200 hover:border-navy-1 hover:shadow-drop bg-white'
            }`}
            onClick={() => onTogglePerson(person.id)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                  selectedPersons.has(person.id)
                    ? 'border-white bg-white text-navy-1'
                    : 'border-gray-300 bg-gray-50'
                }`}>
                  {selectedPersons.has(person.id) && (
                    <Check className="h-4 w-4" />
                  )}
                </div>
                <div>
                  <p className={`font-semibold ${selectedPersons.has(person.id) ? 'text-white' : 'text-gray-900'}`}>
                    {person.fullName}
                  </p>
                  <p className={`text-sm ${selectedPersons.has(person.id) ? 'text-white opacity-90' : 'text-gray-500'}`}>
                    {person.gender} - {person.relationship || 'Chủ hộ'} - {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>
              {selectedPersons.has(person.id) && (
                <div className="w-48">
                  <select
                    className="w-full px-3 py-2 border border-white border-opacity-30 rounded-[6px] bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
                    value={personRelationships[person.id] || ''}
                    onChange={(e) => {
                      e.stopPropagation()
                      onUpdateRelationship(person.id, e.target.value)
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <option value="" className="text-gray-900">Quan hệ với chủ hộ mới</option>
                    <option value="Chủ hộ" className="text-gray-900">Chủ hộ</option>
                    <option value="Vợ/Chồng" className="text-gray-900">Vợ/Chồng</option>
                    <option value="Con" className="text-gray-900">Con</option>
                    <option value="Cha/Mẹ" className="text-gray-900">Cha/Mẹ</option>
                    <option value="Anh/Chị/Em" className="text-gray-900">Anh/Chị/Em</option>
                    <option value="Khác" className="text-gray-900">Khác</option>
                  </select>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {selectedPersons.size > 0 && (
        <div className="mt-4 p-3 bg-yellow-2 rounded-[8px] border border-yellow-1">
          <p className="text-sm font-semibold text-navy-1">
            ✓ Đã chọn {selectedPersons.size} thành viên
          </p>
        </div>
      )}
    </div>
  )
}

