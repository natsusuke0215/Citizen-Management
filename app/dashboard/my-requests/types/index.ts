export interface Request {
  id: string
  type: 'HOUSEHOLD_UPDATE' | 'ADD_PERSON' | 'REMOVE_PERSON' | 'CULTURAL_CENTER_BOOKING'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  description: string
  data: string | null
  household: {
    id: string
    householdId: string
    address: string
  } | null
  createdAt: string
  updatedAt: string
}

export interface RequestFormData {
  type: 'HOUSEHOLD_UPDATE' | 'ADD_PERSON' | 'REMOVE_PERSON' | 'CULTURAL_CENTER_BOOKING'
  description: string
  additionalData: string
}

export const REQUEST_TYPES = {
  HOUSEHOLD_UPDATE: 'Cập nhật hộ khẩu',
  ADD_PERSON: 'Thêm nhân khẩu',
  REMOVE_PERSON: 'Xóa nhân khẩu',
  CULTURAL_CENTER_BOOKING: 'Đặt lịch nhà văn hóa'
} as const

