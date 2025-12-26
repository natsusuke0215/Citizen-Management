'use client'

import { X } from 'lucide-react'
import { Household, Person } from '../types'

interface SplitFormData {
  newHouseholdId: string
  ownerName: string
  address: string
  street: string
  ward: string
  district: string
  splitReason: string
  splitDate: string
}

interface SplitModalProps {
  household: Household
  splitFormData: SplitFormData
  setSplitFormData: (data: SplitFormData) => void
  selectedPersons: Set<string>
  personRelationships: Record<string, string>
  togglePersonSelection: (personId: string) => void
  setPersonRelationships: (relationships: Record<string, string>) => void
  getOwner: (household: Household) => Person | null
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export default function SplitModal({
  household,
  splitFormData,
  setSplitFormData,
  selectedPersons,
  personRelationships,
  togglePersonSelection,
  setPersonRelationships,
  getOwner,
  onSubmit,
  onClose
}: SplitModalProps) {
  const owner = getOwner(household)

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Tách hộ khẩu: {household.householdId}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        <form onSubmit={onSubmit} className="space-y-6">
          {/* Mã hộ khẩu gốc */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Mã hộ khẩu/Số sổ hộ gốc
            </label>
            <input
              type="text"
              disabled
              className="input w-full bg-gray-100"
              value={household.householdId}
            />
          </div>

          {/* Danh sách thành viên tách đi */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">
              Danh sách thành viên tách đi <span className="text-red-500">*</span>
            </h4>
            <div className="space-y-3 max-h-64 overflow-y-auto border border-gray-200 rounded-lg p-4">
              {household.persons.map((person) => {
                const isSelected = selectedPersons.has(person.id)
                const isOwner = owner && person.id === owner.id

                return (
                  <div key={person.id} className="flex items-start gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => togglePersonSelection(person.id)}
                      disabled={!!isOwner}
                      className="mt-1"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-900">{person.fullName}</span>
                        {isOwner && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            Chủ hộ
                          </span>
                        )}
                        {person.relationship && (
                          <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">
                            {person.relationship}
                          </span>
                        )}
                      </div>
                      {isSelected && (
                        <div className="mt-2">
                          <label className="block text-xs font-medium text-gray-700 mb-1">
                            Quan hệ với chủ hộ mới <span className="text-red-500">*</span>
                          </label>
                          <select
                            required
                            className="input w-full text-sm"
                            value={personRelationships[person.id] || ''}
                            onChange={(e) => setPersonRelationships({
                              ...personRelationships,
                              [person.id]: e.target.value
                            })}
                          >
                            <option value="">Chọn quan hệ</option>
                            <option value="Chủ hộ">Chủ hộ</option>
                            <option value="Vợ/Chồng">Vợ/Chồng</option>
                            <option value="Con">Con</option>
                            <option value="Cha/Mẹ">Cha/Mẹ</option>
                            <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                            <option value="Khác">Khác</option>
                          </select>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
            {selectedPersons.size === 0 && (
              <p className="text-sm text-red-500 mt-2">Vui lòng chọn ít nhất một thành viên</p>
            )}
          </div>

          {/* Thông tin hộ khẩu mới */}
          <div>
            <h4 className="text-md font-semibold text-gray-900 mb-4">Thông tin hộ khẩu mới</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Mã hộ khẩu mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input w-full"
                  value={splitFormData.newHouseholdId}
                  onChange={(e) => setSplitFormData({ ...splitFormData, newHouseholdId: e.target.value })}
                  placeholder="HK002"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Họ và tên chủ hộ mới <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  className="input w-full"
                  value={splitFormData.ownerName}
                  onChange={(e) => setSplitFormData({ ...splitFormData, ownerName: e.target.value })}
                  placeholder="Nguyễn Văn B"
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
                  value={splitFormData.address}
                  onChange={(e) => setSplitFormData({ ...splitFormData, address: e.target.value })}
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
                  value={splitFormData.street}
                  onChange={(e) => setSplitFormData({ ...splitFormData, street: e.target.value })}
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
                  value={splitFormData.ward}
                  onChange={(e) => setSplitFormData({ ...splitFormData, ward: e.target.value })}
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
                  value={splitFormData.district}
                  onChange={(e) => setSplitFormData({ ...splitFormData, district: e.target.value })}
                  placeholder="Quận 1"
                />
              </div>
            </div>
          </div>

          {/* Lý do tách hộ và ngày tách hộ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Lý do tách hộ
              </label>
              <textarea
                className="input w-full"
                rows={3}
                value={splitFormData.splitReason}
                onChange={(e) => setSplitFormData({ ...splitFormData, splitReason: e.target.value })}
                placeholder="Nhập lý do tách hộ..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ngày tách hộ <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                className="input w-full"
                value={splitFormData.splitDate}
                onChange={(e) => setSplitFormData({ ...splitFormData, splitDate: e.target.value })}
              />
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-secondary"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={selectedPersons.size === 0}
            >
              Xác nhận tách hộ
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

