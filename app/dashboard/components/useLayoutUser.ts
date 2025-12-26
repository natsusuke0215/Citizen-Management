import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  name: string
  role: string
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  const fetchUser = useCallback(async () => {
    try {
      const response = await fetch('/api/auth/me', {
        credentials: 'include'
      })

      if (response.ok) {
        const userData = await response.json()
        setUser(userData)
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error fetching user info:', error)
      router.push('/login')
    } finally {
      setLoading(false)
    }
  }, [router])

  useEffect(() => {
    fetchUser()

    const handleUserProfileUpdate = () => {
      fetchUser()
    }

    window.addEventListener('userProfileUpdated', handleUserProfileUpdate)

    return () => {
      window.removeEventListener('userProfileUpdated', handleUserProfileUpdate)
    }
  }, [fetchUser])

  return { user, loading, refetch: fetchUser }
}

