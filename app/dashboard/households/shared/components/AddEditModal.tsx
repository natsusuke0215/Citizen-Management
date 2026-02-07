'use client'

import { Plus, Edit, X, Building2, Users } from 'lucide-react'
import { District } from '../types'
import HouseholdFormFields from './HouseholdFormFields'

interface HouseholdFormData {
  householdId: string
  ownerName: string
  address: string
  street: string
  ward: string
  district: string
  districtId: string
  householdType: string
  issueDate: string
}

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

interface AddEditModalProps {
  modalType: 'add' | 'edit'
  formData: HouseholdFormData
  setFormData: (data: HouseholdFormData) => void
  districts: District[]
  members: Member[]
  memberCount: number
  onMemberCountChange: (count: number) => void
  onUpdateMember: (index: number, field: string, value: string) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export default function AddEditModal({
  modalType,
  formData,
  setFormData,
  districts,
  members,
  memberCount,
  onMemberCountChange,
  onUpdateMember,
  onSubmit,
  onClose
}: AddEditModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center py-8 px-4">
      <div className="relative w-full max-w-4xl bg-white rounded-[15px] shadow-drop-lg border border-gray-200 my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-navy-1 to-navy-2 p-6 rounded-t-[15px] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                {modalType === 'add' ? (
                  <Plus className="h-6 w-6" />
                ) : (
                  <Edit className="h-6 w-6" />
                )}
              </div>
              <h3 className="text-xl font-bold">
                {modalType === 'add' ? 'Thêm hộ khẩu mới' : 'Chỉnh sửa hộ khẩu'}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <form onSubmit={onSubmit} className="space-y-6">
            {/* Thông tin hộ khẩu */}
            <div className="bg-gray-50 rounded-[12px] p-5 border border-gray-200">
              <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Building2 className="h-5 w-5 text-navy-1" />
                Thông tin hộ khẩu
              </h4>
              <HouseholdFormFields
                formData={formData}
                setFormData={setFormData}
                districts={districts}
              />
            </div>

            {/* Thông tin thành viên */}
            {modalType === 'add' && (
              <div className="bg-gray-50 rounded-[12px] p-5 border border-gray-200">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-navy-1" />
                  Thông tin thành viên
                </h4>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Số lượng thành viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    className="input w-full md:w-48"
                    value={memberCount}
                    onChange={(e) => onMemberCountChange(parseInt(e.target.value) || 1)}
                  />
                </div>

                {members.map((member, index) => (
                  <div key={index} className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
                    <h5 className="text-sm font-semibold text-gray-900 mb-4">
                      Thành viên {index + 1} {index === 0 && '(Chủ hộ)'}
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Họ và tên khai sinh <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          className="input w-full"
                          value={member.fullName}
                          onChange={(e) => onUpdateMember(index, 'fullName', e.target.value)}
                          placeholder="Nguyễn Văn A"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quan hệ với chủ hộ <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          className="input w-full"
                          value={member.relationship}
                          onChange={(e) => onUpdateMember(index, 'relationship', e.target.value)}
                        >
                          <option value="Chủ hộ">Chủ hộ</option>
                          <option value="Vợ/Chồng">Vợ/Chồng</option>
                          <option value="Con">Con</option>
                          <option value="Cha/Mẹ">Cha/Mẹ</option>
                          <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Ngày, tháng, năm sinh <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          required
                          className="input w-full"
                          value={member.dateOfBirth}
                          onChange={(e) => onUpdateMember(index, 'dateOfBirth', e.target.value)}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Giới tính <span className="text-red-500">*</span>
                        </label>
                        <select
                          required
                          className="input w-full"
                          value={member.gender}
                          onChange={(e) => onUpdateMember(index, 'gender', e.target.value)}
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="Nam">Nam</option>
                          <option value="Nữ">Nữ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Số CCCD
                        </label>
                        <input
                          type="text"
                          className="input w-full"
                          value={member.idNumber}
                          onChange={(e) => onUpdateMember(index, 'idNumber', e.target.value)}
                          placeholder="012345678901"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quê quán
                        </label>
                        <input
                          type="text"
                          className="input w-full"
                          value={member.origin}
                          onChange={(e) => onUpdateMember(index, 'origin', e.target.value)}
                          placeholder="Hà Nội"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Dân tộc
                        </label>
                        <input
                          type="text"
                          className="input w-full"
                          value={member.ethnicity}
                          onChange={(e) => onUpdateMember(index, 'ethnicity', e.target.value)}
                          placeholder="Kinh"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Tôn giáo
                        </label>
                        <input
                          type="text"
                          className="input w-full"
                          value={member.religion}
                          onChange={(e) => onUpdateMember(index, 'religion', e.target.value)}
                          placeholder="Không"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Quốc tịch
                        </label>
                        <input
                          type="text"
                          className="input w-full"
                          value={member.nationality}
                          onChange={(e) => onUpdateMember(index, 'nationality', e.target.value)}
                          placeholder="Việt Nam"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Trình độ học vấn
                        </label>
                        <select
                          className="input w-full"
                          value={member.education}
                          onChange={(e) => onUpdateMember(index, 'education', e.target.value)}
                        >
                          <option value="">Chọn trình độ</option>
                          <option value="Mầm non">Mầm non</option>
                          <option value="Tiểu học">Tiểu học</option>
                          <option value="Trung học cơ sở">Trung học cơ sở</option>
                          <option value="Trung học phổ thông">Trung học phổ thông</option>
                          <option value="Trung cấp">Trung cấp</option>
                          <option value="Cao đẳng">Cao đẳng</option>
                          <option value="Đại học">Đại học</option>
                          <option value="Thạc sĩ">Thạc sĩ</option>
                          <option value="Tiến sĩ">Tiến sĩ</option>
                          <option value="Khác">Khác</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-gray-700 bg-white border-2 border-gray-300 rounded-[8px] hover:bg-gray-50 transition-all duration-200"
              >
                Hủy
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-sm font-semibold text-white bg-gradient-to-r from-navy-1 to-navy-2 rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5"
              >
                {modalType === 'add' ? 'Thêm hộ khẩu' : 'Cập nhật'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

