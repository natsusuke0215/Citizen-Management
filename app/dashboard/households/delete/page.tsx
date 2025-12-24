'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, AlertTriangle, Search } from 'lucide-react'
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

  const filteredHouseholds = households.filter(household => {
    const searchLower = (searchTerm || '').toLowerCase()
    return (
      household.householdId.toLowerCase().includes(searchLower) ||
      household.ownerName.toLowerCase().includes(searchLower) ||
      household.address.toLowerCase().includes(searchLower) ||
      household.ward.toLowerCase().includes(searchLower) ||
      household.district.toLowerCase().includes(searchLower)
    )
  })

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

    if (selectedHousehold.members.length > 0) {
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

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Xóa hộ khẩu</h1>
        <p className="mt-2 text-sm text-gray-700">
          Chọn hộ khẩu cần xóa khỏi hệ thống
        </p>
      </div>

      <div className="space-y-6">
        {/* Chọn hộ khẩu */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Chọn hộ khẩu cần xóa</h2>
          
          {/* Tìm kiếm */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo số hộ khẩu, chủ hộ, địa chỉ..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Danh sách hộ khẩu */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="max-h-96 overflow-y-auto">
              {filteredHouseholds.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  {searchTerm ? 'Không tìm thấy hộ khẩu nào' : 'Chưa có hộ khẩu nào'}
                </div>
              ) : (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số hộ khẩu</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Chủ hộ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Địa chỉ</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số thành viên</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredHouseholds.map((household) => (
                      <tr
                        key={household.id}
                        onClick={() => handleHouseholdClick(household.id)}
                        className={`cursor-pointer transition-colors ${
                          selectedHouseholdId === household.id
                            ? 'bg-red-50 hover:bg-red-100'
                            : 'hover:bg-gray-50'
                        }`}
                      >
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">
                          {household.householdId}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-900">
                          {household.ownerName}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {household.address}{household.street ? `, ${household.street}` : ''}, {household.ward}, {household.district}
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500">
                          {household.persons.length} thành viên
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

        {/* Thông tin hộ khẩu */}
        {selectedHousehold && (
          <>
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold mb-4">Thông tin hộ khẩu</h2>
              <div className="space-y-2">
                <p><strong>Số hộ khẩu:</strong> {selectedHousehold.householdId}</p>
                <p><strong>Chủ hộ:</strong> {selectedHousehold.ownerName}</p>
                <p><strong>Địa chỉ:</strong> {selectedHousehold.address}, {selectedHousehold.street || ''}, {selectedHousehold.ward}, {selectedHousehold.district}</p>
                <p><strong>Khu phố:</strong> {selectedHousehold.districtRelation.name}</p>
                <p><strong>Số thành viên:</strong> {selectedHousehold.persons.length}</p>
                <p><strong>Số người dùng liên kết:</strong> {selectedHousehold.members.length}</p>
              </div>

              {selectedHousehold.persons.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Cảnh báo</p>
                      <p className="text-sm text-yellow-700">
                        Hộ khẩu này có {selectedHousehold.persons.length} thành viên. 
                        Bạn cần chuyển hoặc xóa các thành viên trước khi xóa hộ khẩu.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedHousehold.members.length > 0 && (
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-yellow-800">Cảnh báo</p>
                      <p className="text-sm text-yellow-700">
                        Hộ khẩu này có {selectedHousehold.members.length} người dùng liên kết. 
                        Bạn cần hủy liên kết trước khi xóa hộ khẩu.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {selectedHousehold.persons.length === 0 && selectedHousehold.members.length === 0 && (
                <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-red-800">Xác nhận xóa</p>
                      <p className="text-sm text-red-700 mb-3">
                        Hành động này không thể hoàn tác. Vui lòng nhập số hộ khẩu để xác nhận.
                      </p>
                      <input
                        type="text"
                        className="input"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder={`Nhập "${selectedHousehold.householdId}" để xác nhận`}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Danh sách thành viên */}
            {selectedHousehold.persons.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Danh sách thành viên</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quan hệ</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {selectedHousehold.persons.map((person) => (
                        <tr key={person.id}>
                          <td className="px-4 py-3 text-sm">{person.fullName}</td>
                          <td className="px-4 py-3 text-sm">{person.gender}</td>
                          <td className="px-4 py-3 text-sm">{person.relationship || 'Chủ hộ'}</td>
                          <td className="px-4 py-3 text-sm">{new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
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
            type="button"
            onClick={handleDelete}
            disabled={loading || !selectedHousehold || selectedHousehold.persons.length > 0 || selectedHousehold.members.length > 0 || confirmText !== selectedHousehold?.householdId}
            className="btn btn-danger"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {loading ? 'Đang xử lý...' : 'Xóa hộ khẩu'}
          </button>
        </div>
      </div>
    </div>
  )
}


