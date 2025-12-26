'use client'

import { Household } from '../types'

interface HouseholdTableProps {
  households: Household[]
  selectedHouseholdId: string
  onSelectHousehold: (id: string) => void
}

export default function HouseholdTable({
  households,
  selectedHouseholdId,
  onSelectHousehold
}: HouseholdTableProps) {
  return (
    <div className="border border-gray-200 rounded-lg overflow-hidden">
      <div className="max-h-96 overflow-y-auto">
        {households.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            Chưa có hộ khẩu nào
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
              {households.map((household) => (
                <tr
                  key={household.id}
                  onClick={() => onSelectHousehold(household.id)}
                  className={`cursor-pointer transition-colors ${
                    selectedHouseholdId === household.id
                      ? 'bg-primary-50 hover:bg-primary-100'
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
  )
}

