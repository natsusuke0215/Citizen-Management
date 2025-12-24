'use client'

import { useEffect, useState } from 'react'
import { Search, FileDown, Users, Calendar, CreditCard, FileText, Home, Sparkles, CheckCircle } from 'lucide-react'
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
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="h-8 w-8 text-navy-1" />
            Cấp giấy tạm vắng
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Chọn nhân khẩu và điền thông tin để cấp giấy tạm vắng. Sau khi lưu, hệ thống sẽ tự động tải file PDF.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Danh sách nhân khẩu */}
        <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
              <Users className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Chọn nhân khẩu</h2>
          </div>
          <div className="mb-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Tìm theo tên, số CMND/CCCD, số hộ khẩu..."
                className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto divide-y divide-gray-200 rounded-[8px] border border-gray-200">
            {filteredPersons.map((person) => (
              <button
                key={person.id}
                type="button"
                onClick={() => setSelectedPerson(person)}
                className={`w-full text-left px-4 py-3 flex items-center justify-between transition-all duration-200 ${
                  selectedPerson?.id === person.id 
                    ? 'bg-gradient-to-r from-navy-1 to-navy-2 text-white shadow-drop' 
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex-1">
                  <div className={`font-semibold ${selectedPerson?.id === person.id ? 'text-white' : 'text-gray-900'}`}>
                    {person.fullName}
                  </div>
                  <div className={`text-xs flex items-center gap-3 mt-1 ${selectedPerson?.id === person.id ? 'text-white opacity-90' : 'text-gray-500'}`}>
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
                  <div className={`text-xs mt-1 ${selectedPerson?.id === person.id ? 'text-white opacity-80' : 'text-gray-400'}`}>
                    Hộ khẩu: {person.household.householdId} - {person.household.address}
                  </div>
                </div>
                {selectedPerson?.id === person.id && (
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                )}
              </button>
            ))}
            {filteredPersons.length === 0 && (
              <div className="py-8 text-center">
                <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-500">Không tìm thấy nhân khẩu phù hợp với từ khóa tìm kiếm.</p>
              </div>
            )}
          </div>
        </div>

        {/* Form cấp giấy */}
        <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[10px]">
              <FileDown className="h-6 w-6 text-navy-1" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Thông tin giấy tạm vắng</h2>
          </div>

          {selectedPerson ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[10px] p-4 shadow-drop">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle className="h-5 w-5" />
                  <div className="font-semibold text-lg">{selectedPerson.fullName}</div>
                </div>
                <div className="text-sm opacity-90">
                  Ngày sinh: {new Date(selectedPerson.dateOfBirth).toLocaleDateString('vi-VN')} - Giới tính: {selectedPerson.gender}
                </div>
                {selectedPerson.idNumber && (
                  <div className="text-sm opacity-90 mt-1">
                    CMND/CCCD: {selectedPerson.idNumber}
                  </div>
                )}
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

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-[10px] p-4">
                <p className="text-xs text-blue-800">
                  <strong>Lưu ý:</strong> Sau khi bấm <strong>Lưu và tải PDF</strong>, hệ thống sẽ tạo bản ghi tạm vắng và tự động tải file giấy xác nhận tạm vắng.
                </p>
              </div>

              <div className="flex justify-end pt-4 border-t border-gray-200">
                <button 
                  type="submit" 
                  className="px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 inline-flex items-center"
                >
                  <FileDown className="h-4 w-4 mr-2" />
                  Lưu và tải PDF
                </button>
              </div>
            </form>
          ) : (
            <div className="h-full flex flex-col items-center justify-center py-12 text-center">
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-gradient-to-br from-navy-1 to-navy-2 opacity-10 rounded-full blur-2xl"></div>
                <Users className="h-16 w-16 text-gray-400 relative" />
              </div>
              <p className="text-sm font-medium text-gray-700 mb-1">Chưa chọn nhân khẩu</p>
              <p className="text-xs text-gray-500">Vui lòng chọn một nhân khẩu ở danh sách bên trái</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


