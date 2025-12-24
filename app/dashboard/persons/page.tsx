'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Users, Calendar, CreditCard, X, UserPlus, TrendingUp, Home, Sparkles, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'

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
  createdAt: string
}

export default function PersonsPage() {
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
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
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null)
  const [changeForm, setChangeForm] = useState({
    changeType: 'MOVE_OUT' as 'MOVE_OUT' | 'DECEASED',
    changeDate: new Date().toISOString().split('T')[0],
    moveOutDate: '',
    moveOutPlace: '',
    notes: ''
  })

  useEffect(() => {
    fetchPersons()
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

  const handleDelete = async (id: string) => {
    if (!confirm('Bạn có chắc chắn muốn xóa nhân khẩu này?')) return

    try {
      const response = await fetch(`/api/persons/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Xóa nhân khẩu thành công!')
        fetchPersons()
      } else {
        toast.error('Có lỗi xảy ra khi xóa nhân khẩu')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi xóa nhân khẩu')
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
    const searchLower = (searchTerm || '').toLowerCase()

    const valuesToSearch = [
      person.fullName,
      person.idNumber,
      person.household?.householdId,
      person.household?.address
    ]

    return valuesToSearch.some(value =>
      (value || '').toLowerCase().includes(searchLower)
    )
  })

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
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="group relative overflow-hidden bg-gradient-to-br from-navy-1 to-navy-2 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <Users className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{totalPersons}</div>
            <div className="text-sm opacity-90">Tổng số nhân khẩu</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-emerald-400 to-emerald-500 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <UserPlus className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{activePersons}</div>
            <div className="text-sm opacity-90">Đang thường trú</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-amber-400 to-amber-500 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <TrendingUp className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{movedOutPersons}</div>
            <div className="text-sm opacity-90">Đã chuyển đi</div>
          </div>
        </div>

        <div className="group relative overflow-hidden bg-gradient-to-br from-gray-400 to-gray-500 rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-10 rounded-full -mr-12 -mt-12"></div>
          <div className="p-5 text-white relative">
            <div className="flex items-center justify-between mb-3">
              <div className="p-2.5 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <AlertCircle className="h-6 w-6" />
              </div>
            </div>
            <div className="text-3xl font-bold mb-1">{deceasedPersons}</div>
            <div className="text-sm opacity-90">Đã qua đời</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white rounded-[15px] shadow-drop p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, số CMND/CCCD, số hộ khẩu hoặc địa chỉ..."
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-[8px] bg-gray-50 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-navy-1 focus:border-transparent transition-all duration-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Person Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPersons.map((person) => {
          const getStatusInfo = () => {
            switch (person.status) {
              case 'ACTIVE':
                return { label: 'Đang thường trú', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: '✓' }
              case 'MOVED_OUT':
                return { label: 'Đã chuyển đi', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: '→' }
              case 'DECEASED':
                return { label: 'Đã qua đời', color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '✕' }
              default:
                return { label: person.status, color: 'bg-gray-50 text-gray-700 border-gray-200', icon: '•' }
            }
          }
          const statusInfo = getStatusInfo()
          
          return (
            <div
              key={person.id}
              className="group bg-white rounded-[15px] shadow-drop hover:shadow-drop-lg transition-all duration-300 transform hover:-translate-y-2 border border-gray-100 overflow-hidden"
            >
              {/* Card Header */}
              <div className="bg-gradient-to-r from-navy-1 to-navy-2 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                      <Users className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="font-bold text-lg">{person.fullName}</div>
                      <div className="text-xs opacity-90">{person.gender}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openChangeModal(person)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
                      title="Thay đổi"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(person.id)}
                      className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
                      title="Xóa"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-5 space-y-4">
                <div className="flex items-center gap-3 p-3 bg-yellow-2 rounded-[8px]">
                  <div className="p-2 bg-yellow-1 rounded-[6px]">
                    <Calendar className="h-4 w-4 text-navy-1" />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Ngày sinh</div>
                    <div className="text-sm font-semibold text-navy-1">
                      {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
                    </div>
                  </div>
                </div>

                {person.idNumber && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-[8px]">
                    <div className="p-2 bg-gray-200 rounded-[6px]">
                      <CreditCard className="h-4 w-4 text-gray-600" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-gray-600 uppercase tracking-wide">CMND/CCCD</div>
                      <div className="text-sm font-semibold text-gray-900">{person.idNumber}</div>
                    </div>
                  </div>
                )}

                <div>
                  <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1 flex items-center gap-1">
                    <Home className="h-3 w-3" />
                    Hộ khẩu
                  </div>
                  <div className="text-sm font-semibold text-gray-900">{person.household.householdId}</div>
                  <div className="text-xs text-gray-600 mt-1">{person.household.address}</div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold ${statusInfo.color}`}>
                    <span>{statusInfo.icon}</span>
                    <span>{statusInfo.label}</span>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {filteredPersons.length === 0 && (
        <div className="text-center py-16 bg-white rounded-[15px] shadow-drop">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-gradient-to-br from-navy-1 to-navy-2 opacity-10 rounded-full blur-2xl"></div>
            <Users className="h-16 w-16 text-gray-400 mx-auto relative" />
          </div>
          <h3 className="mt-4 text-lg font-semibold text-gray-900">Không có nhân khẩu nào</h3>
          <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto">
            {searchTerm ? 'Không tìm thấy nhân khẩu phù hợp với từ khóa tìm kiếm.' : 'Bắt đầu bằng cách thêm nhân khẩu đầu tiên.'}
          </p>
          {!searchTerm && (
            <button
              onClick={() => setShowModal(true)}
              className="mt-6 inline-flex items-center px-6 py-3 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4 mr-2" />
              Thêm nhân khẩu đầu tiên
            </button>
          )}
        </div>
      )}

      {/* Add Person Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center py-8 px-4">
          <div className="relative w-full max-w-2xl bg-white rounded-[15px] shadow-drop-lg border border-gray-200 my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-navy-1 to-navy-2 p-6 rounded-t-[15px] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                    <UserPlus className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">
                    Thêm nhân khẩu mới
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Họ và tên *
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 input"
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        placeholder="Nguyễn Văn A"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Ngày sinh *
                        </label>
                        <input
                          type="date"
                          required
                          className="mt-1 input"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Giới tính *
                        </label>
                        <select
                          className="mt-1 input"
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        >
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Loại giấy tờ
                        </label>
                        <select
                          className="mt-1 input"
                          value={formData.idType}
                          onChange={(e) => setFormData({ ...formData, idType: e.target.value })}
                        >
                          <option value="CCCD">CCCD</option>
                          <option value="CMND">CMND</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Số CCCD/CMND
                        </label>
                        <input
                          type="text"
                          className="mt-1 input"
                          value={formData.idNumber}
                          onChange={(e) => setFormData({ ...formData, idNumber: e.target.value })}
                          placeholder="0123456789"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        ID hộ khẩu *
                      </label>
                      <input
                        type="text"
                        required
                        className="mt-1 input"
                        value={formData.householdId}
                        onChange={(e) => setFormData({ ...formData, householdId: e.target.value })}
                        placeholder="Nhập ID hộ khẩu (khóa kỹ thuật)"
                      />
                    </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Thêm mới
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Person Status Modal */}
      {showChangeModal && selectedPerson && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center py-8 px-4">
          <div className="relative w-full max-w-2xl bg-white rounded-[15px] shadow-drop-lg border border-gray-200 my-8">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-navy-1 to-navy-2 p-6 rounded-t-[15px] text-white">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                    <Edit className="h-6 w-6" />
                  </div>
                  <h3 className="text-xl font-bold">
                    Thay đổi nhân khẩu: {selectedPerson.fullName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowChangeModal(false)}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
              <form onSubmit={handleChangeSubmit} className="space-y-6">

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Loại thay đổi
                      </label>
                      <select
                        className="input"
                        value={changeForm.changeType}
                        onChange={(e) =>
                          setChangeForm({
                            ...changeForm,
                            changeType: e.target.value as 'MOVE_OUT' | 'DECEASED'
                          })
                        }
                      >
                        <option value="MOVE_OUT">Chuyển đi nơi khác</option>
                        <option value="DECEASED">Nhân khẩu qua đời</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Ngày thay đổi
                      </label>
                      <input
                        type="date"
                        className="input"
                        value={changeForm.changeDate}
                        onChange={(e) => setChangeForm({ ...changeForm, changeDate: e.target.value })}
                        required
                      />
                    </div>

                    {changeForm.changeType === 'MOVE_OUT' && (
                      <>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ngày chuyển đi
                          </label>
                          <input
                            type="date"
                            className="input"
                            value={changeForm.moveOutDate}
                            onChange={(e) =>
                              setChangeForm({ ...changeForm, moveOutDate: e.target.value })
                            }
                            placeholder="Nếu bỏ trống sẽ dùng Ngày thay đổi"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nơi chuyển đến
                          </label>
                          <input
                            type="text"
                            className="input"
                            value={changeForm.moveOutPlace}
                            onChange={(e) =>
                              setChangeForm({ ...changeForm, moveOutPlace: e.target.value })
                            }
                            placeholder="Nhập địa chỉ nơi chuyển đến"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Ghi chú
                          </label>
                          <textarea
                            className="input"
                            rows={2}
                            value={changeForm.notes}
                            onChange={(e) =>
                              setChangeForm({ ...changeForm, notes: e.target.value })
                            }
                            placeholder="Ví dụ: chuyển đi theo hộ khẩu khác..."
                          />
                        </div>
                      </>
                    )}

                    {changeForm.changeType === 'DECEASED' && (
                      <p className="text-xs text-gray-500">
                        Khi lưu, hệ thống sẽ cập nhật tình trạng thành <strong>Đã qua đời</strong> và
                        tự động ghi chú là <strong>“Đã qua đời”</strong>.
                      </p>
                    )}
                  </div>

                <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowChangeModal(false)}
                    className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all duration-200"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

