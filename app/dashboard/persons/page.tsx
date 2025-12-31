'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Users, Home, MapPin, Calendar } from 'lucide-react'
import toast from 'react-hot-toast'
import PersonStatistics from './shared/components/PersonStatistics'
import SearchBar from '../households/shared/components/SearchBar'
import PaginationControls from './shared/components/PaginationControls'
import PersonGrid from './shared/components/PersonGrid'
import AddPersonModal from './shared/components/AddPersonModal'
import ChangePersonModal from './shared/components/ChangePersonModal'
import DeletePersonModal from './shared/components/DeletePersonModal'

interface Person {
  id: string
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string | null
  relationship: string | null
  status: string
  household: {
    id: string
    householdId: string
    address: string
    district: {
      id: string
      name: string
    }
  }
  temporaryResidences?: Array<{
    id: string
    status: string
    startDate: string
    endDate: string | null
    originalAddress: string | null
    householdId: string | null
  }>
  temporaryAbsences?: Array<{
    id: string
    status: string
    startDate: string
    endDate: string | null
    reason: string | null
    destination: string | null
  }>
  createdAt: string
}

type ResidenceFilter = 'all' | 'permanent' | 'temporary_residence' | 'temporary_absence'

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [residenceFilter, setResidenceFilter] = useState<ResidenceFilter>('all')
  const [showModal, setShowModal] = useState(false)
  const [editingPerson, setEditingPerson] = useState<Person | null>(null)
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    gender: 'Nam',
    idType: 'CCCD',
    idNumber: '',
    householdId: ''
  })

  const [showChangeModal, setShowChangeModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [changeForm, setChangeForm] = useState({
    changeType: 'MOVE_OUT' as 'MOVE_OUT' | 'DECEASED',
    changeDate: new Date().toISOString().split('T')[0],
    moveOutDate: '',
    moveOutPlace: '',
    notes: ''
  })
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(30)

  useEffect(() => {
    let isMounted = true
    
    const loadData = async () => {
      try {
        const response = await fetch('/api/persons')
        if (response.ok && isMounted) {
          const data = await response.json()
          setPersons(data)
        }
      } catch (error) {
        if (isMounted) {
          toast.error('Có lỗi xảy ra khi tải danh sách nhân khẩu')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }
    
    loadData()
    
    return () => {
      isMounted = false
    }
  }, [])

  const fetchPersons = async () => {
    try {
      const response = await fetch('/api/persons')
      if (response.ok) {
        const data = await response.json()
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

    if (!formData.fullName.trim() || !formData.dateOfBirth || !formData.gender || !formData.householdId) {
      toast.error('Họ tên, ngày sinh, giới tính và hộ khẩu là bắt buộc')
      return
    }

    try {
      const response = await fetch('/api/persons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          dateOfBirth: formData.dateOfBirth,
          gender: formData.gender,
          idType: formData.idType,
          idNumber: formData.idNumber || null,
          householdId: formData.householdId
        })
      })

      if (response.ok) {
        toast.success('Thêm nhân khẩu thành công!')
        setShowModal(false)
        setFormData({
          fullName: '',
          dateOfBirth: '',
          gender: 'Nam',
          idType: 'CCCD',
          idNumber: '',
          householdId: ''
        })
        fetchPersons()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
  }

  const handleDelete = (person: Person) => {
    setSelectedPerson(person)
    setChangeForm({
      changeType: 'MOVE_OUT',
      changeDate: new Date().toISOString().split('T')[0],
      moveOutDate: '',
      moveOutPlace: '',
      notes: ''
    })
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async (changeType: 'MOVE_OUT' | 'DECEASED') => {
    if (!selectedPerson) return

    try {
      const body: any = {
        changeType,
        changeDate: changeForm.changeDate
      }

      if (changeType === 'MOVE_OUT') {
        body.moveOutDate = changeForm.moveOutDate || changeForm.changeDate
        body.moveOutPlace = changeForm.moveOutPlace || undefined
        body.notes = changeForm.notes || undefined
      }

      const response = await fetch(`/api/persons/${selectedPerson.id}/changes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast.success(changeType === 'MOVE_OUT' ? 'Đã cập nhật: Chuyển đi' : 'Đã cập nhật: Đã mất')
        setShowDeleteModal(false)
        setSelectedPerson(null)
        fetchPersons()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi cập nhật nhân khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi cập nhật nhân khẩu')
    }
  }

  const openChangeModal = (person: Person) => {
    setSelectedPerson(person)
    setChangeForm({
      changeType: 'MOVE_OUT',
      changeDate: new Date().toISOString().split('T')[0],
      moveOutDate: '',
      moveOutPlace: '',
      notes: ''
    })
    setShowChangeModal(true)
  }

  const handleChangeSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPerson) return

    try {
      const body: any = {
        changeType: changeForm.changeType,
        changeDate: changeForm.changeDate
      }

      if (changeForm.changeType === 'MOVE_OUT') {
        body.moveOutDate = changeForm.moveOutDate || changeForm.changeDate
        body.moveOutPlace = changeForm.moveOutPlace || undefined
        body.notes = changeForm.notes || undefined
      }

      const response = await fetch(`/api/persons/${selectedPerson.id}/changes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      })

      if (response.ok) {
        toast.success('Ghi nhận thay đổi nhân khẩu thành công!')
        setShowChangeModal(false)
        setSelectedPerson(null)
        fetchPersons()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi ghi nhận thay đổi')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi ghi nhận thay đổi')
    }
  }

  const filteredPersons = persons.filter(person => {
    // Filter by search term
    const searchLower = (searchTerm || '').toLowerCase()
    const matchesSearch = !searchLower || [
      person.fullName,
      person.idNumber,
      person.household?.householdId,
      person.household?.address
    ].some(value => (value || '').toLowerCase().includes(searchLower))

    if (!matchesSearch) return false

    // Filter by residence type
    if (residenceFilter === 'all') return true

    const hasActiveTemporaryResidence = person.temporaryResidences && person.temporaryResidences.length > 0
    const hasActiveTemporaryAbsence = person.temporaryAbsences && person.temporaryAbsences.length > 0

    switch (residenceFilter) {
      case 'permanent':
        // Thường trú: status ACTIVE và không có tạm trú/tạm vắng active
        return person.status === 'ACTIVE' && !hasActiveTemporaryResidence && !hasActiveTemporaryAbsence
      case 'temporary_residence':
        // Tạm trú: có temporaryResidence ACTIVE
        return hasActiveTemporaryResidence
      case 'temporary_absence':
        // Tạm vắng: có temporaryAbsence ACTIVE
        return hasActiveTemporaryAbsence
      default:
        return true
    }
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredPersons.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedPersons = filteredPersons.slice(startIndex, endIndex)

  // Reset to page 1 when search term, filter, or items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, residenceFilter, itemsPerPage])

  // Calculate statistics
  const totalPersons = persons.length
  const activePersons = persons.filter(p => p.status === 'ACTIVE').length
  const movedOutPersons = persons.filter(p => p.status === 'MOVED_OUT').length
  const deceasedPersons = persons.filter(p => p.status === 'DECEASED').length

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-1"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 animate-slideUp">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="h-8 w-8 text-navy-1" />
            Quản lý nhân khẩu
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý thông tin nhân khẩu trong hệ thống
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm nhân khẩu
        </button>
      </div>

      {/* Statistics Cards */}
      <PersonStatistics
        totalPersons={totalPersons}
        activePersons={activePersons}
        movedOutPersons={movedOutPersons}
        deceasedPersons={deceasedPersons}
      />

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        placeholder="Tìm kiếm theo tên, số CMND/CCCD, số hộ khẩu hoặc địa chỉ..."
      />

      {/* Residence Filter */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setResidenceFilter('all')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            residenceFilter === 'all'
              ? 'bg-navy-1 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Users className="h-4 w-4" />
          Tất cả
        </button>
        <button
          onClick={() => setResidenceFilter('permanent')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            residenceFilter === 'permanent'
              ? 'bg-blue-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Home className="h-4 w-4" />
          Thường trú
        </button>
        <button
          onClick={() => setResidenceFilter('temporary_residence')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            residenceFilter === 'temporary_residence'
              ? 'bg-green-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <MapPin className="h-4 w-4" />
          Đang tạm trú
        </button>
        <button
          onClick={() => setResidenceFilter('temporary_absence')}
          className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${
            residenceFilter === 'temporary_absence'
              ? 'bg-orange-500 text-white shadow-md'
              : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
          }`}
        >
          <Calendar className="h-4 w-4" />
          Tạm vắng
        </button>
      </div>

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredPersons.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Person Grid */}
      <PersonGrid
        persons={paginatedPersons}
        onEdit={openChangeModal}
        onDelete={(person) => handleDelete(person)}
        onAdd={() => setShowModal(true)}
        searchTerm={searchTerm}
      />

      {/* Add Person Modal */}
      {showModal && (
        <AddPersonModal
          formData={formData}
          setFormData={setFormData}
          onSubmit={handleSubmit}
          onClose={() => {
            setShowModal(false)
            setFormData({
              fullName: '',
              dateOfBirth: '',
              gender: 'Nam',
              idType: 'CCCD',
              idNumber: '',
              householdId: ''
            })
          }}
        />
      )}

      {/* Change Person Status Modal */}
      {showChangeModal && selectedPerson && (
        <ChangePersonModal
          person={selectedPerson}
          changeForm={changeForm}
          setChangeForm={setChangeForm}
          onSubmit={handleChangeSubmit}
          onClose={() => {
            setShowChangeModal(false)
            setSelectedPerson(null)
          }}
        />
      )}

      {/* Delete/Change Status Modal */}
      {showDeleteModal && selectedPerson && (
        <DeletePersonModal
          person={selectedPerson}
          changeForm={changeForm}
          setChangeForm={setChangeForm}
          onConfirm={handleDeleteConfirm}
          onClose={() => {
            setShowDeleteModal(false)
            setSelectedPerson(null)
          }}
        />
      )}
    </div>
  )
}
