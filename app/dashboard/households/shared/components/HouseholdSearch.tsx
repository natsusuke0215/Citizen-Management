'use client'

import { Search, CheckCircle } from 'lucide-react'
import { Household } from '../types'

interface HouseholdSearchProps {
  households: Household[]
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedHouseholdId: string
  onSelectHousehold: (id: string) => void
}

export default function HouseholdSearch({
  households,
  searchTerm,
  onSearchChange,
  selectedHouseholdId,
  onSelectHousehold
}: HouseholdSearchProps) {
  return (
    <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
          <Search className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Chọn hộ khẩu</h2>
      </div>
      
      {/* Search */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo số hộ khẩu, chủ hộ, địa chỉ..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Household list */}
      <div className="max-h-60 overflow-y-auto border border-gray-200 rounded-[8px]">
        {households.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            {searchTerm ? 'Không tìm thấy hộ khẩu nào' : 'Chưa có hộ khẩu nào'}
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {households.map((household) => (
              <div
                key={household.id}
                onClick={() => onSelectHousehold(household.id)}
                className={`p-4 cursor-pointer transition-all duration-200 ${
                  selectedHouseholdId === household.id 
                    ? 'bg-gradient-to-r from-navy-1 to-navy-2 text-white' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-medium text-gray-900">
                      Số hộ khẩu: {household.householdId}
                    </div>
                    <div className="text-sm text-gray-600 mt-1">
                      Chủ hộ: {household.ownerName}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      {household.address}
                      {household.street && `, ${household.street}`}
                      {`, ${household.ward}, ${household.district}`}
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Khu phố: {household.districtRelation.name} • 
                      Thành viên: {household.persons.length} người
                    </div>
                  </div>
                  {selectedHouseholdId === household.id && (
                    <div className="flex items-center gap-2">
                      <CheckCircle className="h-5 w-5" />
                      <span className="text-sm font-semibold">Đã chọn</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedHouseholdId && households.find(h => h.id === selectedHouseholdId) && (
        <div className="mt-4 p-4 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] shadow-drop">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            <div>
              <div className="text-sm font-semibold">Đã chọn hộ khẩu</div>
              <div className="text-sm opacity-90">
                {households.find(h => h.id === selectedHouseholdId)?.householdId} - {households.find(h => h.id === selectedHouseholdId)?.ownerName}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

