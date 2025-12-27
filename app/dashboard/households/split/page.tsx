'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Check, Search, Split, Home, Users, Building2, Sparkles, CheckCircle } from 'lucide-react'
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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Split className="h-8 w-8 text-navy-1" />
            Tách hộ khẩu
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Chọn hộ khẩu và thành viên để tách thành hộ khẩu mới
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chọn hộ khẩu */}
        <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
              <Home className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Chọn hộ khẩu cần tách</h2>
          </div>
          
          {/* Tìm kiếm */}
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm kiếm theo số hộ khẩu, chủ hộ, địa chỉ..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
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
            <div className="mt-4 p-4 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] shadow-drop">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5" />
                <h3 className="font-semibold">Hộ khẩu đã chọn</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p><strong>Số hộ khẩu:</strong> {selectedHousehold.householdId}</p>
                <p><strong>Chủ hộ:</strong> {selectedHousehold.ownerName}</p>
                <p><strong>Địa chỉ:</strong> {selectedHousehold.address}, {selectedHousehold.street || ''}, {selectedHousehold.ward}, {selectedHousehold.district}</p>
                <p><strong>Số thành viên:</strong> {selectedHousehold.persons.length} người</p>
              </div>
            </div>
          )}
        </div>

        {/* Chọn thành viên */}
        {selectedHousehold && (
          <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[10px]">
                <Users className="h-6 w-6 text-navy-1" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Chọn thành viên để tách</h2>
            </div>
            <div className="space-y-3">
              {selectedHousehold.persons.map((person) => (
                <div
                  key={person.id}
                  className={`p-4 border-2 rounded-[10px] cursor-pointer transition-all duration-200 ${
                    selectedPersons.has(person.id)
                      ? 'border-navy-1 bg-gradient-to-r from-navy-1 to-navy-2 text-white shadow-drop'
                      : 'border-gray-200 hover:border-navy-1 hover:shadow-drop bg-white'
                  }`}
                  onClick={() => togglePersonSelection(person.id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedPersons.has(person.id)
                          ? 'border-white bg-white text-navy-1'
                          : 'border-gray-300 bg-gray-50'
                      }`}>
                        {selectedPersons.has(person.id) && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                      <div>
                        <p className={`font-semibold ${selectedPersons.has(person.id) ? 'text-white' : 'text-gray-900'}`}>
                          {person.fullName}
                        </p>
                        <p className={`text-sm ${selectedPersons.has(person.id) ? 'text-white opacity-90' : 'text-gray-500'}`}>
                          {person.gender} - {person.relationship || 'Chủ hộ'} - {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
                        </p>
                      </div>
                    </div>
                    {selectedPersons.has(person.id) && (
                      <div className="w-48">
                        <select
                          className="w-full px-3 py-2 border border-white border-opacity-30 rounded-[6px] bg-white bg-opacity-20 backdrop-blur-sm text-white text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50"
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
                          <option value="" className="text-gray-900">Quan hệ với chủ hộ mới</option>
                          <option value="Chủ hộ" className="text-gray-900">Chủ hộ</option>
                          <option value="Vợ/Chồng" className="text-gray-900">Vợ/Chồng</option>
                          <option value="Con" className="text-gray-900">Con</option>
                          <option value="Cha/Mẹ" className="text-gray-900">Cha/Mẹ</option>
                          <option value="Anh/Chị/Em" className="text-gray-900">Anh/Chị/Em</option>
                          <option value="Khác" className="text-gray-900">Khác</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {selectedPersons.size > 0 && (
              <div className="mt-4 p-3 bg-yellow-2 rounded-[8px] border border-yellow-1">
                <p className="text-sm font-semibold text-navy-1">
                  ✓ Đã chọn {selectedPersons.size} thành viên
                </p>
              </div>
            )}
          </div>
        )}

        {/* Thông tin hộ khẩu mới */}
        {selectedHousehold && selectedPersons.size > 0 && (
          <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
                <Building2 className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Thông tin hộ khẩu mới</h2>
            </div>
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
        <div className="flex justify-end gap-4 pt-4 border-t border-gray-200">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all duration-200"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={loading || !selectedHousehold || selectedPersons.size === 0}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center"
          >
            <Split className="h-4 w-4 mr-2" />
            {loading ? 'Đang xử lý...' : 'Xác nhận tách hộ'}
          </button>
        </div>
      </form>
    </div>
  )
}



