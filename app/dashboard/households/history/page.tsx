'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { History, Filter } from 'lucide-react'
import toast from 'react-hot-toast'
import { Household } from '../shared/types'
import HistoryFilters from './components/HistoryFilters'
import HistoryStatistics from './components/HistoryStatistics'
import HistoryList from './components/HistoryList'

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
      <HistoryStatistics
        totalChanges={totalChanges}
        changesByType={changesByType}
        getChangeTypeLabel={getChangeTypeLabel}
        getChangeTypeColor={getChangeTypeColor}
      />

      {/* Filters */}
      <HistoryFilters
        showFilters={showFilters}
        onToggleFilters={() => setShowFilters(!showFilters)}
        filters={filters}
        onFiltersChange={setFilters}
        households={households}
        onClearFilters={clearFilters}
      />

      {/* History List */}
      <HistoryList
        history={history}
        loading={loading}
        getChangeTypeLabel={getChangeTypeLabel}
        getChangeTypeColor={getChangeTypeColor}
      />
    </div>
  )
}

