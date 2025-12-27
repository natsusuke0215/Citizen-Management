'use client'

import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import toast from 'react-hot-toast'
import { exportTemporaryAbsencePdf } from '@/lib/pdf-client'
import PersonSelection from './components/PersonSelection'
import TemporaryAbsenceForm from './components/TemporaryAbsenceForm'

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
        <PersonSelection
          persons={persons}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          selectedPerson={selectedPerson}
          onPersonSelect={setSelectedPerson}
        />

        {/* Form cấp giấy */}
        <TemporaryAbsenceForm
          selectedPerson={selectedPerson}
          form={form}
          setForm={setForm}
          onSubmit={handleSubmit}
        />
      </div>
    </div>
  )
}
