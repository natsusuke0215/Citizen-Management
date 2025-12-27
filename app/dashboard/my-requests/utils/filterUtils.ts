import { Request } from '../types'

export const filterRequests = (
  requests: Request[],
  searchTerm: string,
  selectedStatus: string,
  selectedType: string
): Request[] => {
  return requests.filter(request => {
    const searchLower = (searchTerm || '').toLowerCase()

    const valuesToSearch = [
      request.description
    ]

    const matchesSearch = valuesToSearch.some(value =>
      (value || '').toLowerCase().includes(searchLower)
    )

    const matchesStatus = selectedStatus === 'all' || request.status === selectedStatus
    const matchesType = selectedType === 'all' || request.type === selectedType
    
    return matchesSearch && matchesStatus && matchesType
  })
}

