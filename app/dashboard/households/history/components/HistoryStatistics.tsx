'use client'

import { FileText } from 'lucide-react'

interface ChangeHistory {
  id: string
  changeType: string
}

interface HistoryStatisticsProps {
  totalChanges: number
  changesByType: Record<string, number>
  getChangeTypeLabel: (type: string) => string
  getChangeTypeColor: (type: string) => { bg: string; text: string; icon: string }
}

export default function HistoryStatistics({
  totalChanges,
  changesByType,
  getChangeTypeLabel,
  getChangeTypeColor
}: HistoryStatisticsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-white rounded-[15px] shadow-drop p-5 border border-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-gray-600 mb-1">Tổng thay đổi</p>
            <p className="text-2xl font-bold text-gray-900">{totalChanges}</p>
          </div>
          <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
            <FileText className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
      {Object.entries(changesByType).slice(0, 3).map(([type, count]) => {
        const color = getChangeTypeColor(type)
        return (
          <div key={type} className="bg-white rounded-[15px] shadow-drop p-5 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-gray-600 mb-1">{getChangeTypeLabel(type)}</p>
                <p className="text-2xl font-bold text-gray-900">{count}</p>
              </div>
              <div className={`p-3 ${color.bg} rounded-[10px]`}>
                <span className={`text-lg font-bold ${color.text}`}>{color.icon}</span>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

