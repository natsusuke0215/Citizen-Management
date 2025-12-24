'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Users, Calendar, CreditCard, X } from 'lucide-react'
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-bold text-gray-900">Quản lý nhân khẩu</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý thông tin nhân khẩu trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={() => setShowModal(true)}
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm nhân khẩu
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, số CMND/CCCD, số hộ khẩu hoặc địa chỉ..."
            className="input pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="mt-8 flex flex-col">
        <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Họ và tên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ngày sinh
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Giới tính
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số CMND/CCCD
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hộ khẩu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tình trạng
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPersons.map((person) => (
                    <tr key={person.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {person.fullName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.gender}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <CreditCard className="h-4 w-4 text-gray-400 mr-2" />
                          {person.idNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div>
                          <div className="font-medium">{person.household.householdId}</div>
                          <div className="text-xs text-gray-400">{person.household.address}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {person.status === 'ACTIVE' && 'Đang thường trú'}
                        {person.status === 'MOVED_OUT' && 'Đã chuyển đi'}
                        {person.status === 'DECEASED' && 'Đã qua đời'}
                        {!['ACTIVE', 'MOVED_OUT', 'DECEASED'].includes(person.status) && person.status}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => openChangeModal(person)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3"
                        >
                          <Edit className="h-4 w-4 inline-block mr-1" />
                          Thay đổi
                        </button>
                        <button
                          onClick={() => handleDelete(person.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {filteredPersons.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có nhân khẩu nào</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Không tìm thấy nhân khẩu phù hợp với từ khóa tìm kiếm.' : 'Bắt đầu bằng cách thêm nhân khẩu đầu tiên.'}
          </p>
        </div>
      )}

      {/* Add Person Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={() => setShowModal(false)} />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Thêm nhân khẩu mới
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="space-y-4">
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
                  </div>
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="btn btn-primary sm:ml-3"
                  >
                    Thêm mới
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="btn btn-secondary mt-3 sm:mt-0"
                  >
                    Hủy
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Change Person Status Modal */}
      {showChangeModal && selectedPerson && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowChangeModal(false)}
            />

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleChangeSubmit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Thay đổi nhân khẩu: {selectedPerson.fullName}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowChangeModal(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

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
                </div>

                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button type="submit" className="btn btn-primary sm:ml-3">
                    Lưu thay đổi
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowChangeModal(false)}
                    className="btn btn-secondary mt-3 sm:mt-0"
                  >
                    Hủy
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

