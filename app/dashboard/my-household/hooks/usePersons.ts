import { useState, useEffect } from 'react'
import { Person } from '../types'

export function usePersons() {
  const [persons, setPersons] = useState<Person[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPersons = async () => {
    try {
      const response = await fetch('/api/my-household/persons')
      if (response.ok) {
        const data = await response.json()
        setPersons(data)
      }
    } catch (error) {
      console.error('Error fetching persons:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPersons()
  }, [])

  return {
    persons,
    loading,
    fetchPersons,
    setPersons
  }
}

