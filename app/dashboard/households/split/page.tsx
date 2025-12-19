'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Search } from 'lucide-react'
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
}

export default function SplitHouseholdPage() {
  const router = useRouter()
  const [households, setHouseholds] = useState<Household[]>([])
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('')
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  const [selectedPersons, setSelectedPersons] = useState<Set<string>>(new Set())
  const [personRelationships, setPersonRelationships] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    newHouseholdId: '',
    ownerName: '',
    address: '',
    street: '',
    ward: '',
    district: '',
    splitReason: '',
    splitDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchHouseholds()
  }, [])

  useEffect(() => {
    if (selectedHouseholdId) {
      const household = households.find(h => h.id === selectedHouseholdId)
      setSelectedHousehold(household || null)
      setSelectedPersons(new Set())
      setPersonRelationships({})
      if (household) {
        setFormData(prev => ({
          ...prev,
          ward: household.ward,
          district: household.district,
          ownerName: '' // Reset owner name when changing household
        }))
      }
    } else {
      setSelectedHousehold(null)
    }
  }, [selectedHouseholdId, households])

  // Auto-fill owner name when someone is set as "Chủ hộ"
  useEffect(() => {
    if (!selectedHousehold) return

    // Find the person who is set as "Chủ hộ"
    const householdHeadPersonId = Object.keys(personRelationships).find(
      personId => personRelationships[personId] === 'Chủ hộ'
    )

    if (householdHeadPersonId) {
      const person = selectedHousehold.persons.find(p => p.id === householdHeadPersonId)
      if (person) {
        setFormData(prev => ({
          ...prev,
          ownerName: person.fullName
        }))
      }
    }
  }, [personRelationships, selectedHousehold])

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

  const togglePersonSelection = (personId: string) => {
    const newSelected = new Set(selectedPersons)
    if (newSelected.has(personId)) {
      newSelected.delete(personId)
      const newRelationships = { ...personRelationships }
      delete newRelationships[personId]
      setPersonRelationships(newRelationships)
    } else {
      newSelected.add(personId)
    }
    setSelectedPersons(newSelected)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedHousehold) {
      toast.error('Vui lòng chọn hộ khẩu cần tách')
      return
    }

    if (selectedPersons.size === 0) {
      toast.error('Vui lòng chọn ít nhất một thành viên để tách')
      return
    }

    if (!formData.newHouseholdId || !formData.ownerName || !formData.address || 
        !formData.ward || !formData.district) {
      toast.error('Vui lòng điền đầy đủ thông tin hộ khẩu mới')
      return
    }

    setLoading(true)

    try {
      const personIds = Array.from(selectedPersons)
      
      const response = await fetch(`/api/households/${selectedHousehold.id}/split`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newHouseholdId: formData.newHouseholdId,
          ownerName: formData.ownerName,
          address: formData.address,
          street: formData.street,
          ward: formData.ward,
          district: formData.district,
          personIds: personIds,
          personRelationships: personRelationships,
          splitReason: formData.splitReason,
          splitDate: formData.splitDate
        })
      })

      if (response.ok) {
        toast.success('Tách hộ khẩu thành công!')
        router.push('/dashboard/households')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi tách hộ khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tách hộ khẩu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Tách hộ khẩu</h1>
        <p className="mt-2 text-sm text-gray-700">
          Chọn hộ khẩu và thành viên để tách thành hộ khẩu mới
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chọn hộ khẩu */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Chọn hộ khẩu cần tách</h2>
          
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
                            ? 'bg-primary-50 hover:bg-primary-100'
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

          {selectedHousehold && (
            <div className="mt-4 p-4 bg-primary-50 border border-primary-200 rounded-lg">
              <h3 className="font-medium mb-2 text-primary-900">Hộ khẩu đã chọn:</h3>
              <p><strong>Số hộ khẩu:</strong> {selectedHousehold.householdId}</p>
              <p><strong>Chủ hộ:</strong> {selectedHousehold.ownerName}</p>
              <p><strong>Địa chỉ:</strong> {selectedHousehold.address}, {selectedHousehold.street || ''}, {selectedHousehold.ward}, {selectedHousehold.district}</p>
            </div>
          )}
        </div>

        {/* Chọn thành viên */}
        {selectedHousehold && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Chọn thành viên để tách</h2>
            <div className="space-y-2">
              {selectedHousehold.persons.map((person) => (
                <div
                  key={person.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedPersons.has(person.id)
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => togglePersonSelection(person.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                        selectedPersons.has(person.id)
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedPersons.has(person.id) && (
                          <Check className="h-3 w-3 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{person.fullName}</p>
                        <p className="text-sm text-gray-500">
                          {person.gender} - {person.relationship || 'Chủ hộ'} - {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    {selectedPersons.has(person.id) && (
                      <div className="w-48">
                        <select
                          className="input text-sm"
                          value={personRelationships[person.id] || ''}
                          onChange={(e) => {
                            e.stopPropagation()
                            setPersonRelationships({
                              ...personRelationships,
                              [person.id]: e.target.value
                            })
                          }}
                          onClick={(e) => e.stopPropagation()}
                        >
                          <option value="">Quan hệ với chủ hộ mới</option>
                          <option value="Chủ hộ">Chủ hộ</option>
                          <option value="Vợ/Chồng">Vợ/Chồng</option>
                          <option value="Con">Con</option>
                          <option value="Cha/Mẹ">Cha/Mẹ</option>
                          <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {selectedPersons.size > 0 && (
              <p className="mt-4 text-sm text-gray-600">
                Đã chọn {selectedPersons.size} thành viên
              </p>
            )}
          </div>
        )}

        {/* Thông tin hộ khẩu mới */}
        {selectedHousehold && selectedPersons.size > 0 && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin hộ khẩu mới</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số hộ khẩu mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.newHouseholdId}
                  onChange={(e) => setFormData({ ...formData, newHouseholdId: e.target.value })}
                  placeholder="Nhập số hộ khẩu mới"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ tên chủ hộ mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.ownerName}
                  onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                  placeholder="Nhập họ tên chủ hộ mới"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số nhà <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Nhập số nhà"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đường phố (ấp)
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  placeholder="Nhập đường phố"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phường (xã, thị trấn) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.ward}
                  onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                  placeholder="Nhập phường"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quận (huyện) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.district}
                  onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                  placeholder="Nhập quận"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do tách hộ
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.splitReason}
                  onChange={(e) => setFormData({ ...formData, splitReason: e.target.value })}
                  placeholder="Nhập lý do tách hộ (nếu có)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày tách hộ
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.splitDate}
                  onChange={(e) => setFormData({ ...formData, splitDate: e.target.value })}
                />
              </div>
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
            disabled={loading || !selectedHousehold || selectedPersons.size === 0}
            className="btn btn-primary"
          >
            {loading ? 'Đang xử lý...' : 'Tách hộ khẩu'}
          </button>
        </div>
      </form>
    </div>
  )
}
