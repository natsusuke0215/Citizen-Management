'use client'

import { Edit, X } from 'lucide-react'

interface Person {
  id: string
  fullName: string
}

interface ChangePersonModalProps {
  person: Person
  changeForm: {
    changeType: 'MOVE_OUT' | 'DECEASED'
    changeDate: string
    moveOutDate: string
    moveOutPlace: string
    notes: string
  }
  setChangeForm: (form: any) => void
  onSubmit: (e: React.FormEvent) => void
  onClose: () => void
}

export default function ChangePersonModal({
  person,
  changeForm,
  setChangeForm,
  onSubmit,
  onClose
}: ChangePersonModalProps) {
  return (
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
                Thay đổi nhân khẩu: {person.fullName}
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
          <form onSubmit={onSubmit} className="space-y-6">
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
                  tự động ghi chú là <strong>"Đã qua đời"</strong>.
                </p>
              )}
            </div>

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
                Lưu thay đổi
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

