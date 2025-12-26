export interface CulturalCenter {
  id: string
  name: string
  building: string
  floor: number | null
  room: string | null
  capacity: number
}

export interface Booking {
  id: string
  title: string
  description: string | null
  startTime: string
  endTime: string
  visibility: 'PUBLIC' | 'PRIVATE'
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  culturalCenter: CulturalCenter
  user: {
    id: string
    name: string
  }
  createdAt: string
}

export type BookingStatus = 'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'

export interface BookingFormData {
  title: string
  description: string
  startTime: string
  endTime: string
  culturalCenterId: string
  visibility: 'PUBLIC' | 'PRIVATE'
}

