'use client'

import { Eye, EyeOff, Filter } from 'lucide-react'
import { Building } from '../types'

interface CalendarFiltersProps {
  selectedDate: string
  onDateChange: (date: string) => void
  selectedBuilding: string
  onBuildingChange: (building: string) => void
  showPrivate: boolean
  onShowPrivateChange: (show: boolean) => void
  buildings: Building[]
}

export default function CalendarFilters({
  selectedDate,
  onDateChange,
  selectedBuilding,
  onBuildingChange,
  showPrivate,
  onShowPrivateChange,
  buildings
}: CalendarFiltersProps) {
  return (
    <div className="mt-8 flex flex-col sm:flex-row gap-4">
      <div className="sm:w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Ngày
        </label>
        <input
          type="date"
          className="input"
          value={selectedDate}
          onChange={(e) => onDateChange(e.target.value)}
        />
      </div>
      <div className="sm:w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Tòa nhà
        </label>
        <select
          className="input"
          value={selectedBuilding}
          onChange={(e) => onBuildingChange(e.target.value)}
        >
          <option value="all">Tất cả tòa nhà</option>
          {buildings.map((building) => (
            <option key={building.id} value={building.id}>
              {building.name}
            </option>
          ))}
        </select>
      </div>
      <div className="sm:w-48">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Hiển thị
        </label>
        <div className="flex items-center space-x-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showPrivate}
              onChange={(e) => onShowPrivateChange(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-gray-700">Lịch riêng tư</span>
          </label>
        </div>
      </div>
    </div>
  )
}

