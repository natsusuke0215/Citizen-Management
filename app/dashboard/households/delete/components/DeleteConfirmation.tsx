'use client'

import { AlertTriangle, Users } from 'lucide-react'
import { Household } from '../../shared/types'

interface DeleteConfirmationProps {
  household: Household
  confirmText: string
  onConfirmTextChange: (text: string) => void
}

export default function DeleteConfirmation({
  household,
  confirmText,
  onConfirmTextChange
}: DeleteConfirmationProps) {
  const hasPersons = household.persons.length > 0
  const hasMembers = household.members && household.members.length > 0

  return (
    <>
      <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-gradient-to-br from-rose-500 to-rose-600 rounded-[10px]">
            <AlertTriangle className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-900">Thông tin hộ khẩu</h2>
        </div>
        
        <div className="bg-gray-50 rounded-[10px] p-5 border border-gray-200 space-y-3 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <span className="text-sm font-semibold text-gray-600">Số hộ khẩu:</span>
              <p className="text-base font-semibold text-gray-900">{household.householdId}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Chủ hộ:</span>
              <p className="text-base font-semibold text-gray-900">{household.ownerName}</p>
            </div>
            <div className="md:col-span-2">
              <span className="text-sm font-semibold text-gray-600">Địa chỉ:</span>
              <p className="text-base text-gray-900">{household.address}, {household.street || ''}, {household.ward}, {household.district}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Khu phố:</span>
              <p className="text-base text-gray-900">{household.districtRelation.name}</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Số thành viên:</span>
              <p className="text-base font-semibold text-gray-900">{household.persons.length} người</p>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-600">Số người dùng liên kết:</span>
              <p className="text-base font-semibold text-gray-900">{household.members?.length || 0} người</p>
            </div>
          </div>
        </div>

        {hasPersons && (
          <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-[10px]">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 mb-1">Cảnh báo</p>
                <p className="text-sm text-amber-700">
                  Hộ khẩu này có {household.persons.length} thành viên. 
                  Bạn cần chuyển hoặc xóa các thành viên trước khi xóa hộ khẩu.
                </p>
              </div>
            </div>
          </div>
        )}

        {hasMembers && (
          <div className={`mt-4 p-4 bg-amber-50 border-2 border-amber-300 rounded-[10px]`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-semibold text-amber-800 mb-1">Cảnh báo</p>
                <p className="text-sm text-amber-700">
                  Hộ khẩu này có {household.members?.length || 0} người dùng liên kết. 
                  Bạn cần hủy liên kết trước khi xóa hộ khẩu.
                </p>
              </div>
            </div>
          </div>
        )}

        {!hasPersons && !hasMembers && (
          <div className="mt-4 p-5 bg-gradient-to-br from-rose-50 to-red-50 border-2 border-rose-300 rounded-[10px]">
            <div className="flex items-start gap-3">
              <div className="p-2 bg-rose-500 rounded-[8px]">
                <AlertTriangle className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-rose-800 mb-1">Xác nhận xóa</p>
                <p className="text-sm text-rose-700 mb-4">
                  Hành động này không thể hoàn tác. Vui lòng nhập số hộ khẩu để xác nhận.
                </p>
                <input
                  type="text"
                  className="w-full px-4 py-3 border-2 border-rose-300 rounded-[8px] bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200"
                  value={confirmText}
                  onChange={(e) => onConfirmTextChange(e.target.value)}
                  placeholder={`Nhập "${household.householdId}" để xác nhận`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danh sách thành viên */}
      {hasPersons && (
        <div className="bg-white rounded-[15px] shadow-drop p-6 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-yellow-1 to-yellow-2 rounded-[10px]">
              <Users className="h-6 w-6 text-navy-1" />
            </div>
            <h2 className="text-xl font-bold text-gray-900">Danh sách thành viên</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Họ tên</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giới tính</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Quan hệ</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày sinh</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {household.persons.map((person) => (
                  <tr key={person.id}>
                    <td className="px-4 py-3 text-sm">{person.fullName}</td>
                    <td className="px-4 py-3 text-sm">{person.gender}</td>
                    <td className="px-4 py-3 text-sm">{person.relationship || 'Chủ hộ'}</td>
                    <td className="px-4 py-3 text-sm">{new Date(person.dateOfBirth).toLocaleDateString('vi-VN')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  )
}

