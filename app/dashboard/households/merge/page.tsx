'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Merge } from 'lucide-react'
import toast from 'react-hot-toast'

interface Person {
  id: string
  fullName: string
  dateOfBirth: string
  gender: string
  relationship?: string
}

interface Household {
  id: string
  householdId: string
  ownerName: string
  address: string
  street?: string
  ward: string
  district: string
  districtRelation: {
    id: string
    name: string
  }
  persons: Person[]
  members: Array<{
    id: string
    name: string
    email: string
  }>
}

export default function MergeHouseholdPage() {
  const router = useRouter()
  const [households, setHouseholds] = useState<Household[]>([])
  const [targetHouseholdId, setTargetHouseholdId] = useState<string>('')
  const [sourceHouseholdId, setSourceHouseholdId] = useState<string>('')
  const [targetHousehold, setTargetHousehold] = useState<Household | null>(null)
  const [sourceHousehold, setSourceHousehold] = useState<Household | null>(null)
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    mergeReason: '',
    mergeDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchHouseholds()
  }, [])

  useEffect(() => {
    if (targetHouseholdId) {
      const household = households.find(h => h.id === targetHouseholdId)
      setTargetHousehold(household || null)
    } else {
      setTargetHousehold(null)
    }
  }, [targetHouseholdId, households])

  useEffect(() => {
    if (sourceHouseholdId) {
      const household = households.find(h => h.id === sourceHouseholdId)
      setSourceHousehold(household || null)
    } else {
      setSourceHousehold(null)
    }
  }, [sourceHouseholdId, households])

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!targetHousehold) {
      toast.error('Vui lòng chọn hộ khẩu đích')
      return
    }

    if (!sourceHousehold) {
      toast.error('Vui lòng chọn hộ khẩu nguồn')
      return
    }

    if (targetHousehold.id === sourceHousehold.id) {
      toast.error('Không thể nhập hộ khẩu vào chính nó')
      return
    }

    if (sourceHousehold.members.length > 0) {
      toast.error('Không thể nhập hộ khẩu có người dùng liên kết. Vui lòng hủy liên kết trước.')
      return
    }

    if (!confirm(`Bạn có chắc chắn muốn nhập hộ khẩu ${sourceHousehold.householdId} vào hộ khẩu ${targetHousehold.householdId}? Hộ khẩu nguồn sẽ bị xóa sau khi nhập.`)) {
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/households/${targetHousehold.id}/merge`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sourceHouseholdId: sourceHousehold.id,
          mergeReason: formData.mergeReason,
          mergeDate: formData.mergeDate
        })
      })

      if (response.ok) {
        toast.success('Nhập hộ khẩu thành công!')
        router.push('/dashboard/households')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi nhập hộ khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi nhập hộ khẩu')
    } finally {
      setLoading(false)
    }
  }

  // Filter out target household from source options
  const availableSourceHouseholds = households.filter(h => h.id !== targetHouseholdId)
  // Filter out source household from target options
  const availableTargetHouseholds = households.filter(h => h.id !== sourceHouseholdId)

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Nhập hộ khẩu</h1>
        <p className="mt-2 text-sm text-gray-700">
          Gộp hộ khẩu nguồn vào hộ khẩu đích. Hộ khẩu nguồn sẽ bị xóa sau khi nhập.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chọn hộ khẩu đích */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Chọn hộ khẩu đích (hộ khẩu sẽ nhận thành viên)</h2>
          <select
            className="input"
            value={targetHouseholdId}
            onChange={(e) => setTargetHouseholdId(e.target.value)}
            required
          >
            <option value="">Chọn hộ khẩu đích</option>
            {availableTargetHouseholds.map((household) => (
              <option key={household.id} value={household.id}>
                {household.householdId} - {household.ownerName} ({household.persons.length} thành viên)
              </option>
            ))}
          </select>

          {targetHousehold && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg">
              <h3 className="font-medium mb-2">Thông tin hộ khẩu đích:</h3>
              <p><strong>Số hộ khẩu:</strong> {targetHousehold.householdId}</p>
              <p><strong>Chủ hộ:</strong> {targetHousehold.ownerName}</p>
              <p><strong>Địa chỉ:</strong> {targetHousehold.address}, {targetHousehold.street || ''}, {targetHousehold.ward}, {targetHousehold.district}</p>
              <p><strong>Số thành viên hiện tại:</strong> {targetHousehold.persons.length}</p>
            </div>
          )}
        </div>

        {/* Chọn hộ khẩu nguồn */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Chọn hộ khẩu nguồn (hộ khẩu sẽ bị xóa)</h2>
          <select
            className="input"
            value={sourceHouseholdId}
            onChange={(e) => setSourceHouseholdId(e.target.value)}
            required
          >
            <option value="">Chọn hộ khẩu nguồn</option>
            {availableSourceHouseholds.map((household) => (
              <option key={household.id} value={household.id}>
                {household.householdId} - {household.ownerName} ({household.persons.length} thành viên)
              </option>
            ))}
          </select>

          {sourceHousehold && (
            <>
              <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
                <h3 className="font-medium mb-2">Thông tin hộ khẩu nguồn:</h3>
                <p><strong>Số hộ khẩu:</strong> {sourceHousehold.householdId}</p>
                <p><strong>Chủ hộ:</strong> {sourceHousehold.ownerName}</p>
                <p><strong>Địa chỉ:</strong> {sourceHousehold.address}, {sourceHousehold.street || ''}, {sourceHousehold.ward}, {sourceHousehold.district}</p>
                <p><strong>Số thành viên:</strong> {sourceHousehold.persons.length}</p>
                {sourceHousehold.members.length > 0 && (
                  <p className="text-red-600 mt-2">
                    <strong>Cảnh báo:</strong> Hộ khẩu này có {sourceHousehold.members.length} người dùng liên kết. 
                    Vui lòng hủy liên kết trước khi nhập.
                  </p>
                )}
              </div>

              {sourceHousehold.persons.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Danh sách thành viên sẽ được chuyển:</h4>
                  <div className="space-y-2">
                    {sourceHousehold.persons.map((person) => (
                      <div key={person.id} className="p-2 bg-gray-50 rounded">
                        <p className="text-sm">
                          <strong>{person.fullName}</strong> - {person.gender} - {person.relationship || 'Chủ hộ'}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Thông tin nhập */}
        {targetHousehold && sourceHousehold && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin nhập hộ khẩu</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày nhập
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.mergeDate}
                  onChange={(e) => setFormData({ ...formData, mergeDate: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do nhập hộ khẩu
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.mergeReason}
                  onChange={(e) => setFormData({ ...formData, mergeReason: e.target.value })}
                  placeholder="Nhập lý do nhập hộ khẩu (nếu có)"
                />
              </div>
            </div>

            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-700">
                <strong>Lưu ý:</strong> Sau khi nhập, hộ khẩu nguồn ({sourceHousehold.householdId}) sẽ bị xóa và 
                tất cả {sourceHousehold.persons.length} thành viên sẽ được chuyển sang hộ khẩu đích ({targetHousehold.householdId}).
              </p>
            </div>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-secondary"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || !targetHousehold || !sourceHousehold || sourceHousehold.members.length > 0}
            className="btn btn-primary"
          >
            <Merge className="h-4 w-4 mr-2" />
            {loading ? 'Đang xử lý...' : 'Nhập hộ khẩu'}
          </button>
        </div>
      </form>
    </div>
  )
}
