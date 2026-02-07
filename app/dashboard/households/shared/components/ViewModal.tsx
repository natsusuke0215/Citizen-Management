'use client'

import { X, Home } from 'lucide-react'
import { Household, Person } from '../types'

interface ViewModalProps {
  household: Household
  getOwner: (household: Household) => Person | null
  onClose: () => void
  onSplit: () => void
}

export default function ViewModal({
  household,
  getOwner,
  onClose,
  onSplit
}: ViewModalProps) {
  const owner = getOwner(household)
  // Filter out the owner to show only other members
  const otherMembers = household.persons.filter(p => {
    // Exclude the owner - show all other members
    return owner ? p.id !== owner.id : true
  })

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-gray-900">
            Chi tiết hộ khẩu: {household.householdId}
          </h3>
          <button
            onClick={onClose}
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
                <span className="ml-2 text-sm text-gray-900">{household.householdId}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">Địa chỉ:</span>
                <span className="ml-2 text-sm text-gray-900">
                  {[
                    household.address,
                    household.street,
                    household.ward,
                    household.district,
                    household.districtRelation.name
                  ].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Owner Info */}
        {owner && (
          <div className="mb-6">
            <h4 className="text-md font-semibold text-gray-900 mb-3">Thông tin chủ hộ</h4>
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-700">Họ và tên:</span>
                  <span className="ml-2 text-sm text-gray-900">{owner.fullName || 'Chưa có'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Ngày sinh:</span>
                  <span className="ml-2 text-sm text-gray-900">
                    {owner.dateOfBirth ? new Date(owner.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa có'}
                  </span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Giới tính:</span>
                  <span className="ml-2 text-sm text-gray-900">{owner.gender || 'Chưa có'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Nguyên quán:</span>
                  <span className="ml-2 text-sm text-gray-900">{owner.origin || 'Chưa có'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Dân tộc:</span>
                  <span className="ml-2 text-sm text-gray-900">{owner.ethnicity || 'Chưa có'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Nghề nghiệp:</span>
                  <span className="ml-2 text-sm text-gray-900">{owner.occupation || 'Chưa có'}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Số {owner.idType || 'CCCD'}:</span>
                  <span className="ml-2 text-sm text-gray-900">{owner.idNumber || 'Chưa có'}</span>
                </div>
                {owner.placeOfBirth && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Nơi sinh:</span>
                    <span className="ml-2 text-sm text-gray-900">{owner.placeOfBirth}</span>
                  </div>
                )}
                {owner.religion && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Tôn giáo:</span>
                    <span className="ml-2 text-sm text-gray-900">{owner.religion}</span>
                  </div>
                )}
                {owner.nationality && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Quốc tịch:</span>
                    <span className="ml-2 text-sm text-gray-900">{owner.nationality}</span>
                  </div>
                )}
                {owner.education && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Trình độ học vấn:</span>
                    <span className="ml-2 text-sm text-gray-900">{owner.education}</span>
                  </div>
                )}
                {owner.workplace && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Nơi làm việc:</span>
                    <span className="ml-2 text-sm text-gray-900">{owner.workplace}</span>
                  </div>
                )}
                {owner.idNumber && owner.idIssueDate && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Ngày cấp:</span>
                    <span className="ml-2 text-sm text-gray-900">
                      {new Date(owner.idIssueDate).toLocaleDateString('vi-VN')}
                    </span>
                  </div>
                )}
                {owner.idNumber && owner.idIssuePlace && (
                  <div>
                    <span className="text-sm font-medium text-gray-700">Nơi cấp:</span>
                    <span className="ml-2 text-sm text-gray-900">{owner.idIssuePlace}</span>
                  </div>
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
        )}

        {/* Members Info */}
        <div className="mb-6">
          <h4 className="text-md font-semibold text-gray-900 mb-3">
            Danh sách thành viên ({household.persons.length} người)
          </h4>
          {otherMembers.length > 0 ? (
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
                      <span className="text-gray-700">Họ và tên:</span>
                      <span className="ml-2 text-gray-900">{person.fullName || 'Chưa có'}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Ngày sinh:</span>
                      <span className="ml-2 text-gray-900">
                        {person.dateOfBirth ? new Date(person.dateOfBirth).toLocaleDateString('vi-VN') : 'Chưa có'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-700">Giới tính:</span>
                      <span className="ml-2 text-gray-900">{person.gender || 'Chưa có'}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Nguyên quán:</span>
                      <span className="ml-2 text-gray-900">{person.origin || 'Chưa có'}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Dân tộc:</span>
                      <span className="ml-2 text-gray-900">{person.ethnicity || 'Chưa có'}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Nghề nghiệp:</span>
                      <span className="ml-2 text-gray-900">{person.occupation || 'Chưa có'}</span>
                    </div>
                    <div>
                      <span className="text-gray-700">Số {person.idType || 'CCCD'}:</span>
                      <span className="ml-2 text-gray-900">{person.idNumber || 'Chưa có'}</span>
                    </div>
                    {person.placeOfBirth && (
                      <div>
                        <span className="text-gray-700">Nơi sinh:</span>
                        <span className="ml-2 text-gray-900">{person.placeOfBirth}</span>
                      </div>
                    )}
                    {person.religion && (
                      <div>
                        <span className="text-gray-700">Tôn giáo:</span>
                        <span className="ml-2 text-gray-900">{person.religion}</span>
                      </div>
                    )}
                    {person.nationality && (
                      <div>
                        <span className="text-gray-700">Quốc tịch:</span>
                        <span className="ml-2 text-gray-900">{person.nationality}</span>
                      </div>
                    )}
                    {person.education && (
                      <div>
                        <span className="text-gray-700">Trình độ học vấn:</span>
                        <span className="ml-2 text-gray-900">{person.education}</span>
                      </div>
                    )}
                    {person.workplace && (
                      <div>
                        <span className="text-gray-700">Nơi làm việc:</span>
                        <span className="ml-2 text-gray-900">{person.workplace}</span>
                      </div>
                    )}
                    {person.idNumber && person.idIssueDate && (
                      <div>
                        <span className="text-gray-700">Ngày cấp:</span>
                        <span className="ml-2 text-gray-900">
                          {new Date(person.idIssueDate).toLocaleDateString('vi-VN')}
                        </span>
                      </div>
                    )}
                    {person.idNumber && person.idIssuePlace && (
                      <div>
                        <span className="text-gray-700">Nơi cấp:</span>
                        <span className="ml-2 text-gray-900">{person.idIssuePlace}</span>
                      </div>
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
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500">
              <p>Hộ khẩu này chỉ có chủ hộ, không có thành viên khác.</p>
            </div>
          )}
        </div>
        
        <div className="flex justify-between mt-6 pt-6 border-t">
          <button
            onClick={onSplit}
            className="btn bg-orange-500 hover:bg-orange-600 text-white"
          >
            Tách hộ khẩu
          </button>
          <button
            onClick={onClose}
            className="btn btn-secondary"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  )
}

