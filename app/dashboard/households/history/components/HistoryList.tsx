'use client'

import { History, Clock, FileText } from 'lucide-react'

interface Household {
  id: string
  householdId: string
  ownerName: string
}

interface ChangeHistory {
  id: string
  householdId: string
  changeType: string
  changeDate: string
  description: string
  oldData?: string
  newData?: string
  changedBy?: string
  household?: Household
}

interface HistoryListProps {
  history: ChangeHistory[]
  loading: boolean
  getChangeTypeLabel: (type: string) => string
  getChangeTypeColor: (type: string) => { bg: string; text: string; icon: string }
}

export default function HistoryList({
  history,
  loading,
  getChangeTypeLabel,
  getChangeTypeColor
}: HistoryListProps) {
  if (loading) {
    return (
      <div className="bg-white rounded-[15px] shadow-drop border border-gray-100 overflow-hidden">
        <div className="p-16 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-1 mx-auto mb-4"></div>
          <p className="text-gray-500">Đang tải...</p>
        </div>
      </div>
    )
  }

  if (history.length === 0) {
    return (
      <div className="bg-white rounded-[15px] shadow-drop border border-gray-100 overflow-hidden">
        <div className="p-16 text-center">
          <div className="relative inline-block mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-navy-1 to-navy-2 opacity-10 rounded-full blur-2xl"></div>
            <History className="h-16 w-16 text-gray-400 mx-auto relative" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có lịch sử thay đổi nào</h3>
          <p className="text-sm text-gray-500">Chưa có thay đổi nào được ghi lại trong hệ thống</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <div className="bg-white rounded-[15px] shadow-drop border border-gray-100 overflow-hidden">
        <div className="divide-y divide-gray-200">
          {history.map((item, index) => {
            const color = getChangeTypeColor(item.changeType)
            return (
              <div
                key={item.id}
                className="p-6 hover:bg-gray-50 transition-colors duration-200 group"
              >
                <div className="flex items-start gap-4">
                  {/* Timeline indicator */}
                  <div className="flex flex-col items-center">
                    <div className={`p-3 ${color.bg} rounded-[10px] border-2 border-white shadow-drop`}>
                      <span className={`text-lg font-bold ${color.text}`}>{color.icon}</span>
                    </div>
                    {index < history.length - 1 && (
                      <div className="w-0.5 h-full bg-gray-200 mt-2"></div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className={`inline-flex items-center px-3 py-1 text-xs font-bold rounded-full ${color.bg} ${color.text}`}>
                            {getChangeTypeLabel(item.changeType)}
                          </span>
                          {item.household && (
                            <div>
                              <span className="font-semibold text-gray-900">{item.household.householdId}</span>
                              <span className="text-gray-500 text-sm ml-2">{item.household.ownerName}</span>
                            </div>
                          )}
                        </div>
                        <p className="text-base text-gray-900 font-medium">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 flex-shrink-0">
                        <Clock className="h-4 w-4" />
                        <span>{new Date(item.changeDate).toLocaleString('vi-VN')}</span>
                      </div>
                    </div>
                    
                    {item.changedBy && (
                      <p className="text-xs text-gray-500 mt-2">
                        Thay đổi bởi: {item.changedBy}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-center py-4">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-drop">
          <FileText className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">
            Hiển thị {history.length} bản ghi
          </span>
        </div>
      </div>
    </>
  )
}

