'use client'

import { useEffect, useState, useMemo } from 'react'
import { FileSpreadsheet, ArrowLeft, Calendar, CheckCircle2, Clock, XCircle, MapPin, TrendingUp } from 'lucide-react'
import { exportBookingsToCsv } from '@/app/lib/exportCsv'
import { useRouter } from 'next/navigation'

export default function TransactionHistoryPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let isMounted = true
    const fetchData = async () => {
      try {
        const res = await fetch('/api/bookings')
        if (!res.ok) throw new Error('Fetch failed')
        const data = await res.json()
        if (isMounted) setBookings(data)
      } catch (e) {
        console.error(e)
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchData()
    return () => { isMounted = false }
  }, [])

  const totalBookings = bookings.length
  const totalRevenue = useMemo(() => {
    return bookings.reduce((sum, b) => {
      const fee = typeof b.fee === 'number' ? b.fee : 0
      // Tính tổng doanh thu của tất cả giao dịch (trừ những giao dịch bị từ chối)
      return sum + (b.status === 'REJECTED' ? 0 : fee)
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

  const getStatusIcon = (feePaid: boolean, status: string) => {
    if (feePaid) return <CheckCircle2 className="h-4 w-4" />
    if (status === 'REJECTED') return <XCircle className="h-4 w-4" />
    return <Clock className="h-4 w-4" />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-6 bg-white/80 backdrop-blur-sm border-b shadow-sm sticky top-0 z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => router.back()} 
              className="p-2 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <ArrowLeft className="h-5 w-5 text-gray-700" />
            </button>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-navy-1 to-blue-600 bg-clip-text text-transparent">
                Lịch sử giao dịch
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">Danh sách giao dịch và báo cáo doanh thu</p>
            </div>
          </div>
          <div>
            <button
              onClick={() => exportBookingsToCsv('transactions.csv', bookings)}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-navy-1 to-navy-2 text-white rounded-lg font-medium shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-200 active:scale-95"
            >
              <FileSpreadsheet className="h-4 w-4" />
              Xuất thống kê
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Stats cards with animations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div 
              className={`p-6 bg-gradient-to-br from-white to-blue-50/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100/50 ${
                mounted ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.1s' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Số lượng đặt
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                    {totalBookings}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-blue-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>Tổng số đặt chỗ</span>
                </div>
              </div>
            </div>
            
            <div 
              className={`p-6 bg-gradient-to-br from-white to-emerald-50/50 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-emerald-100/50 ${
                mounted ? 'animate-fade-in-up' : 'opacity-0'
              }`}
              style={{ animationDelay: '0.2s' }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-gray-600 mb-2">
                    Tổng doanh thu
                  </div>
                  <div className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
                    {formatCurrency(totalRevenue)}
                  </div>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-emerald-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <TrendingUp className="h-3 w-3" />
                  <span>Tổng doanh thu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Transaction list */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
              <h2 className="text-lg font-semibold text-gray-800">Danh sách giao dịch</h2>
              <p className="text-sm text-gray-500 mt-1">{sortedBookings.length} giao dịch</p>
            </div>
            
            <div className="p-4">
              {loading ? (
                <div className="py-20 flex flex-col items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-4 border-navy-1 border-t-transparent mb-4"></div>
                  <p className="text-gray-500">Đang tải dữ liệu...</p>
                </div>
              ) : bookings.length === 0 ? (
                <div className="py-20 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                    <FileSpreadsheet className="h-8 w-8 text-gray-400" />
                  </div>
                  <p className="text-gray-500 text-lg font-medium">Chưa có giao dịch</p>
                  <p className="text-gray-400 text-sm mt-1">Các giao dịch sẽ hiển thị ở đây</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {sortedBookings.map((b, index) => {
                    const amount = typeof b.fee === 'number' ? b.fee : 0
                    // Hiển thị tất cả giao dịch không bị từ chối như "Thành công"
                    const statusLabel = b.status === 'REJECTED' ? 'Thất bại' : 'Thành công'
                    const statusConfig = b.status === 'REJECTED'
                      ? { 
                          bg: 'bg-rose-50', 
                          text: 'text-rose-700', 
                          border: 'border-rose-200',
                          icon: <XCircle className="h-4 w-4" />
                        }
                      : { 
                          bg: 'bg-emerald-50', 
                          text: 'text-emerald-700', 
                          border: 'border-emerald-200',
                          icon: <CheckCircle2 className="h-4 w-4" />
                        }

                    return (
                      <div 
                        key={b.id} 
                        className={`group relative flex items-center justify-between p-5 bg-white border-2 rounded-xl hover:border-blue-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 ${
                          mounted ? 'animate-fade-in-up' : 'opacity-0'
                        }`}
                        style={{ animationDelay: `${0.3 + index * 0.05}s` }}
                      >
                        {/* Left side - Transaction info */}
                        <div className="flex-1">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-lg ${statusConfig.bg} ${statusConfig.border} border-2 group-hover:scale-110 transition-transform duration-200`}>
                              {statusConfig.icon}
                            </div>
                            <div className="flex-1">
                              <div className="text-lg font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-200">
                                {b.title || 'Không có tiêu đề'}
                              </div>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="h-3.5 w-3.5 text-gray-400" />
                                  <span className="font-medium">{b.culturalCenter?.name || 'N/A'}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Calendar className="h-3.5 w-3.5 text-gray-400" />
                                  <span>{formatDate(b.startTime)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Right side - Amount and status */}
                        <div className="text-right ml-6">
                          <div className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors duration-200">
                            {formatCurrency(amount)}
                          </div>
                          <div className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border} border`}>
                            {statusConfig.icon}
                            <span>{statusLabel}</span>
                          </div>
                        </div>

                        {/* Hover effect gradient */}
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-transparent opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300 pointer-events-none"></div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
        }
      `}} />
    </div>
  )
}


