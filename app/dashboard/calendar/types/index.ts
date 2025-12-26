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
}

export interface Building {
  id: string
  name: string
  color: string
}

export interface TimeSlot {
  time: string
  hour: number
}

