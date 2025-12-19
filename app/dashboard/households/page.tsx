'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, Edit, Trash2, Eye, MapPin, Users, X } from 'lucide-react'
import toast from 'react-hot-toast'

interface Person {
  id: string
  fullName: string
  dateOfBirth: string
  placeOfBirth?: string
  origin?: string
  ethnicity?: string
  gender: string
  occupation?: string
  workplace?: string
  idType?: string
  idNumber?: string
  idIssueDate?: string
  idIssuePlace?: string
  registrationDate?: string
  previousAddress?: string
  relationship?: string
}

interface Household {
  id: string
  householdId: string
  ownerName: string
  address: string
  street?: string
  ward: string
  district: string
  districtRelation: {
    id: string
    name: string
  }
  persons: Person[]
  members: Array<{
    id: string
    name: string
    email: string
  }>
  createdAt: string
}

interface District {
  id: string
  name: string
  description?: string
}

type ModalType = 'add' | 'edit' | 'view' | null

export default function HouseholdsPage() {
  const [households, setHouseholds] = useState<Household[]>([])
  const [districts, setDistricts] = useState<District[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [modalType, setModalType] = useState<ModalType>(null)
  const [selectedHousehold, setSelectedHousehold] = useState<Household | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    householdId: '',
    ownerName: '',
    address: '',
    street: '',
    ward: '',
    district: '',
    districtId: ''
  })

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
      districtId: ''
    })
    setSelectedHousehold(null)
    setModalType('add')
  }

  const handleView = (household: Household) => {
    setSelectedHousehold(household)
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
      districtId: household.districtRelation.id
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
    
    try {
      const url = modalType === 'add' 
        ? '/api/households' 
        : `/api/households/${selectedHousehold?.id}`
      
      const method = modalType === 'add' ? 'POST' : 'PUT'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        toast.success(modalType === 'add' ? 'Thêm hộ khẩu thành công!' : 'Cập nhật hộ khẩu thành công!')
        setModalType(null)
        setSelectedHousehold(null)
        fetchHouseholds()
      } else {
        const data = await response.json()
        toast.error(data.message || 'Có lỗi xảy ra')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra')
    }
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
          <h1 className="text-2xl font-bold text-gray-900">Quản lý hộ khẩu</h1>
          <p className="mt-2 text-sm text-gray-700">
            Quản lý thông tin hộ khẩu và thành viên trong hệ thống
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <button
            onClick={handleAdd}
            className="btn btn-primary inline-flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm hộ khẩu
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
            placeholder="Tìm kiếm theo số hộ khẩu, chủ hộ, địa chỉ..."
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
                      Số hộ khẩu
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Chủ hộ
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Số thành viên
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Địa chỉ
                    </th>
                    <th className="relative px-6 py-3">
                      <span className="sr-only">Thao tác</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredHouseholds.map((household) => {
                    const owner = getOwner(household)
                    const fullAddress = [
                      household.address,
                      household.street,
                      household.ward,
                      household.district,
                      household.districtRelation.name
                    ].filter(Boolean).join(', ')
                    
                    return (
                      <tr key={household.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {household.householdId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {owner ? owner.fullName : household.ownerName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex items-center">
                            <Users className="h-4 w-4 text-gray-400 mr-2" />
                            {household.persons.length} thành viên
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500">
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 text-gray-400 mr-2 flex-shrink-0" />
                            <span>{fullAddress}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center justify-end space-x-2">
                            <button
                              onClick={() => handleView(household)}
                              className="text-primary-600 hover:text-primary-900"
                              title="Xem chi tiết"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleEdit(household)}
                              className="text-indigo-600 hover:text-indigo-900"
                              title="Chỉnh sửa"
                            >
                              <Edit className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(household.id)}
                              className="text-red-600 hover:text-red-900"
                              title="Xóa"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {filteredHouseholds.length === 0 && (
        <div className="text-center py-12">
          <Users className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Không có hộ khẩu nào</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm ? 'Không tìm thấy hộ khẩu phù hợp với từ khóa tìm kiếm.' : 'Bắt đầu bằng cách thêm hộ khẩu đầu tiên.'}
          </p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {(modalType === 'add' || modalType === 'edit') && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                {modalType === 'add' ? 'Thêm hộ khẩu mới' : 'Chỉnh sửa hộ khẩu'}
              </h3>
              <button
                onClick={() => {
                  setModalType(null)
                  setSelectedHousehold(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số hộ khẩu <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={formData.householdId}
                    onChange={(e) => setFormData({ ...formData, householdId: e.target.value })}
                    placeholder="HK001"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Họ tên chủ hộ <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={formData.ownerName}
                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                    placeholder="Nguyễn Văn A"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số nhà <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="123"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Đường phố (ấp)
                  </label>
                  <input
                    type="text"
                    className="input w-full"
                    value={formData.street}
                    onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                    placeholder="Đường ABC"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phường (xã, thị trấn) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={formData.ward}
                    onChange={(e) => setFormData({ ...formData, ward: e.target.value })}
                    placeholder="Phường 1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Quận (huyện) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input w-full"
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Quận 1"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Khu phố <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    className="input w-full"
                    value={formData.districtId}
                    onChange={(e) => setFormData({ ...formData, districtId: e.target.value })}
                  >
                    <option value="">Chọn khu phố</option>
                    {districts.map((district) => (
                      <option key={district.id} value={district.id}>
                        {district.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setModalType(null)
                    setSelectedHousehold(null)
                  }}
                  className="btn btn-secondary"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                >
                  {modalType === 'add' ? 'Thêm' : 'Cập nhật'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* View Modal */}
      {modalType === 'view' && selectedHousehold && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Chi tiết hộ khẩu: {selectedHousehold.householdId}
              </h3>
              <button
                onClick={() => {
                  setModalType(null)
                  setSelectedHousehold(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {/* Household Info */}
            <div className="mb-6">
              <h4 className="text-md font-semibold text-gray-900 mb-3">Thông tin hộ khẩu</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-700">Số hộ khẩu:</span>
                    <span className="ml-2 text-sm text-gray-900">{selectedHousehold.householdId}</span>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-700">Địa chỉ:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {[
                        selectedHousehold.address,
                        selectedHousehold.street,
                        selectedHousehold.ward,
                        selectedHousehold.district,
                        selectedHousehold.districtRelation.name
                      ].filter(Boolean).join(', ')}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            {(() => {
              const owner = getOwner(selectedHousehold)
              if (!owner) return null
              
              return (
                <div className="mb-6">
                  <h4 className="text-md font-semibold text-gray-900 mb-3">Thông tin chủ hộ</h4>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <span className="text-sm font-medium text-gray-700">Họ và tên:</span>
                        <span className="ml-2 text-sm text-gray-900">{owner.fullName}</span>
                      </div>
                      <div>
                        <span className="text-sm font-medium text-gray-700">Ngày sinh:</span>
                        <span className="ml-2 text-sm text-gray-900">
                          {new Date(owner.dateOfBirth).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                      {owner.placeOfBirth && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Nơi sinh:</span>
                          <span className="ml-2 text-sm text-gray-900">{owner.placeOfBirth}</span>
                        </div>
                      )}
                      {owner.origin && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Nguyên quán:</span>
                          <span className="ml-2 text-sm text-gray-900">{owner.origin}</span>
                        </div>
                      )}
                      {owner.ethnicity && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Dân tộc:</span>
                          <span className="ml-2 text-sm text-gray-900">{owner.ethnicity}</span>
                        </div>
                      )}
                      <div>
                        <span className="text-sm font-medium text-gray-700">Giới tính:</span>
                        <span className="ml-2 text-sm text-gray-900">{owner.gender}</span>
                      </div>
                      {owner.occupation && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Nghề nghiệp:</span>
                          <span className="ml-2 text-sm text-gray-900">{owner.occupation}</span>
                        </div>
                      )}
                      {owner.workplace && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Nơi làm việc:</span>
                          <span className="ml-2 text-sm text-gray-900">{owner.workplace}</span>
                        </div>
                      )}
                      {owner.idNumber && (
                        <>
                          <div>
                            <span className="text-sm font-medium text-gray-700">Số {owner.idType || 'CMND/CCCD'}:</span>
                            <span className="ml-2 text-sm text-gray-900">{owner.idNumber}</span>
                          </div>
                          {owner.idIssueDate && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Ngày cấp:</span>
                              <span className="ml-2 text-sm text-gray-900">
                                {new Date(owner.idIssueDate).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          )}
                          {owner.idIssuePlace && (
                            <div>
                              <span className="text-sm font-medium text-gray-700">Nơi cấp:</span>
                              <span className="ml-2 text-sm text-gray-900">{owner.idIssuePlace}</span>
                            </div>
                          )}
                        </>
                      )}
                      {owner.registrationDate && (
                        <div>
                          <span className="text-sm font-medium text-gray-700">Ngày đăng ký thường trú:</span>
                          <span className="ml-2 text-sm text-gray-900">
                            {new Date(owner.registrationDate).toLocaleDateString('vi-VN')}
                          </span>
                        </div>
                      )}
                      {owner.previousAddress && (
                        <div className="md:col-span-2">
                          <span className="text-sm font-medium text-gray-700">Địa chỉ thường trú trước khi chuyển đến:</span>
                          <span className="ml-2 text-sm text-gray-900">{owner.previousAddress}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })()}

            {/* Members Info */}
            {(() => {
              const owner = getOwner(selectedHousehold)
              const otherMembers = selectedHousehold.persons.filter(p => {
                if (!p.relationship) return false // Skip owner
                if (owner && p.id === owner.id) return false // Skip if already shown as owner
                return true
              })
              
              if (otherMembers.length === 0) return null
              
              return (
                <div>
                  <h4 className="text-md font-semibold text-gray-900 mb-3">
                    Thành viên khác trong hộ ({otherMembers.length} người)
                  </h4>
                  <div className="space-y-4">
                    {otherMembers.map((person, index) => (
                      <div key={person.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="text-sm font-semibold text-gray-900">
                            {index + 1}. {person.fullName}
                          </h5>
                          {person.relationship && (
                            <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                              {person.relationship}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                          <div>
                            <span className="text-gray-700">Ngày sinh:</span>
                            <span className="ml-2 text-gray-900">
                              {new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}
                            </span>
                          </div>
                          {person.placeOfBirth && (
                            <div>
                              <span className="text-gray-700">Nơi sinh:</span>
                              <span className="ml-2 text-gray-900">{person.placeOfBirth}</span>
                            </div>
                          )}
                          {person.origin && (
                            <div>
                              <span className="text-gray-700">Nguyên quán:</span>
                              <span className="ml-2 text-gray-900">{person.origin}</span>
                            </div>
                          )}
                          {person.ethnicity && (
                            <div>
                              <span className="text-gray-700">Dân tộc:</span>
                              <span className="ml-2 text-gray-900">{person.ethnicity}</span>
                            </div>
                          )}
                          <div>
                            <span className="text-gray-700">Giới tính:</span>
                            <span className="ml-2 text-gray-900">{person.gender}</span>
                          </div>
                          {person.occupation && (
                            <div>
                              <span className="text-gray-700">Nghề nghiệp:</span>
                              <span className="ml-2 text-gray-900">{person.occupation}</span>
                            </div>
                          )}
                          {person.workplace && (
                            <div>
                              <span className="text-gray-700">Nơi làm việc:</span>
                              <span className="ml-2 text-gray-900">{person.workplace}</span>
                            </div>
                          )}
                          {person.idNumber && (
                            <>
                              <div>
                                <span className="text-gray-700">Số {person.idType || 'CMND/CCCD'}:</span>
                                <span className="ml-2 text-gray-900">{person.idNumber}</span>
                              </div>
                              {person.idIssueDate && (
                                <div>
                                  <span className="text-gray-700">Ngày cấp:</span>
                                  <span className="ml-2 text-gray-900">
                                    {new Date(person.idIssueDate).toLocaleDateString('vi-VN')}
                                  </span>
                                </div>
                              )}
                              {person.idIssuePlace && (
                                <div>
                                  <span className="text-gray-700">Nơi cấp:</span>
                                  <span className="ml-2 text-gray-900">{person.idIssuePlace}</span>
                                </div>
                              )}
                            </>
                          )}
                          {person.registrationDate && (
                            <div>
                              <span className="text-gray-700">Ngày đăng ký thường trú:</span>
                              <span className="ml-2 text-gray-900">
                                {new Date(person.registrationDate).toLocaleDateString('vi-VN')}
                              </span>
                            </div>
                          )}
                          {person.previousAddress && (
                            <div className="md:col-span-2">
                              <span className="text-gray-700">Địa chỉ thường trú trước khi chuyển đến:</span>
                              <span className="ml-2 text-gray-900">{person.previousAddress}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })()}
            
            <div className="flex justify-end mt-6">
              <button
                onClick={() => {
                  setModalType(null)
                  setSelectedHousehold(null)
                }}
                className="btn btn-secondary"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
