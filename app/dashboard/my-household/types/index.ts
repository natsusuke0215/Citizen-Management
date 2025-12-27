export interface Household {
  id: string
  householdId: string
  address: string
  street?: string
  ward?: string
  district?: string
  districtRelation?: {
    id: string
    name: string
  }
  members: Array<{
    id: string
    name: string
    email: string
    role: string
  }>
  createdAt: string
}

export interface Person {
  id: string
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string
  relationship: string
  createdAt: string
}

export interface PersonFormData {
  fullName: string
  dateOfBirth: string
  gender: string
  idNumber: string
  relationship: string
}

