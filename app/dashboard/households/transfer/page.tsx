'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightLeft, Search, Home, MapPin, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface District {
  id: string
  name: string
  description?: string
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
}

export default function TransferHouseholdPage() {
  const router = useRouter()
  const [households, setHouseholds] = useState<Household[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('')
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    newAddress: '',
    newStreet: '',
    newWard: '',
    newDistrict: '',
    newDistrictId: '',
    transferReason: '',
    transferDate: new Date().toISOString().split('T')[0]
  })

  useEffect(() => {
    fetchHouseholds()
    fetchDistricts()
  }, [])

  useEffect(() => {
    if (selectedHouseholdId) {
      const household = households.find(h => h.id === selectedHouseholdId)
      setSelectedHousehold(household || null)
      if (household) {
        setFormData(prev => ({
          ...prev,
          newAddress: household.address,
          newStreet: household.street || '',
          newWard: household.ward,
          newDistrict: household.district,
          newDistrictId: household.districtRelation.id
        }))
      }
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

  const fetchDistricts = async () => {
    try {
      const response = await fetch('/api/districts')
      if (response.ok) {
        const data = await response.json()
        setDistricts(data)
      }
    } catch (error) {
      console.error('Error fetching districts:', error)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedHousehold) {
      toast.error('Vui lòng chọn hộ khẩu cần chuyển')
      return
    }

    if (!formData.newAddress || !formData.newWard || !formData.newDistrict || !formData.newDistrictId) {
      toast.error('Vui lòng điền đầy đủ thông tin địa chỉ mới')
      return
    }

    // Check if address changed
    if (formData.newAddress === selectedHousehold.address &&
        formData.newWard === selectedHousehold.ward &&
        formData.newDistrict === selectedHousehold.district &&
        formData.newDistrictId === selectedHousehold.districtRelation.id) {
      toast.error('Địa chỉ mới phải khác địa chỉ hiện tại')
      return
    }

    setLoading(true)

    try {
      const response = await fetch(`/api/households/${selectedHousehold.id}/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newAddress: formData.newAddress,
          newStreet: formData.newStreet,
          newWard: formData.newWard,
          newDistrict: formData.newDistrict,
          newDistrictId: formData.newDistrictId,
          transferReason: formData.transferReason,
          transferDate: formData.transferDate
        })
      })

      if (response.ok) {
        toast.success('Chuyển hộ khẩu thành công!')
        router.push('/dashboard/households')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi chuyển hộ khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi chuyển hộ khẩu')
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
            <ArrowRightLeft className="h-8 w-8 text-navy-1" />
            Chuyển hộ khẩu
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Chuyển hộ khẩu sang địa chỉ mới
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
            <h2 className="text-xl font-bold text-gray-900">Chọn hộ khẩu cần chuyển</h2>
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
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Khu phố</th>
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
                          {household.districtRelation.name}
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
                <Home className="h-5 w-5" />
                <h3 className="font-semibold">Hộ khẩu đã chọn</h3>
              </div>
              <div className="space-y-1 text-sm">
                <p><strong>Số hộ khẩu:</strong> {selectedHousehold.householdId}</p>
                <p><strong>Chủ hộ:</strong> {selectedHousehold.ownerName}</p>
                <p><strong>Địa chỉ hiện tại:</strong> {selectedHousehold.address}, {selectedHousehold.street || ''}, {selectedHousehold.ward}, {selectedHousehold.district}</p>
                <p><strong>Khu phố:</strong> {selectedHousehold.districtRelation.name}</p>
              </div>
            </div>
          )}
        </div>

        {/* Địa chỉ mới */}
        {selectedHousehold && (
          <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[10px]">
                <MapPin className="h-6 w-6 text-navy-1" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Địa chỉ mới</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số nhà mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.newAddress}
                  onChange={(e) => setFormData({ ...formData, newAddress: e.target.value })}
                  placeholder="Nhập số nhà mới"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Đường phố (ấp) mới
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.newStreet}
                  onChange={(e) => setFormData({ ...formData, newStreet: e.target.value })}
                  placeholder="Nhập đường phố mới"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phường (xã, thị trấn) mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.newWard}
                  onChange={(e) => setFormData({ ...formData, newWard: e.target.value })}
                  placeholder="Nhập phường mới"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quận (huyện) mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.newDistrict}
                  onChange={(e) => setFormData({ ...formData, newDistrict: e.target.value })}
                  placeholder="Nhập quận mới"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Khu phố mới <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="input"
                  value={formData.newDistrictId}
                  onChange={(e) => setFormData({ ...formData, newDistrictId: e.target.value })}
                >
                  <option value="">Chọn khu phố mới</option>
                  {districts.map((district) => (
                    <option key={district.id} value={district.id}>
                      {district.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày chuyển
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.transferDate}
                  onChange={(e) => setFormData({ ...formData, transferDate: e.target.value })}
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Lý do chuyển
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.transferReason}
                  onChange={(e) => setFormData({ ...formData, transferReason: e.target.value })}
                  placeholder="Nhập lý do chuyển hộ khẩu (nếu có)"
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
            disabled={loading || !selectedHousehold}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none inline-flex items-center"
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            {loading ? 'Đang xử lý...' : 'Chuyển hộ khẩu'}
          </button>
        </div>
      </form>
    </div>
  )
}



