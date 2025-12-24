'use client'

import { useEffect, useState } from 'react'
import { Search, FileDown, Users, Calendar, CreditCard } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportTemporaryAbsencePdf } from '@/lib/pdf-client'

interface Person {
  id: string
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string | null
  household: {
    id: string
    householdId: string
    address: string
    street?: string | null
    ward?: string | null
    district?: string | null
    districtRelation?: {
      id: string
      name: string
    } | null
  }
}

export default function TemporaryAbsencePage() {
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [form, setForm] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    reason: '',
    destination: '',
  })

  useEffect(() => {
    fetchPersons()
  }, [])

  const fetchPersons = async () => {
    try {
      const res = await fetch('/api/persons')
      if (res.ok) {
        const data = await res.json()
        setPersons(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách nhân khẩu')
    } finally {
      setLoading(false)
    }
  }

  const filteredPersons = persons.filter((person) => {
    const searchLower = (searchTerm || '').toLowerCase()
    return [person.fullName, person.idNumber, person.household?.householdId].some((v) =>
      (v || '').toLowerCase().includes(searchLower),
    )
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPerson) {
      toast.error('Vui lòng chọn nhân khẩu')
      return
    }

    try {
      // Lưu vào database
      const res = await fetch('/api/temporary-absences', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          personId: selectedPerson.id,
          startDate: form.startDate,
          endDate: form.endDate || null,
          reason: form.reason || null,
          destination: form.destination || null,
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        throw new Error(data?.message || 'Có lỗi xảy ra khi cấp giấy tạm vắng')
      }

      const created = await res.json()
      
      // Tạo và tải PDF sử dụng jsPDF
      const household = selectedPerson.household
      const addressParts = [
        household?.address,
        household?.street,
        household?.ward,
        household?.district,
        household?.districtRelation?.name
      ].filter(Boolean)
      const permanentAddress = addressParts.length > 0 ? addressParts.join(', ') : 'N/A'
      
      exportTemporaryAbsencePdf({
        fullName: selectedPerson.fullName,
        dateOfBirth: selectedPerson.dateOfBirth,
        gender: selectedPerson.gender,
        idNumber: selectedPerson.idNumber || '',
        permanentAddress: permanentAddress,
        temporaryAddress: form.destination || '',
      })
      
      toast.success('Đã cấp giấy tạm vắng và tải file PDF')
    } catch (error: any) {
      console.error(error)
      toast.error(error.message || 'Có lỗi xảy ra khi cấp giấy tạm vắng')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Cấp giấy tạm vắng</h1>
          <p className="mt-2 text-sm text-gray-700">
            Chọn nhân khẩu và điền thông tin để cấp giấy tạm vắng. Sau khi lưu, hệ thống sẽ tự động tải file PDF.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Danh sách nhân khẩu */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <Users className="h-5 w-5 text-primary-600" />
            Chọn nhân khẩu
          </h2>
          <div className="mb-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm theo tên, số CMND/CCCD, số hộ khẩu..."
                className="input pl-10"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
            {filteredPersons.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => setSelectedPerson(person)}
                className={`w-full text-left px-3 py-2 flex items-center justify-between hover:bg-gray-50 ${
                  selectedPerson?.id === person.id ? 'bg-primary-50 border-l-4 border-primary-500' : ''
                }`}
              >
                <div>
                  <div className="font-medium text-gray-900">{person.fullName}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2 mt-1">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
                    </span>
                    {person.idNumber && (
                      <span className="flex items-center gap-1">
                        <CreditCard className="h-3 w-3" />
                        {person.idNumber}
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-400 mt-1">
                    Hộ khẩu: {person.household.householdId} - {person.household.address}
                  </div>
                </div>
              </button>
            ))}
            {filteredPersons.length === 0 && (
              <div className="py-6 text-center text-sm text-gray-500">
                Không tìm thấy nhân khẩu phù hợp với từ khóa tìm kiếm.
              </div>
            )}
          </div>
        </div>

        {/* Form cấp giấy */}
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
            <FileDown className="h-5 w-5 text-primary-600" />
            Thông tin giấy tạm vắng
          </h2>

          {selectedPerson ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="bg-gray-50 rounded-md p-3 text-sm text-gray-700">
                <div className="font-medium">{selectedPerson.fullName}</div>
                <div className="text-xs text-gray-500 mt-1">
                  Ngày sinh: {new Date(selectedPerson.dateOfBirth).toLocaleDateString('vi-VN')} - Giới tính:{' '}
                  {selectedPerson.gender}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Ngày bắt đầu tạm vắng <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    className="input"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Ngày kết thúc (nếu có)</label>
                  <input
                    type="date"
                    className="input"
                    value={form.endDate}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Lý do tạm vắng</label>
                <textarea
                  className="input"
                  rows={3}
                  value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Ví dụ: đi công tác, học tập, chữa bệnh..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nơi tạm vắng</label>
                <input
                  type="text"
                  className="input"
                  value={form.destination}
                  onChange={(e) => setForm({ ...form, destination: e.target.value })}
                  placeholder="Nhập địa chỉ nơi tạm vắng"
                />
              </div>

              <p className="text-xs text-gray-500">
                Sau khi bấm <strong>Lưu và tải PDF</strong>, hệ thống sẽ tạo bản ghi tạm vắng và tự động tải file giấy
                xác nhận tạm vắng.
              </p>

              <div className="flex justify-end">
                <button type="submit" className="btn btn-primary inline-flex items-center">
                  <FileDown className="h-4 w-4 mr-2" />
                  Lưu và tải PDF
                </button>
              </div>
            </form>
          ) : (
            <div className="h-full flex items-center justify-center text-sm text-gray-500">
              Vui lòng chọn một nhân khẩu ở danh sách bên trái.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


