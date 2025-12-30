export interface CulturalCenter {
  id: string
  name: string
  building: string
  floor: number | null
  room: string | null
  capacity: number
  baseHourlyRate: number
}

export interface Booking {
  id: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  visibility: 'PUBLIC' | 'PRIVATE'
  status: 'PENDING' | 'PENDING_PAYMENT' | 'APPROVED' | 'REJECTED'
  culturalCenter: CulturalCenter
  user: {
    id: string
    name: string
  }
  bookerName?: string | null
  bookerPhone?: string | null
  fee?: number | null
  feePaid?: boolean
  createdAt: string
}

export type BookingStatus = 'ALL' | 'PENDING' | 'PENDING_PAYMENT' | 'APPROVED' | 'REJECTED'

export interface BookingFormData {
  title: string
  description: string
  startTime: string
  endTime: string
  culturalCenterId: string
  visibility: 'PUBLIC' | 'PRIVATE'
  bookerName?: string
  bookerPhone?: string
}

