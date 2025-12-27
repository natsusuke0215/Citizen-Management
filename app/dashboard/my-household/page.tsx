'use client'

import { useState } from 'react'
import { Users, UserPlus, Edit, FileDown } from 'lucide-react'
import toast from 'react-hot-toast'
import { useHousehold } from './hooks/useHousehold'
import { usePersons } from './hooks/usePersons'
import { exportHouseholdToPdf } from './utils/pdfUtils'
import { PersonFormData } from './types'
import HouseholdInfo from './components/HouseholdInfo'
import PersonsList from './components/PersonsList'
import AddPersonModal from './components/AddPersonModal'
import RemovePersonModal from './components/RemovePersonModal'

export default function MyHouseholdPage() {
  const { household, loading: householdLoading } = useHousehold()
  const { persons, loading: personsLoading } = usePersons()
  const [showAddPersonModal, setShowAddPersonModal] = useState(false)
  const [showRemovePersonModal, setShowRemovePersonModal] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<{ id: string; fullName: string; idNumber: string } | null>(null)
  const [formData, setFormData] = useState<PersonFormData>({
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam',
    idNumber: '',
    relationship: ''
  })

  const loading = householdLoading || personsLoading

  const handleAddPerson = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.fullName.trim() || !formData.idNumber.trim()) {
      toast.error('Họ tên và số CMND/CCCD là bắt buộc')
      return
    }

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'ADD_PERSON',
          description: `Thêm nhân khẩu: ${formData.fullName}`,
          data: {
            fullName: formData.fullName,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            idNumber: formData.idNumber,
            relationship: formData.relationship
          }
        }),
      })

      if (response.ok) {
        toast.success('Yêu cầu thêm nhân khẩu đã được gửi!')
        setShowAddPersonModal(false)
        setFormData({
          fullName: '',
          dateOfBirth: '',
          gender: 'Nam',
          idNumber: '',
          relationship: ''
        })
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleRemovePerson = async (person: { id: string; fullName: string; idNumber: string }) => {
    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'REMOVE_PERSON',
          description: `Xóa nhân khẩu: ${person.fullName}`,
          data: {
            personId: person.id,
            fullName: person.fullName,
            idNumber: person.idNumber
          }
        }),
      })

      if (response.ok) {
        toast.success('Yêu cầu xóa nhân khẩu đã được gửi!')
        setShowRemovePersonModal(false)
        setSelectedPerson(null)
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleUpdateHousehold = async () => {
    if (!household) return

    try {
      const response = await fetch('/api/requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'HOUSEHOLD_UPDATE',
          description: 'Cập nhật thông tin hộ khẩu',
          data: {
            householdId: household.householdId,
            address: household.address
          }
        }),
      })

      if (response.ok) {
        toast.success('Yêu cầu cập nhật hộ khẩu đã được gửi!')
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleExportPdf = () => {
    if (!household) {
      toast.error('Không có dữ liệu để xuất PDF')
      return
    }

    try {
      exportHouseholdToPdf(household, persons)
      toast.success('Đã tạo file PDF thành công!')
    } catch (error) {
      console.error('Error exporting PDF:', error)
      toast.error('Có lỗi xảy ra khi tạo file PDF')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  if (!household) {
    return (
      <div className="text-center py-12">
        <Users className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">Chưa có hộ khẩu</h3>
        <p className="mt-1 text-sm text-gray-500">
          Bạn chưa được liên kết với hộ khẩu nào. Vui lòng liên hệ admin để được hỗ trợ.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Hộ khẩu của tôi</h1>
          <p className="mt-2 text-sm text-gray-700">
            Thông tin hộ khẩu và thành viên trong gia đình
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowAddPersonModal(true)}
            className="btn btn-primary inline-flex items-center mr-2"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Thêm nhân khẩu
          </button>
          <button
            onClick={handleUpdateHousehold}
            className="btn btn-secondary inline-flex items-center mr-2"
          >
            <Edit className="h-4 w-4 mr-2" />
            Yêu cầu cập nhật
          </button>
          <button
            onClick={handleExportPdf}
            className="btn btn-primary inline-flex items-center"
          >
            <FileDown className="h-4 w-4 mr-2" />
            Lưu và tải PDF
          </button>
        </div>
      </div>

      <HouseholdInfo household={household} />

      <PersonsList
        persons={persons}
        onRemove={(person) => {
          setSelectedPerson({ id: person.id, fullName: person.fullName, idNumber: person.idNumber })
          setShowRemovePersonModal(true)
        }}
      />

      <AddPersonModal
        isOpen={showAddPersonModal}
        onClose={() => setShowAddPersonModal(false)}
        onSubmit={handleAddPerson}
        formData={formData}
        setFormData={setFormData}
      />

      <RemovePersonModal
        isOpen={showRemovePersonModal}
        onClose={() => {
          setShowRemovePersonModal(false)
          setSelectedPerson(null)
        }}
        onConfirm={handleRemovePerson}
        person={selectedPerson}
      />
    </div>
  )
}
