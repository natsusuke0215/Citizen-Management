'use client'

import { Search, Users, Calendar, CreditCard, CheckCircle } from 'lucide-react'

interface Person {
  id: string
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string | null
  household: {
    id: string
    householdId: string
    address: string
    street?: string | null
    ward?: string | null
    district?: string | null
    districtRelation?: {
      id: string
      name: string
    } | null
  }
}

interface PersonSelectionProps {
  persons: Person[]
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedPerson: Person | null
  onPersonSelect: (person: Person) => void
}

export default function PersonSelection({
  persons,
  searchTerm,
  onSearchChange,
  selectedPerson,
  onPersonSelect
}: PersonSelectionProps) {
  const filteredPersons = persons.filter((person) => {
    const searchLower = (searchTerm || '').toLowerCase()
    return [person.fullName, person.idNumber, person.household?.householdId].some((v) =>
      (v || '').toLowerCase().includes(searchLower),
    )
  })

  return (
    <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
          <Users className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Chọn nhân khẩu</h2>
      </div>
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm theo tên, số CMND/CCCD, số hộ khẩu..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="max-h-80 overflow-y-auto divide-y divide-gray-200 rounded-[8px] border border-gray-200">
        {filteredPersons.map((person) => (
          <button
            key={person.id}
            type="button"
            onClick={() => onPersonSelect(person)}
            className={`w-full text-left px-4 py-3 flex items-center justify-between transition-all duration-200 ${
              selectedPerson?.id === person.id 
                ? 'bg-gradient-to-r from-navy-1 to-navy-2 text-white shadow-drop' 
                : 'hover:bg-gray-50'
            }`}
          >
            <div className="flex-1">
              <div className={`font-semibold ${selectedPerson?.id === person.id ? 'text-white' : 'text-gray-900'}`}>
                {person.fullName}
              </div>
              <div className={`text-xs flex items-center gap-3 mt-1 ${selectedPerson?.id === person.id ? 'text-white opacity-90' : 'text-gray-500'}`}>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
                </span>
                {person.idNumber && (
                  <span className="flex items-center gap-1">
                    <CreditCard className="h-3 w-3" />
                    {person.idNumber}
                  </span>
                )}
              </div>
              <div className={`text-xs mt-1 ${selectedPerson?.id === person.id ? 'text-white opacity-80' : 'text-gray-400'}`}>
                Hộ khẩu: {person.household.householdId} - {person.household.address}
              </div>
            </div>
            {selectedPerson?.id === person.id && (
              <CheckCircle className="h-5 w-5 flex-shrink-0" />
            )}
          </button>
        ))}
        {filteredPersons.length === 0 && (
          <div className="py-8 text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <p className="text-sm text-gray-500">Không tìm thấy nhân khẩu phù hợp với từ khóa tìm kiếm.</p>
          </div>
        )}
      </div>
    </div>
  )
}

