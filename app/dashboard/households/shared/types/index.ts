export interface Person {
  id: string
  fullName: string
  dateOfBirth: string
  placeOfBirth?: string
  origin?: string
  ethnicity?: string
  religion?: string
  nationality?: string
  education?: string
  gender: string
  occupation?: string
  workplace?: string
  idType?: string
  idNumber?: string
  idIssueDate?: string
  idIssuePlace?: string
  registrationDate?: string
  previousAddress?: string
  relationship?: string
}

export interface Household {
  id: string
  householdId: string
  ownerName: string
  address: string
  street?: string
  ward: string
  district: string
  districtRelation: {
    id: string
    name: string
  }
  persons: Person[]
  members?: Array<{
    id: string
    name: string
    email: string
  }>
  createdAt?: string
}

export interface District {
  id: string
  name: string
  description?: string
}

export interface PersonFormData {
  fullName: string
  dateOfBirth: string
  gender: string
  placeOfBirth: string
  origin: string
  ethnicity: string
  religion: string
  nationality: string
  education: string
  occupation: string
  workplace: string
  idType: string
  idNumber: string
  idIssueDate: string
  idIssuePlace: string
  registrationDate: string
  previousAddress: string
  relationship: string
  notes: string
}

