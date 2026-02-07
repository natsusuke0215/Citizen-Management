'use client'

import { useEffect, useState, useMemo } from 'react'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Booking } from '../../types'

export default function BookingHistoryPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchBookings = async () => {
      try {
        const res = await fetch('/api/bookings')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        if (mounted) setBookings(data)
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchBookings()
    return () => { mounted = false }
  }, [])

  const revenue = useMemo(() => {
    return bookings.reduce((sum, b) => {
      const fee = typeof b.fee === 'number' ? b.fee : 0
      return sum + (b.feePaid ? fee : 0)
    }, 0)
  }, [bookings])

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount)

  const formatDate = (dateString: string) =>
    new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 px-6 py-5 bg-white border-b">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-md hover:bg-gray-100"
            aria-label="Quay lại"
          >
            <ArrowLeft className="h-5 w-5 text-gray-700" />
          </button>
          <h1 className="text-2xl font-semibold">Lịch sử đặt lịch</h1>
        </div>

        <div className="p-6 pb-32">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-navy-1"></div>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center text-gray-500 py-10">Chưa có lịch sử đặt lịch.</div>
          ) : (
            <div className="space-y-4">
              {bookings.map((b) => {
                const amount = typeof b.fee === 'number' ? b.fee : 0
                const statusLabel = b.feePaid ? 'Thành công' : (b.status === 'REJECTED' ? 'Thất bại' : 'Chờ')
                const statusClass = b.feePaid ? 'bg-emerald-100 text-emerald-800' : (b.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-yellow-100 text-yellow-800')

                return (
                  <div key={b.id} className="bg-white p-4 rounded-lg shadow-sm border">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-lg font-semibold text-gray-900">{b.title}</div>
                        <div className="text-sm text-gray-500 mt-1">
                          {b.culturalCenter?.name} • {formatDate(b.startTime)}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-lg font-bold text-gray-900">{formatCurrency(amount)}</div>
                        <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>
                          {statusLabel}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="fixed right-0 bottom-0 left-0 border-t bg-white">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="text-sm text-gray-600">Tổng doanh thu:</div>
          <div className="text-xl font-bold text-gray-900">{formatCurrency(revenue)}</div>
        </div>
      </div>
    </div>
  )
}


