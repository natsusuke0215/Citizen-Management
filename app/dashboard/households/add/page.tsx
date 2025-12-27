'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plus, X, Home, Users, Building2, Sparkles } from 'lucide-react'
import toast from 'react-hot-toast'

interface District {
  id: string
  name: string
  description?: string
}

export default function AddHouseholdPage() {
  const router = useRouter()
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(false)
  const [memberCount, setMemberCount] = useState(1)
  
  const [formData, setFormData] = useState({
    householdId: '',
    ownerName: '',
    address: '',
    street: '',
    ward: '',
    district: '',
    districtId: '',
    householdType: 'THƯỜNG_TRÚ',
    issueDate: ''
  })

  const [members, setMembers] = useState<Array<{
    fullName: string
    relationship: string
    dateOfBirth: string
    gender: string
    idNumber: string
    origin: string
    ethnicity: string
    religion: string
    nationality: string
    education: string
  }>>([{
    fullName: '',
    relationship: 'Chủ hộ',
    dateOfBirth: '',
    gender: '',
    idNumber: '',
    origin: '',
    ethnicity: '',
    religion: '',
    nationality: 'Việt Nam',
    education: ''
  }])

  useEffect(() => {
    fetchDistricts()
  }, [])

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

  const handleMemberCountChange = (count: number) => {
    if (count < 1) return
    setMemberCount(count)
    const newMembers = [...members]
    while (newMembers.length < count) {
      newMembers.push({
        fullName: '',
        relationship: '',
        dateOfBirth: '',
        gender: '',
        idNumber: '',
        origin: '',
        ethnicity: '',
        religion: '',
        nationality: 'Việt Nam',
        education: ''
      })
    }
    while (newMembers.length > count) {
      newMembers.pop()
    }
    setMembers(newMembers)
  }

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...members]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setMembers(newMembers)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    if (!formData.householdId || !formData.ownerName || !formData.address || 
        !formData.ward || !formData.district || !formData.districtId || 
        !formData.householdType || !formData.issueDate) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc')
      setLoading(false)
      return
    }

    // Validate members
    const validMembers = members.filter(m => m.fullName && m.dateOfBirth && m.gender)
    if (validMembers.length === 0) {
      toast.error('Vui lòng thêm ít nhất một thành viên')
      setLoading(false)
      return
    }

    // Check if owner is in members
    const hasOwner = validMembers.some(m => m.relationship === 'Chủ hộ')
    if (!hasOwner) {
      toast.error('Vui lòng chỉ định một thành viên làm chủ hộ')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/households', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          members: validMembers
        })
      })

      if (response.ok) {
        toast.success('Thêm hộ khẩu thành công!')
        router.push('/dashboard/households')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi thêm hộ khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi thêm hộ khẩu')
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
            <Home className="h-8 w-8 text-navy-1" />
            Thêm hộ khẩu mới
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Điền thông tin để thêm hộ khẩu mới vào hệ thống
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin hộ khẩu */}
        <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Thông tin hộ khẩu</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Số hộ khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="input"
                value={formData.householdId}
                onChange={(e) => setFormData({ ...formData, householdId: e.target.value })}
                placeholder="Nhập số hộ khẩu"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Họ tên chủ hộ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                className="input"
                value={formData.ownerName}
                onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                placeholder="Nhập họ tên chủ hộ"
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

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Khu phố <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="input"
                value={formData.districtId}
                onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
              >
                <option value="">Chọn khu phố</option>
                {districts.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Loại hộ <span className="text-red-500">*</span>
              </label>
              <select
                required
                className="input"
                value={formData.householdType}
                onChange={(e) => setFormData({ ...formData, householdType: e.target.value })}
                disabled
              >
                <option value="THƯỜNG_TRÚ">Thường trú</option>
              </select>
              <p className="mt-1 text-xs text-gray-500">
                Tạm trú và Tạm vắng được quản lý trong phần quản lý nhân khẩu
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày cấp <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                className="input"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Thành viên */}
        <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[10px]">
                <Users className="h-6 w-6 text-navy-1" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Thành viên trong hộ</h2>
            </div>
            <div className="flex items-center gap-2">
              <label className="text-sm text-gray-700">Số thành viên:</label>
              <input
                type="number"
                min="1"
                className="input w-20"
                value={memberCount}
                onChange={(e) => handleMemberCountChange(parseInt(e.target.value) || 1)}
              />
            </div>
          </div>

          <div className="space-y-4">
            {members.map((member, index) => (
              <div key={index} className="border rounded-lg p-4">
                <h3 className="font-medium mb-3">Thành viên {index + 1}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Họ và tên <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={member.fullName}
                      onChange={(e) => updateMember(index, 'fullName', e.target.value)}
                      placeholder="Nhập họ và tên"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Quan hệ với chủ hộ <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="input"
                      value={member.relationship}
                      onChange={(e) => updateMember(index, 'relationship', e.target.value)}
                    >
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
                      Ngày sinh <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      className="input"
                      value={member.dateOfBirth}
                      onChange={(e) => updateMember(index, 'dateOfBirth', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Giới tính <span className="text-red-500">*</span>
                    </label>
                    <select
                      className="input"
                      value={member.gender}
                      onChange={(e) => updateMember(index, 'gender', e.target.value)}
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="Nam">Nam</option>
                      <option value="Nữ">Nữ</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Số CCCD/CMND
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={member.idNumber}
                      onChange={(e) => updateMember(index, 'idNumber', e.target.value)}
                      placeholder="Nhập số CCCD/CMND"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nguyên quán
                    </label>
                    <input
                      type="text"
                      className="input"
                      value={member.origin}
                      onChange={(e) => updateMember(index, 'origin', e.target.value)}
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
                      value={member.ethnicity}
                      onChange={(e) => updateMember(index, 'ethnicity', e.target.value)}
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
                      value={member.religion}
                      onChange={(e) => updateMember(index, 'religion', e.target.value)}
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
                      value={member.nationality}
                      onChange={(e) => updateMember(index, 'nationality', e.target.value)}
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
                      value={member.education}
                      onChange={(e) => updateMember(index, 'education', e.target.value)}
                      placeholder="Nhập trình độ học vấn"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
            disabled={loading}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Đang xử lý...' : 'Thêm hộ khẩu'}
          </button>
        </div>
      </form>
    </div>
  )
}



