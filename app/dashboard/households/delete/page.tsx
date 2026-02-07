'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { Household } from '../shared/types'
import HouseholdSelection from './components/HouseholdSelection'
import DeleteConfirmation from './components/DeleteConfirmation'

export default function DeleteHouseholdPage() {
  const router = useRouter()
  const [households, setHouseholds] = useState<Household[]>([])
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('')
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  const [loading, setLoading] = useState(false)
  const [confirmText, setConfirmText] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchHouseholds()
  }, [])

  useEffect(() => {
    if (selectedHouseholdId) {
      const household = households.find(h => h.id === selectedHouseholdId)
      setSelectedHousehold(household || null)
      setConfirmText('')
    } else {
      setSelectedHousehold(null)
    }
  }, [selectedHouseholdId, households])

  const fetchHouseholds = async () => {
    try {
      const response = await fetch('/api/households')
      if (response.ok) {
        const data = await response.json()
        setHouseholds(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách hộ khẩu')
    }
  }

  const handleHouseholdClick = (householdId: string) => {
    setSelectedHouseholdId(householdId)
  }

  const handleDelete = async () => {
    if (!selectedHousehold) {
      toast.error('Vui lòng chọn hộ khẩu cần xóa')
      return
    }

    if (confirmText !== selectedHousehold.householdId) {
      toast.error('Vui lòng nhập đúng số hộ khẩu để xác nhận')
      return
    }

    // Note: We check persons and members on frontend for UX, but API will do full validation
    // Frontend check may not catch all cases (e.g., inactive persons) so API validation is the source of truth
    if (selectedHousehold.persons.length > 0) {
      toast.error('Không thể xóa hộ khẩu có thành viên. Vui lòng chuyển hoặc xóa thành viên trước.')
      return
    }

    if (selectedHousehold.members && selectedHousehold.members.length > 0) {
      toast.error('Không thể xóa hộ khẩu có người dùng liên kết. Vui lòng hủy liên kết trước.')
      return
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa hộ khẩu ${selectedHousehold.householdId}?`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/households/${selectedHousehold.id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Xóa hộ khẩu thành công!')
        router.push('/dashboard/households')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi xóa hộ khẩu')
      }
    } catch (error) {
      console.error('Error deleting household:', error)
      toast.error('Có lỗi xảy ra khi xóa hộ khẩu')
    } finally {
      setLoading(false)
    }
  }

  const canDelete = selectedHousehold && 
    selectedHousehold.persons.length === 0 && 
    (!selectedHousehold.members || selectedHousehold.members.length === 0) &&
    confirmText === selectedHousehold.householdId

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Trash2 className="h-8 w-8 text-rose-600" />
            Xóa hộ khẩu
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Chọn hộ khẩu cần xóa khỏi hệ thống
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Chọn hộ khẩu */}
        <HouseholdSelection
          households={households}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedHouseholdId={selectedHouseholdId}
          onHouseholdClick={handleHouseholdClick}
        />

        {/* Thông tin hộ khẩu và xác nhận */}
        {selectedHousehold && (
          <DeleteConfirmation
            household={selectedHousehold}
            confirmText={confirmText}
            onConfirmTextChange={setConfirmText}
          />
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all duration-200"
          >
            Hủy
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading || !canDelete}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-rose-500 to-rose-600 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {loading ? 'Đang xử lý...' : 'Xóa hộ khẩu'}
          </button>
        </div>
      </div>
    </div>
  )
}

