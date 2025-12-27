'use client'

import { UserMinus } from 'lucide-react'

interface PersonForRemove {
  id: string
  fullName: string
  idNumber: string
}

interface RemovePersonModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (person: PersonForRemove) => void
  person: PersonForRemove | null
}

export default function RemovePersonModal({
  isOpen,
  onClose,
  onConfirm,
  person
}: RemovePersonModalProps) {
  if (!isOpen || !person) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Xác nhận xóa nhân khẩu
            </h3>
            
            <div className="space-y-4">
              <p className="text-sm text-gray-600">
                Bạn có chắc chắn muốn xóa nhân khẩu <strong>{person.fullName}</strong> khỏi hộ khẩu?
              </p>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <UserMinus className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      Lưu ý
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>Thao tác này sẽ tạo yêu cầu xóa nhân khẩu và cần được admin duyệt.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={() => onConfirm(person)}
              className="btn btn-danger sm:ml-3"
            >
              Gửi yêu cầu xóa
            </button>
            <button
              onClick={onClose}
              className="btn btn-secondary mt-3 sm:mt-0"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

