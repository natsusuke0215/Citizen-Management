'use client'

import { Search, Home } from 'lucide-react'
import { Household } from '../../shared/types'

interface HouseholdSelectionProps {
  households: Household[]
  searchTerm: string
  onSearchChange: (value: string) => void
  selectedHouseholdId: string
  onHouseholdClick: (householdId: string) => void
}

export default function HouseholdSelection({
  households,
  searchTerm,
  onSearchChange,
  selectedHouseholdId,
  onHouseholdClick
}: HouseholdSelectionProps) {
  const filteredHouseholds = households.filter(household => {
    const searchLower = (searchTerm || '').toLowerCase()
    return (
      household.householdId.toLowerCase().includes(searchLower) ||
      household.ownerName.toLowerCase().includes(searchLower) ||
      household.address.toLowerCase().includes(searchLower) ||
      household.ward.toLowerCase().includes(searchLower) ||
      household.district.toLowerCase().includes(searchLower)
    )
  })

  return (
    <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-[10px]">
          <Home className="h-6 w-6 text-white" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Chọn hộ khẩu cần xóa</h2>
      </div>
      
      {/* Tìm kiếm */}
      <div className="mb-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo số hộ khẩu, chủ hộ, địa chỉ..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      {/* Danh sách hộ khẩu */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <div className="max-h-96 overflow-y-auto">
          {filteredHouseholds.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              {searchTerm ? 'Không tìm thấy hộ khẩu nào' : 'Chưa có hộ khẩu nào'}
            </div>
          ) : (
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số hộ khẩu</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ hộ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số thành viên</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHouseholds.map((household) => (
                  <tr
                    key={household.id}
                    onClick={() => onHouseholdClick(household.id)}
                    className={`cursor-pointer transition-colors ${
                      selectedHouseholdId === household.id
                        ? 'bg-red-50 hover:bg-red-100'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {household.householdId}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {household.ownerName}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {household.address}{household.street ? `, ${household.street}` : ''}, {household.ward}, {household.district}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {household.persons.length} thành viên
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  )
}

