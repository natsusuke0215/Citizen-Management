'use client'

import { Building, Users } from 'lucide-react'
import { Household } from '../types'

interface HouseholdInfoProps {
  household: Household
}

export default function HouseholdInfo({ household }: HouseholdInfoProps) {
  const districtName = household.districtRelation?.name || (typeof household.district === 'string' ? household.district : '') || 'N/A'

  return (
    <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-lg bg-primary-100">
              <Building className="h-6 w-6 text-primary-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Thông tin hộ khẩu
            </h3>
            <div className="mt-2 space-y-1">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Số hộ khẩu:</span> {household.householdId}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Địa chỉ:</span> {household.address}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Khu phố:</span> {districtName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Thành viên:</span> {household.members.length} người
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="p-3 rounded-lg bg-green-100">
              <Users className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">
              Thành viên hộ khẩu
            </h3>
            <div className="mt-2 space-y-1">
              {household.members.map((member) => (
                <p key={member.id} className="text-sm text-gray-600">
                  <span className="font-medium">{member.name}</span>
                  <span className="ml-2 text-gray-500">({member.role})</span>
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

