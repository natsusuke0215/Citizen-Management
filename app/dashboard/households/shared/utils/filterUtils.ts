import { Household } from '../types'

export const filterHouseholds = (households: Household[], searchTerm: string): Household[] => {
  const searchLower = (searchTerm || '').toLowerCase()
  return households.filter(household =>
    household.householdId.toLowerCase().includes(searchLower) ||
    household.ownerName.toLowerCase().includes(searchLower) ||
    household.address.toLowerCase().includes(searchLower) ||
    household.ward.toLowerCase().includes(searchLower) ||
    household.district.toLowerCase().includes(searchLower)
  )
}

