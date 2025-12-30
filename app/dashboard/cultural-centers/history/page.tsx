'use client'

import { useEffect, useState, useMemo } from 'react'
import { FileSpreadsheet, ArrowLeft } from 'lucide-react'
import { exportBookingsToCsv } from '@/app/lib/exportCsv'
import { useRouter } from 'next/navigation'

export default function TransactionHistoryPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    const fetchData = async () => {
      try {
        const res = await fetch('/api/bookings')
        if (!res.ok) throw new Error('Fetch failed')
        const data = await res.json()
        if (mounted) setBookings(data)
      } catch (e) {
        console.error(e)
      } finally {
        if (mounted) setLoading(false)
      }
    }
    fetchData()
    return () => { mounted = false }
  }, [])

  const totalBookings = bookings.length
  const totalRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => {
      const fee = typeof b.fee === 'number' ? b.fee : 0
      return sum + (b.feePaid ? fee : 0)
    }, 0)
  }, [bookings])
 
  const sortedBookings = useMemo(() => {
    return bookings.slice().sort((a, b) => {
      const aCreated = new Date(a.createdAt).getTime()
      const bCreated = new Date(b.createdAt).getTime()
      return bCreated - aCreated
    })
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
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between px-6 py-5 bg-white border-b">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()} className="p-2 rounded-md hover:bg-gray-100">
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-semibold">Lịch sử giao dịch</h1>
              <p className="text-sm text-gray-500">Danh sách giao dịch và báo cáo doanh thu</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => exportBookingsToCsv('transactions.csv', bookings)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-[8px] font-medium"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Xuất thống kê
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 bg-white rounded-[12px] shadow-sm">
              <div className="text-sm text-gray-500">Số lượng đặt</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{totalBookings}</div>
            </div>
            <div className="p-6 bg-white rounded-[12px] shadow-sm">
              <div className="text-sm text-gray-500">Tổng doanh thu</div>
              <div className="text-3xl font-bold text-gray-900 mt-2">{formatCurrency(totalRevenue)}</div>
            </div>
          </div>

          {/* Transaction list */}
          <div className="bg-white rounded-[12px] shadow-sm p-4">
            {loading ? (
              <div className="py-10 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-1"></div>
              </div>
            ) : bookings.length === 0 ? (
              <div className="py-10 text-center text-gray-500">Chưa có giao dịch.</div>
            ) : (
              <div className="space-y-3">
                {sortedBookings.map((b) => {
                  const amount = typeof b.fee === 'number' ? b.fee : 0
                  const statusLabel = b.feePaid ? 'Thành công' : (b.status === 'REJECTED' ? 'Thất bại' : 'Chờ')
                  const statusClass = b.feePaid ? 'bg-emerald-100 text-emerald-800' : (b.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-yellow-100 text-yellow-800')

                  return (
                    <div key={b.id} className="flex items-center justify-between p-4 border rounded-md">
                      <div>
                        <div className="text-md font-semibold text-gray-900">{b.title}</div>
                        <div className="text-sm text-gray-500 mt-1">{b.culturalCenter?.name} • {formatDate(b.startTime)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-lg font-bold">{formatCurrency(amount)}</div>
                        <div className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${statusClass}`}>{statusLabel}</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


