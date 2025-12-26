export interface CulturalCenter {
  id: string
  name: string
  description: string | null
  capacity: number
  location: string
  building: string
  floor: number | null
  room: string | null
  amenities: string | null
  imageUrl: string | null
  createdAt: string
  _count: {
    bookings: number
  }
}

export interface Asset {
  id: string
  name: string
  category: string | null
  quantity: number
  condition: string
  location: string | null
  notes: string | null
  imageUrl: string | null
  goodQuantity: number | null
  fairQuantity: number | null
  poorQuantity: number | null
  damagedQuantity: number | null
  repairingQuantity: number | null
}

