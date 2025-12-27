'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserPlus } from 'lucide-react'
import toast from 'react-hot-toast'
import { useHouseholds } from '../shared/hooks/useHouseholds'
import { filterHouseholds } from '../shared/utils/filterUtils'
import { PersonFormData } from '../shared/types'
import HouseholdSearch from '../shared/components/HouseholdSearch'
import PersonFormFields from '../shared/components/PersonFormFields'

export default function RegisterPermanentPage() {
  const router = useRouter()
  const { households, fetchHouseholds } = useHouseholds()
  const [selectedHouseholdId, setSelectedHouseholdId] = useState<string>('')
  const [selectedHousehold, setSelectedHousehold] = useState<typeof households[0] | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const [formData, setFormData] = useState<PersonFormData>({
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

  useEffect(() => {
    if (selectedHouseholdId) {
      const household = households.find(h => h.id === selectedHouseholdId)
      setSelectedHousehold(household || null)
    } else {
      setSelectedHousehold(null)
    }
  }, [selectedHouseholdId, households])

  const filteredHouseholds = filterHouseholds(households, searchTerm)

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <UserPlus className="h-8 w-8 text-navy-1" />
            Đăng ký thường trú
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Thêm thành viên thường trú mới vào hộ khẩu có sẵn
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Chọn hộ khẩu */}
        <HouseholdSearch
          households={filteredHouseholds}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedHouseholdId={selectedHouseholdId}
          onSelectHousehold={setSelectedHouseholdId}
        />

        {/* Thông tin nhân khẩu */}
        {selectedHouseholdId && (
          <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[10px]">
                <UserPlus className="h-6 w-6 text-navy-1" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">Thông tin nhân khẩu đăng ký thường trú</h2>
            </div>
            <PersonFormFields
              formData={formData}
              setFormData={setFormData}
              showRegistrationDate={true}
            />
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
            disabled={loading || !selectedHouseholdId}
            className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? 'Đang xử lý...' : 'Đăng ký thường trú'}
          </button>
        </div>
      </form>
    </div>
  )
}
