'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Home, Users, Building2 } from 'lucide-react'
import toast from 'react-hot-toast'
import { useDistricts } from '../shared/hooks/useDistricts'
import HouseholdFormFields from '../shared/components/HouseholdFormFields'
import MemberFormFields from '../shared/components/MemberFormFields'
import { District } from '../shared/types'

interface HouseholdFormData {
  householdId: string
  ownerName: string
  address: string
  street: string
  ward: string
  district: string
  districtId: string
  householdType: string
  issueDate: string
}

interface Member {
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
}

export default function AddHouseholdPage() {
  const router = useRouter()
  const { districts } = useDistricts()
  const [loading, setLoading] = useState(false)
  const [memberCount, setMemberCount] = useState(1)
  
  const [formData, setFormData] = useState<HouseholdFormData>({
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

  const [members, setMembers] = useState<Member[]>([{
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
          <HouseholdFormFields
            formData={formData}
            setFormData={setFormData}
            districts={districts}
          />
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
              <MemberFormFields
                key={index}
                member={member}
                index={index}
                onUpdate={updateMember}
              />
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

