'use client'

import { useState, useEffect } from 'react'
import { Plus, Home } from 'lucide-react'
import toast from 'react-hot-toast'
import { Household, District, Person } from './shared/types'
import StatisticsCards from './shared/components/StatisticsCards'
import SearchBar from './shared/components/SearchBar'
import PaginationControls from './shared/components/PaginationControls'
import HouseholdGrid from './shared/components/HouseholdGrid'
import AddEditModal from './shared/components/AddEditModal'
import ViewModal from './shared/components/ViewModal'
import SplitModal from './shared/components/SplitModal'

type ModalType = 'add' | 'edit' | 'view' | 'split' | null

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

export default function HouseholdsPage() {
  const [households, setHouseholds] = useState<Household[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalType, setModalType] = useState<ModalType>(null)
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  
  // Split household form state
  const [splitFormData, setSplitFormData] = useState({
    newHouseholdId: '',
    ownerName: '',
    address: '',
    street: '',
    ward: '',
    district: '',
    splitReason: '',
    splitDate: new Date().toISOString().split('T')[0]
  })
  const [selectedPersons, setSelectedPersons] = useState<Set<string>>(new Set())
  const [personRelationships, setPersonRelationships] = useState<Record<string, string>>({})
  
  // Form state
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
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(30)
  
  // Members form state
  const [memberCount, setMemberCount] = useState(1)
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

  useEffect(() => {
    fetchHouseholds()
    fetchDistricts()
  }, [])

  const fetchHouseholds = async () => {
    try {
      const response = await fetch('/api/households')
      if (response.ok) {
        const data = await response.json()
        setHouseholds(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách hộ khẩu')
    } finally {
      setLoading(false)
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

  const handleAdd = () => {
    setFormData({
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
    setMemberCount(1)
    setMembers([{
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
    setSelectedHousehold(null)
    setModalType('add')
  }

  const handleView = async (household: Household) => {
    try {
      // Fetch full household details with all members from API
      const response = await fetch(`/api/households/${household.id}`)
      if (response.ok) {
        const fullHouseholdData = await response.json()
        setSelectedHousehold(fullHouseholdData)
      } else {
        // Fallback to the household from list if API fails
        setSelectedHousehold(household)
      }
    } catch (error) {
      console.error('Error fetching household details:', error)
      // Fallback to the household from list if API fails
      setSelectedHousehold(household)
    }
    setModalType('view')
  }

  const handleEdit = (household: Household) => {
    setFormData({
      householdId: household.householdId,
      ownerName: household.ownerName,
      address: household.address,
      street: household.street || '',
      ward: household.ward,
      district: household.district,
      districtId: household.districtRelation.id,
      householdType: (household as any).householdType || '',
      issueDate: (household as any).issueDate ? new Date((household as any).issueDate).toISOString().split('T')[0] : ''
    })
    setSelectedHousehold(household)
    setModalType('edit')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa hộ khẩu này?')) return

    try {
      const response = await fetch(`/api/households/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Xóa hộ khẩu thành công!')
        fetchHouseholds()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi xóa hộ khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa hộ khẩu')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validate form data before submitting
    if (modalType === 'add') {
      if (!formData.householdId || !formData.ownerName || !formData.address || 
          !formData.ward || !formData.district || !formData.districtId || 
          !formData.householdType || !formData.issueDate) {
        toast.error('Vui lòng điền đầy đủ thông tin hộ khẩu')
        return
      }
      
      const validMembers = members.filter(m => m.fullName.trim() !== '')
      if (validMembers.length === 0) {
        toast.error('Vui lòng thêm ít nhất một thành viên')
        return
      }
      
      // Validate each member
      for (let i = 0; i < validMembers.length; i++) {
        const member = validMembers[i]
        if (!member.dateOfBirth) {
          toast.error(`Thành viên ${i + 1}: Vui lòng chọn ngày sinh`)
          return
        }
        if (!member.gender) {
          toast.error(`Thành viên ${i + 1}: Vui lòng chọn giới tính`)
          return
        }
        if (!member.relationship) {
          toast.error(`Thành viên ${i + 1}: Vui lòng chọn quan hệ với chủ hộ`)
          return
        }
      }
    }
    
    try {
      const url = modalType === 'add' 
        ? '/api/households' 
        : `/api/households/${selectedHousehold?.id}`
      
      const method = modalType === 'add' ? 'POST' : 'PUT'
      
      const payload = modalType === 'add' 
        ? { ...formData, members: members.filter(m => m.fullName.trim() !== '') }
        : formData
      
      console.log('Submitting payload:', payload)
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })

      if (response.ok) {
        toast.success(modalType === 'add' ? 'Thêm hộ khẩu thành công!' : 'Cập nhật hộ khẩu thành công!')
        setModalType(null)
        setSelectedHousehold(null)
        fetchHouseholds()
      } else {
        const data = await response.json()
        console.error('Error response:', data)
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Có lỗi xảy ra khi kết nối đến server')
    }
  }

  const handleMemberCountChange = (count: number) => {
    setMemberCount(count)
    const newMembers = [...members]
    
    if (count > members.length) {
      // Thêm thành viên mới
      for (let i = members.length; i < count; i++) {
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
    } else {
      // Xóa thành viên
      newMembers.splice(count)
    }
    
    setMembers(newMembers)
  }

  const updateMember = (index: number, field: string, value: string) => {
    const newMembers = [...members]
    newMembers[index] = { ...newMembers[index], [field]: value }
    setMembers(newMembers)
  }

  const handleSplitSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!selectedHousehold) return

    if (selectedPersons.size === 0) {
      toast.error('Vui lòng chọn ít nhất một thành viên để tách')
      return
    }

    if (!splitFormData.newHouseholdId || !splitFormData.ownerName || !splitFormData.address || 
        !splitFormData.ward || !splitFormData.district) {
      toast.error('Vui lòng điền đầy đủ thông tin hộ khẩu mới')
      return
    }

    try {
      const personIds = Array.from(selectedPersons)
      
      const response = await fetch(`/api/households/${selectedHousehold.id}/split`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newHouseholdId: splitFormData.newHouseholdId,
          ownerName: splitFormData.ownerName,
          address: splitFormData.address,
          street: splitFormData.street,
          ward: splitFormData.ward,
          district: splitFormData.district,
          personIds: personIds,
          personRelationships: personRelationships,
          splitReason: splitFormData.splitReason,
          splitDate: splitFormData.splitDate
        })
      })

      if (response.ok) {
        toast.success('Tách hộ khẩu thành công!')
        setModalType(null)
        setSelectedHousehold(null)
        fetchHouseholds()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra khi tách hộ khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tách hộ khẩu')
    }
  }

  const togglePersonSelection = (personId: string) => {
    const newSelected = new Set(selectedPersons)
    if (newSelected.has(personId)) {
      newSelected.delete(personId)
      const newRelationships = { ...personRelationships }
      delete newRelationships[personId]
      setPersonRelationships(newRelationships)
    } else {
      newSelected.add(personId)
    }
    setSelectedPersons(newSelected)
  }

  const getOwner = (household: Household): Person | null => {
    // Tìm chủ hộ (relationship = null hoặc không có)
    const owner = household.persons.find(p => !p.relationship)
    if (owner) return owner
    
    // Nếu không tìm thấy, tìm theo ownerName
    return household.persons.find(p => 
      p.fullName.toLowerCase() === household.ownerName.toLowerCase()
    ) || null
  }

  const filteredHouseholds = households.filter(household => {
    const owner = getOwner(household)
    const searchLower = (searchTerm || '').toLowerCase()

    const valuesToSearch = [
      household.householdId,
      household.ownerName,
      owner?.fullName,
      household.address,
      household.street,
      household.ward,
      household.district,
      household.districtRelation?.name
    ]

    return valuesToSearch.some(value =>
      (value || '').toLowerCase().includes(searchLower)
    )
  })

  // Pagination calculations
  const totalPages = Math.ceil(filteredHouseholds.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const paginatedHouseholds = filteredHouseholds.slice(startIndex, endIndex)

  // Reset to page 1 when search term or items per page changes
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, itemsPerPage])

  // Calculate statistics
  const totalHouseholds = households.length
  const totalMembers = households.reduce((sum, h) => sum + h.persons.length, 0)
  const avgMembersPerHousehold = totalHouseholds > 0 ? (totalMembers / totalHouseholds).toFixed(1) : '0'

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
            <Home className="h-8 w-8 text-navy-1" />
            Quản lý hộ khẩu
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Quản lý thông tin hộ khẩu và thành viên trong hệ thống
          </p>
        </div>
        <button
          onClick={handleAdd}
          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
        >
          <Plus className="h-4 w-4 mr-2" />
          Thêm hộ khẩu
        </button>
      </div>

      {/* Statistics Cards */}
      <StatisticsCards
        totalHouseholds={totalHouseholds}
        totalMembers={totalMembers}
        avgMembersPerHousehold={avgMembersPerHousehold}
      />

      {/* Search */}
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Pagination Controls */}
      <PaginationControls
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={filteredHouseholds.length}
        onPageChange={setCurrentPage}
        onItemsPerPageChange={setItemsPerPage}
      />

      {/* Household Grid */}
      <HouseholdGrid
        households={paginatedHouseholds}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onAdd={handleAdd}
        getOwner={getOwner}
        searchTerm={searchTerm}
      />

      {/* Add/Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <AddEditModal
          modalType={modalType}
          formData={formData}
          setFormData={setFormData}
          districts={districts}
          members={members}
          memberCount={memberCount}
          onMemberCountChange={handleMemberCountChange}
          onUpdateMember={updateMember}
          onSubmit={handleSubmit}
          onClose={() => {
            setModalType(null)
            setSelectedHousehold(null)
          }}
        />
      )}

      {/* View Modal */}
      {modalType === 'view' && selectedHousehold && (
        <ViewModal
          household={selectedHousehold}
          getOwner={getOwner}
          onClose={() => {
            setModalType(null)
            setSelectedHousehold(null)
          }}
          onSplit={() => {
            if (selectedHousehold) {
              setSplitFormData({
                newHouseholdId: '',
                ownerName: '',
                address: selectedHousehold.address,
                street: selectedHousehold.street || '',
                ward: selectedHousehold.ward,
                district: selectedHousehold.district,
                splitReason: '',
                splitDate: new Date().toISOString().split('T')[0]
              })
              setSelectedPersons(new Set())
              setPersonRelationships({})
              setModalType('split')
              
              // Tự động tìm và điền số hộ khẩu mới
              const fetchNextHouseholdId = async () => {
                try {
                  const response = await fetch('/api/households/next-id', {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ oldHouseholdId: selectedHousehold.householdId })
                  })

                  if (response.ok) {
                    const data = await response.json()
                    setSplitFormData(prev => ({
                      ...prev,
                      newHouseholdId: data.newHouseholdId
                    }))
                  } else {
                    console.error('Không thể tìm số hộ khẩu mới')
                  }
                } catch (error) {
                  console.error('Lỗi khi tìm số hộ khẩu mới:', error)
                }
              }

              fetchNextHouseholdId()
            }
          }}
        />
      )}

      {/* Split Household Modal */}
      {modalType === 'split' && selectedHousehold && (
        <SplitModal
          household={selectedHousehold}
          splitFormData={splitFormData}
          setSplitFormData={setSplitFormData}
          selectedPersons={selectedPersons}
          personRelationships={personRelationships}
          togglePersonSelection={togglePersonSelection}
          setPersonRelationships={setPersonRelationships}
          getOwner={getOwner}
          onSubmit={handleSplitSubmit}
          onClose={() => {
            setModalType('view')
          }}
        />
      )}
    </div>
  )
}
