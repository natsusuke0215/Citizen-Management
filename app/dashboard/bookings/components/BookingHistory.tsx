'use client'

import { useMemo } from 'react'
import { History, X } from 'lucide-react'
import { Booking } from '../types'

interface BookingHistoryProps {
  isOpen: boolean
  onClose: () => void
  bookings: Booking[]
}

export default function BookingHistory({ isOpen, onClose, bookings }: BookingHistoryProps) {
  if (!isOpen) return null

  const revenue = useMemo(() => {
    return bookings.reduce((sum, b) => {
      const fee = typeof b.fee === 'number' ? b.fee : 0
      if (b.feePaid) return sum + fee
      return sum
    }, 0)
  }, [bookings])
 
  const sortedBookings = useMemo(() => {
    return bookings.slice().sort((a, b) => {
      const aCreated = new Date(a.createdAt).getTime()
      const bCreated = new Date(b.createdAt).getTime()
      return bCreated - aCreated
    })
  }, [bookings])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className="fixed inset-0 z-60 flex">
      <div className="flex-1" onClick={onClose} />
      <div className="w-full sm:w-96 bg-white shadow-xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-navy-1 to-navy-2">
          <div className="flex items-center gap-3 text-white">
            <History className="h-5 w-5" />
            <h3 className="text-lg font-semibold">Lịch sử đặt lịch</h3>
          </div>
          <button onClick={onClose} className="text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 max-h-[70vh] overflow-y-auto space-y-3">
          {sortedBookings.length === 0 ? (
            <div className="text-sm text-gray-500">Chưa có lịch sử đặt lịch.</div>
          ) : (
            sortedBookings.map((b) => {
              const amount = typeof b.fee === 'number' ? b.fee : 0
              const statusLabel = b.feePaid ? 'Thành công' : (b.status === 'REJECTED' ? 'Thất bại' : 'Chờ')
              const statusClass = b.feePaid ? 'bg-emerald-100 text-emerald-800' : (b.status === 'REJECTED' ? 'bg-rose-100 text-rose-800' : 'bg-yellow-100 text-yellow-800')

              return (
                <div key={b.id} className="flex items-start justify-between gap-3 p-3 border border-gray-100 rounded-[10px]">
                  <div className="flex-1">
                    <div className="text-sm font-medium text-gray-900">{b.title}</div>
                    <div className="text-xs text-gray-500">
                      {b.culturalCenter?.name} • {formatDate(b.startTime)} — {formatDate(b.endTime)}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Người đặt: {b.bookerName || b.user?.name} {b.bookerPhone ? `• ${b.bookerPhone}` : ''}
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="text-sm font-semibold text-gray-900">{formatCurrency(amount)}</div>
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass}`}>{statusLabel}</div>
                  </div>
                </div>
              )
            })
          )}
        </div>

        <div className="sticky bottom-0 bg-white border-t border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600">Tổng doanh thu:</div>
            <div className="text-lg font-bold text-gray-900">{formatCurrency(revenue)}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


