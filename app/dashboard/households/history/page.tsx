'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { History, Filter, Calendar } from 'lucide-react'
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
    const colors: Record<string, string> = {
      'CREATE': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'SPLIT': 'bg-purple-100 text-purple-800',
      'TRANSFER': 'bg-yellow-100 text-yellow-800',
      'MERGE': 'bg-indigo-100 text-indigo-800',
      'DELETE': 'bg-red-100 text-red-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  const clearFilters = () => {
    setFilters({
      householdId: '',
      changeType: '',
      startDate: '',
      endDate: ''
    })
  }

  return (
    <div>
      <div className="mb-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Lịch sử thay đổi hộ khẩu</h1>
            <p className="mt-2 text-sm text-gray-700">
              Xem lịch sử các thay đổi của hộ khẩu trong hệ thống
            </p>
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="btn btn-secondary"
          >
            <Filter className="h-4 w-4 mr-2" />
            {showFilters ? 'Ẩn bộ lọc' : 'Hiện bộ lọc'}
          </button>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Bộ lọc</h2>
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
              className="btn btn-secondary"
            >
              Xóa bộ lọc
            </button>
          </div>
        </div>
      )}

      {/* History List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">Đang tải...</p>
          </div>
        ) : history.length === 0 ? (
          <div className="p-8 text-center">
            <History className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Không có lịch sử thay đổi nào</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày thay đổi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Hộ khẩu</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Loại thay đổi</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mô tả</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                        {new Date(item.changeDate).toLocaleString('vi-VN')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.household ? (
                        <div>
                          <p className="font-medium">{item.household.householdId}</p>
                          <p className="text-gray-500 text-xs">{item.household.ownerName}</p>
                        </div>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getChangeTypeColor(item.changeType)}`}>
                        {getChangeTypeLabel(item.changeType)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {item.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {history.length > 0 && (
        <div className="mt-4 text-sm text-gray-500 text-center">
          Hiển thị {history.length} bản ghi
        </div>
      )}
    </div>
  )
}
