import type { CulturalCenter } from '../types'

export function filterCenters(
  centers: CulturalCenter[],
  searchTerm: string
): CulturalCenter[] {
  if (!searchTerm) return centers

  const searchLower = searchTerm.toLowerCase().trim()

  return centers.filter(center => {
    // Search in name, description, location
    const basicMatch = [
      center.name,
      center.description,
      center.location
    ].some(value => (value || '').toLowerCase().includes(searchLower))

    // Search in amenities
    let amenitiesMatch = false
    if (center.amenities) {
      try {
        const amenities = JSON.parse(center.amenities)
        amenitiesMatch = amenities.some((amenity: string) =>
          amenity.toLowerCase().includes(searchLower)
        )
      } catch (e) {
        // If parsing fails, treat as string
        amenitiesMatch = center.amenities.toLowerCase().includes(searchLower)
      }
    }

    return basicMatch || amenitiesMatch
  })
}

export function sortCenters(
  centers: CulturalCenter[],
  sortBy: 'name' | 'capacity' | 'bookings'
): CulturalCenter[] {
  return [...centers].sort((a, b) => {
    switch (sortBy) {
      case 'capacity':
        return b.capacity - a.capacity
      case 'bookings':
        return b._count.bookings - a._count.bookings
      case 'name':
      default:
        return a.name.localeCompare(b.name, 'vi')
    }
  })
}

