'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { History, Filter, Calendar, Clock, FileText, Sparkles, TrendingUp, X } from 'lucide-react'
import toast from 'react-hot-toast'

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
  createdAt: string
  household?: Household
}

export default function HouseholdHistoryPage() {
  const router = useRouter()
  const [households, setHouseholds] = useState<Household[]>([])
  const [history, setHistory] = useState<ChangeHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)

  const [filters, setFilters] = useState({
    householdId: '',
    changeType: '',
    startDate: '',
    endDate: ''
  })

  const fetchHouseholds = async () => {
    try {
      const response = await fetch('/api/households')
      if (response.ok) {
        const data = await response.json()
        setHouseholds(data.map((h: any) => ({
          id: h.id,
          householdId: h.householdId,
          ownerName: h.ownerName
        })))
      }
    } catch (error) {
      console.error('Error fetching households:', error)
    }
  }

  const fetchHistory = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.householdId) params.append('householdId', filters.householdId)
      if (filters.changeType) params.append('changeType', filters.changeType)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)

      const response = await fetch(`/api/households/history?${params.toString()}`)
      if (response.ok) {
        const data = await response.json()
        setHistory(data)
      } else {
        const errorData = await response.json().catch(() => ({}))
        console.error('Error response:', errorData)
        toast.error('Có lỗi xảy ra khi tải lịch sử thay đổi')
      }
    } catch (error) {
      console.error('Error fetching history:', error)
      toast.error('Có lỗi xảy ra khi tải lịch sử thay đổi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHouseholds()
  }, [])

  useEffect(() => {
    fetchHistory()
  }, [filters])

  const getChangeTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'CREATE': 'Tạo mới',
      'UPDATE': 'Cập nhật',
      'SPLIT': 'Tách hộ',
      'TRANSFER': 'Chuyển hộ',
      'MERGE': 'Nhập hộ',
      'DELETE': 'Xóa'
    }
    return labels[type] || type
  }

  const getChangeTypeColor = (type: string) => {
    const colors: Record<string, { bg: string; text: string; icon: string }> = {
      'CREATE': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '✓' },
      'UPDATE': { bg: 'bg-blue-50', text: 'text-blue-700', icon: '✎' },
      'SPLIT': { bg: 'bg-purple-50', text: 'text-purple-700', icon: '⇄' },
      'TRANSFER': { bg: 'bg-amber-50', text: 'text-amber-700', icon: '→' },
      'MERGE': { bg: 'bg-indigo-50', text: 'text-indigo-700', icon: '⇄' },
      'DELETE': { bg: 'bg-rose-50', text: 'text-rose-700', icon: '✕' }
    }
    return colors[type] || { bg: 'bg-gray-50', text: 'text-gray-700', icon: '•' }
  }

  const clearFilters = () => {
    setFilters({
      householdId: '',
      changeType: '',
      startDate: '',
      endDate: ''
    })
  }

  // Calculate statistics
  const totalChanges = history.length
  const changesByType = history.reduce((acc, item) => {
    acc[item.changeType] = (acc[item.changeType] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <History className="h-8 w-8 text-navy-1" />
            Lịch sử thay đổi hộ khẩu
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Xem lịch sử các thay đổi của hộ khẩu trong hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="inline-flex items-center px-5 py-2.5 text-sm font-semibold text-navy-1 bg-white border-2 border-navy-1 rounded-[8px] hover:bg-navy-1 hover:text-white transition-all duration-200 shadow-drop hover:shadow-drop-lg"
        >
          <Filter className="h-4 w-4 mr-2" />
          {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
        </button>
      </div>

      {/* Statistics Cards */}
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

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[8px]">
                <Filter className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Bộ lọc</h2>
            </div>
            <button
              onClick={() => setShowFilters(false)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-[8px] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hộ khẩu
              </label>
              <select
                className="input"
                value={filters.householdId}
                onChange={(e) => setFilters({ ...filters, householdId: e.target.value })}
              >
                <option value="">Tất cả</option>
                {households.map((household) => (
                  <option key={household.id} value={household.id}>
                    {household.householdId} - {household.ownerName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại thay đổi
              </label>
              <select
                className="input"
                value={filters.changeType}
                onChange={(e) => setFilters({ ...filters, changeType: e.target.value })}
              >
                <option value="">Tất cả</option>
                <option value="CREATE">Tạo mới</option>
                <option value="UPDATE">Cập nhật</option>
                <option value="SPLIT">Tách hộ</option>
                <option value="TRANSFER">Chuyển hộ</option>
                <option value="MERGE">Nhập hộ</option>
                <option value="DELETE">Xóa</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Từ ngày
              </label>
              <input
                type="date"
                className="input"
                value={filters.startDate}
                onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Đến ngày
              </label>
              <input
                type="date"
                className="input"
                value={filters.endDate}
                onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="px-5 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all duration-200"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="bg-white rounded-[15px] shadow-drop border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-16 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-1 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-16 text-center">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-navy-1 to-navy-2 opacity-10 rounded-full blur-2xl"></div>
              <History className="h-16 w-16 text-gray-400 mx-auto relative" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Không có lịch sử thay đổi nào</h3>
            <p className="text-sm text-gray-500">Chưa có thay đổi nào được ghi lại trong hệ thống</p>
          </div>
        ) : (
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
                      {item.oldData && item.newData && (
                        <div className="mt-3 p-3 bg-gray-50 rounded-[8px] border border-gray-200 text-xs">
                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <span className="font-semibold text-gray-600">Trước:</span>
                              <p className="text-gray-700 mt-1">{item.oldData}</p>
                            </div>
                            <div>
                              <span className="font-semibold text-gray-600">Sau:</span>
                              <p className="text-gray-700 mt-1">{item.newData}</p>
                            </div>
                          </div>
                        </div>
                      )}
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
        )}
      </div>

      {history.length > 0 && (
        <div className="text-center py-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-200 shadow-drop">
            <FileText className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">
              Hiển thị {history.length} bản ghi
            </span>
          </div>
        </div>
      )}
    </div>
  )
}


