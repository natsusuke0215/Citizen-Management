import { useState, useEffect } from 'react'
import toast from 'react-hot-toast'
import { Request } from '../types'

export function useRequests() {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRequests = async () => {
    try {
      const response = await fetch('/api/my-requests')
      if (response.ok) {
        const data = await response.json()
        setRequests(data)
      }
    } catch (error) {
      toast.error('Có lỗi xảy ra khi tải danh sách yêu cầu')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRequests()
  }, [])

  return {
    requests,
    loading,
    fetchRequests,
    setRequests
  }
}

