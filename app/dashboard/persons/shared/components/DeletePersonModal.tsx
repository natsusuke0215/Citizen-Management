'use client'

import { X, ArrowRight, Skull } from 'lucide-react'

interface Person {
  id: string
  fullName: string
}

interface DeletePersonModalProps {
  person: Person
  changeForm: {
    changeType: 'MOVE_OUT' | 'DECEASED'
    changeDate: string
    moveOutDate: string
    moveOutPlace: string
    notes: string
  }
  setChangeForm: (form: any) => void
  onConfirm: (changeType: 'MOVE_OUT' | 'DECEASED') => void
  onClose: () => void
}

export default function DeletePersonModal({
  person,
  changeForm,
  setChangeForm,
  onConfirm,
  onClose
}: DeletePersonModalProps) {
  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full z-50 flex items-start justify-center py-8 px-4">
      <div className="relative w-full max-w-2xl bg-white rounded-[15px] shadow-drop-lg border border-gray-200 my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 p-6 rounded-t-[15px] text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white bg-opacity-20 rounded-[8px] backdrop-blur-sm">
                <X className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-bold">
                Xóa nhân khẩu: {person.fullName}
              </h3>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-[8px] transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          <div className="mb-6">
            <p className="text-gray-700 mb-4">
              Vui lòng chọn lý do thay đổi trạng thái nhân khẩu:
            </p>

            <div className="space-y-4">
              {/* Chuyển đi */}
              <button
                type="button"
                onClick={() => {
                  setChangeForm({
                    ...changeForm,
                    changeType: 'MOVE_OUT'
                  })
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  changeForm.changeType === 'MOVE_OUT'
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    changeForm.changeType === 'MOVE_OUT'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <ArrowRight className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Chuyển đi</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Nhân khẩu đã chuyển đi nơi khác
                    </div>
                  </div>
                </div>
              </button>

              {/* Đã mất */}
              <button
                type="button"
                onClick={() => {
                  setChangeForm({
                    ...changeForm,
                    changeType: 'DECEASED'
                  })
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                  changeForm.changeType === 'DECEASED'
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${
                    changeForm.changeType === 'DECEASED'
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Skull className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-gray-900">Đã mất</div>
                    <div className="text-sm text-gray-600 mt-1">
                      Nhân khẩu đã qua đời
                    </div>
                  </div>
                </div>
              </button>
            </div>
          </div>

          {/* Form fields for MOVE_OUT */}
          {changeForm.changeType === 'MOVE_OUT' && (
            <div className="space-y-4 mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Ngày chuyển đi
                </label>
                <input
                  type="date"
                  className="input"
                  value={changeForm.moveOutDate || changeForm.changeDate}
                  onChange={(e) =>
                    setChangeForm({ ...changeForm, moveOutDate: e.target.value })
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nơi chuyển đến (tùy chọn)
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
                  Ghi chú (tùy chọn)
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
            </div>
          )}

          {/* Info for DECEASED */}
          {changeForm.changeType === 'DECEASED' && (
            <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
              <p className="text-sm text-gray-700">
                Khi xác nhận, hệ thống sẽ cập nhật tình trạng nhân khẩu thành <strong>Đã qua đời</strong>.
              </p>
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
              type="button"
              onClick={() => onConfirm(changeForm.changeType)}
              className={`px-6 py-2.5 text-sm font-semibold text-white rounded-[8px] hover:shadow-drop-lg transition-all duration-200 transform hover:-translate-y-0.5 ${
                changeForm.changeType === 'MOVE_OUT'
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                  : 'bg-gradient-to-r from-red-500 to-red-600'
              }`}
            >
              Xác nhận
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

