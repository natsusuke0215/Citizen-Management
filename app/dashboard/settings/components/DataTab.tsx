'use client'

import { Database, Download, FileText, AlertTriangle, Trash2 } from 'lucide-react'

interface DataTabProps {
  userId: string | undefined
  onExportData: (format: 'json' | 'csv') => void
  onDeleteClick: () => void
}

export default function DataTab({ userId, onExportData, onDeleteClick }: DataTabProps) {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-[15px] shadow-drop p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Database className="h-6 w-6 text-navy-1" />
            Quản lý dữ liệu
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Xuất, nhập và quản lý dữ liệu của bạn
          </p>
        </div>

        <div className="space-y-4">
          <div className="p-6 bg-gradient-to-br from-navy-1/10 to-navy-2/10 rounded-[12px] border border-navy-1/20">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-navy-1 rounded-[8px]">
                <Download className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Xuất dữ liệu</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Tải xuống tất cả dữ liệu của bạn dưới dạng file JSON hoặc CSV
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => onExportData('json')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-navy-1 text-white rounded-[8px] text-sm font-medium hover:bg-navy-2 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                    Xuất JSON
                  </button>
                  <button
                    onClick={() => onExportData('csv')}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-white border-2 border-gray-300 text-gray-700 rounded-[8px] text-sm font-medium hover:bg-gray-50 transition-colors"
                  >
                    <FileText className="h-4 w-4" />
                    Xuất CSV
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="p-6 bg-amber-50 rounded-[12px] border border-amber-200">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500 rounded-[8px]">
                <AlertTriangle className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Xóa tài khoản</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Xóa vĩnh viễn tài khoản và tất cả dữ liệu của bạn. Hành động này không thể hoàn tác.
                </p>
                <button
                  onClick={onDeleteClick}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-[8px] text-sm font-medium hover:bg-red-600 transition-colors"
                >
                  <Trash2 className="h-4 w-4" />
                  Xóa tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

