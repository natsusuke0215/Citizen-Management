'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'

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
  persons: Array<{
    id: string
    fullName: string
    dateOfBirth: string
    gender: string
    relationship?: string
  }>
}

export default function RegisterPermanentPage() {
  const router = useRouter()
  const [households, setHouseholds] = useState<Household[]>([])
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('')
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam',
    placeOfBirth: '',
    origin: '',
    ethnicity: '',
    religion: '',
    nationality: 'Việt Nam',
    education: '',
    occupation: '',
    workplace: '',
    idType: 'CCCD',
    idNumber: '',
    idIssueDate: '',
    idIssuePlace: '',
    registrationDate: new Date().toISOString().split('T')[0], // Ngày đăng ký thường trú
    previousAddress: '',
    relationship: '',
    notes: ''
  })

  useEffect(() => {
    fetchHouseholds()
  }, [])

  useEffect(() => {
    if (selectedHouseholdId) {
      const household = households.find(h => h.id === selectedHouseholdId)
      setSelectedHousehold(household || null)
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!selectedHouseholdId) {
      toast.error('Vui lòng chọn hộ khẩu')
      setLoading(false)
      return
    }

    if (!formData.fullName.trim() || !formData.dateOfBirth || !formData.gender) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc (Họ tên, Ngày sinh, Giới tính)')
      setLoading(false)
      return
    }

    if (!formData.registrationDate) {
      toast.error('Vui lòng chọn ngày đăng ký thường trú')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          householdId: selectedHouseholdId,
          status: 'ACTIVE'
        })
      })

      if (response.ok) {
        toast.success('Đăng ký thường trú thành công!')
        // Reset form
        setFormData({
          fullName: '',
          dateOfBirth: '',
          gender: 'Nam',
          placeOfBirth: '',
          origin: '',
          ethnicity: '',
          religion: '',
          nationality: 'Việt Nam',
          education: '',
          occupation: '',
          workplace: '',
          idType: 'CCCD',
          idNumber: '',
          idIssueDate: '',
          idIssuePlace: '',
          registrationDate: new Date().toISOString().split('T')[0],
          previousAddress: '',
          relationship: '',
          notes: ''
        })
        setSelectedHouseholdId('')
        setSelectedHousehold(null)
        // Refresh households to show new member
        fetchHouseholds()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi đăng ký thường trú')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi đăng ký thường trú')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <UserPlus className="h-6 w-6" />
          Đăng ký thường trú
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Thêm thành viên thường trú mới vào hộ khẩu có sẵn
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chọn hộ khẩu */}
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Chọn hộ khẩu</h2>
          
          {/* Search */}
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

          {/* Household list */}
          <div className="max-h-60 overflow-y-auto border rounded-lg">
            {filteredHouseholds.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                {searchTerm ? 'Không tìm thấy hộ khẩu nào' : 'Chưa có hộ khẩu nào'}
              </div>
            ) : (
              <div className="divide-y">
                {filteredHouseholds.map((household) => (
                  <div
                    key={household.id}
                    onClick={() => setSelectedHouseholdId(household.id)}
                    className={`p-4 cursor-pointer hover:bg-gray-50 transition-colors ${
                      selectedHouseholdId === household.id ? 'bg-primary-50 border-l-4 border-primary-600' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="font-medium text-gray-900">
                          Số hộ khẩu: {household.householdId}
                        </div>
                        <div className="text-sm text-gray-600 mt-1">
                          Chủ hộ: {household.ownerName}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {household.address}
                          {household.street && `, ${household.street}`}
                          {`, ${household.ward}, ${household.district}`}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Khu phố: {household.districtRelation.name} • 
                          Thành viên: {household.persons.length} người
                        </div>
                      </div>
                      {selectedHouseholdId === household.id && (
                        <div className="text-primary-600">
                          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {selectedHousehold && (
            <div className="mt-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
              <div className="text-sm font-medium text-primary-900">
                Đã chọn: {selectedHousehold.householdId} - {selectedHousehold.ownerName}
              </div>
            </div>
          )}
        </div>

        {/* Thông tin nhân khẩu */}
        {selectedHouseholdId && (
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold mb-4">Thông tin nhân khẩu đăng ký thường trú</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Nhập họ và tên"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="input"
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Giới tính <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  className="input"
                  value={formData.gender}
                  onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                >
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quan hệ với chủ hộ
                </label>
                <select
                  className="input"
                  value={formData.relationship}
                  onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                >
                  <option value="">Chọn quan hệ</option>
                  <option value="Chủ hộ">Chủ hộ</option>
                  <option value="Vợ/Chồng">Vợ/Chồng</option>
                  <option value="Con">Con</option>
                  <option value="Cha/Mẹ">Cha/Mẹ</option>
                  <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày đăng ký thường trú <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  required
                  className="input"
                  value={formData.registrationDate}
                  onChange={(e) => setFormData({ ...formData, registrationDate: e.target.value })}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Ngày tháng năm đăng ký thường trú vào hộ khẩu này
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Địa chỉ nơi thường trú trước khi chuyển đến
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.previousAddress}
                  onChange={(e) => setFormData({ ...formData, previousAddress: e.target.value })}
                  placeholder="Nhập địa chỉ cũ (nếu có)"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nơi sinh
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.placeOfBirth}
                  onChange={(e) => setFormData({ ...formData, placeOfBirth: e.target.value })}
                  placeholder="Nhập nơi sinh"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nguyên quán
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.origin}
                  onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                  placeholder="Nhập nguyên quán"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dân tộc
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.ethnicity}
                  onChange={(e) => setFormData({ ...formData, ethnicity: e.target.value })}
                  placeholder="Nhập dân tộc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tôn giáo
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.religion}
                  onChange={(e) => setFormData({ ...formData, religion: e.target.value })}
                  placeholder="Nhập tôn giáo"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quốc tịch
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.nationality}
                  onChange={(e) => setFormData({ ...formData, nationality: e.target.value })}
                  placeholder="Nhập quốc tịch"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Trình độ học vấn
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.education}
                  onChange={(e) => setFormData({ ...formData, education: e.target.value })}
                  placeholder="Nhập trình độ học vấn"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nghề nghiệp
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.occupation}
                  onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                  placeholder="Nhập nghề nghiệp"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nơi làm việc
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.workplace}
                  onChange={(e) => setFormData({ ...formData, workplace: e.target.value })}
                  placeholder="Nhập nơi làm việc"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Loại giấy tờ
                </label>
                <select
                  className="input"
                  value={formData.idType}
                  onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                >
                  <option value="CCCD">CCCD</option>
                  <option value="CMND">CMND</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Số CCCD/CMND
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.idNumber}
                  onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                  placeholder="Nhập số CCCD/CMND"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày cấp
                </label>
                <input
                  type="date"
                  className="input"
                  value={formData.idIssueDate}
                  onChange={(e) => setFormData({ ...formData, idIssueDate: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nơi cấp
                </label>
                <input
                  type="text"
                  className="input"
                  value={formData.idIssuePlace}
                  onChange={(e) => setFormData({ ...formData, idIssuePlace: e.target.value })}
                  placeholder="Nhập nơi cấp"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ghi chú
                </label>
                <textarea
                  className="input"
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Nhập ghi chú (nếu có)"
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
            disabled={loading || !selectedHouseholdId}
            className="btn btn-primary"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký thường trú'}
          </button>
        </div>
      </form>
    </div>
  )
}
