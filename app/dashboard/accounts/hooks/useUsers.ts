import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { User as UserType } from '@/lib/types'

interface UserWithPassword extends UserType {
  password?: string
}

export function useUsers() {
  const [users, setUsers] = useState<UserWithPassword[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/users', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        setUsers(data)
      } else {
        const error = await response.json()
        toast.error(error.message || 'Có lỗi xảy ra khi tải danh sách người dùng')
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách người dùng')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return {
    users,
    loading,
    fetchUsers,
    setUsers
  }
}

