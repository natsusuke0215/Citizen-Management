'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRightLeft } from 'lucide-react'
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
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Chuyển hộ khẩu</h1>
        <p className="mt-2 text-sm text-gray-700">
          Chuyển hộ khẩu sang địa chỉ mới
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chọn hộ khẩu */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Chọn hộ khẩu cần chuyển</h2>
          <select
            className="input"
            value={selectedHouseholdId}
            onChange={(e) => setSelectedHouseholdId(e.target.value)}
            required
          >
            <option value="">Chọn hộ khẩu</option>
            {households.map((household) => (
              <option key={household.id} value={household.id}>
                {household.householdId} - {household.ownerName}
              </option>
            ))}
          </select>

          {selectedHousehold && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-medium mb-2">Thông tin hộ khẩu hiện tại:</h3>
              <p><strong>Số hộ khẩu:</strong> {selectedHousehold.householdId}</p>
              <p><strong>Chủ hộ:</strong> {selectedHousehold.ownerName}</p>
              <p><strong>Địa chỉ hiện tại:</strong> {selectedHousehold.address}, {selectedHousehold.street || ''}, {selectedHousehold.ward}, {selectedHousehold.district}</p>
              <p><strong>Khu phố:</strong> {selectedHousehold.districtRelation.name}</p>
            </div>
          )}
        </div>

        {/* Địa chỉ mới */}
        {selectedHousehold && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Địa chỉ mới</h2>
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
            disabled={loading || !selectedHousehold}
            className="btn btn-primary"
          >
            <ArrowRightLeft className="h-4 w-4 mr-2" />
            {loading ? 'Đang xử lý...' : 'Chuyển hộ khẩu'}
          </button>
        </div>
      </form>
    </div>
  )
}
