'use client'

import { useState, useEffect } from 'react'
import { X, QrCode, CheckCircle, Clock, CreditCard } from 'lucide-react'
import { CulturalCenter, Booking } from '../types'

interface PaymentCheckoutProps {
  isOpen: boolean
  onClose: () => void
  onPaymentSuccess: () => void
  booking: {
    id: string
    title: string
    startTime: string
    endTime: string
    culturalCenter: CulturalCenter
  }
  totalAmount: number
}

export default function PaymentCheckout({
  isOpen,
  onClose,
  onPaymentSuccess,
  booking,
  totalAmount
}: PaymentCheckoutProps) {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success'>('pending')
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')

  useEffect(() => {
    if (isOpen && paymentStatus === 'pending') {
      // Generate VietQR code using the img.vietqr.io API
      // Format: https://img.vietqr.io/image/{bankCode}-{accountNumber}-{template}.jpg?amount={amount}&addInfo={description}&accountName={name}
      const bankCode = '970415' // VietinBank
      const accountNumber = '1234567890'
      const template = 'qr_only'
      const amount = Math.round(totalAmount)
      const description = encodeURIComponent(`Thanh toan dat lich: ${booking.title}`)
      const accountName = encodeURIComponent('Nha Van Hoa Trung Tam')

      const qrUrl = `https://img.vietqr.io/image/${bankCode}-${accountNumber}-${template}.jpg?amount=${amount}&addInfo=${description}&accountName=${accountName}`
      setQrCodeUrl(qrUrl)
    }
  }, [isOpen, paymentStatus, totalAmount, booking.title])

  const handleSimulatePayment = async () => {
    setPaymentStatus('processing')

    // Simulate payment processing delay
    setTimeout(async () => {
      try {
        // Confirm payment in the backend
        const response = await fetch(`/api/bookings/${booking.id}/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        })

        if (response.ok) {
          setPaymentStatus('success')
          setTimeout(() => {
            onPaymentSuccess()
          }, 2000) // Show success animation for 2 seconds
        } else {
          setPaymentStatus('pending')
          alert('Có lỗi xảy ra khi xác nhận thanh toán')
        }
      } catch (error) {
        setPaymentStatus('pending')
        alert('Có lỗi xảy ra khi xác nhận thanh toán')
      }
    }, 2000)
  }

  if (!isOpen) return null

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:p-0">
        <div
          className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity backdrop-blur-sm"
          onClick={onClose}
        />

        <div className="relative inline-block align-bottom bg-white rounded-[15px] text-left overflow-hidden shadow-drop-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-gradient-to-r from-navy-1 to-navy-2 px-6 py-5">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <CreditCard className="h-6 w-6" />
                Thanh toán đặt lịch
              </h3>
              <button
                onClick={onClose}
                className="text-white hover:text-gray-200 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div className="px-6 py-6">
            {paymentStatus === 'success' ? (
              /* Success State */
              <div className="text-center py-12">
                <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <CheckCircle className="h-12 w-12 text-green-600" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Thanh toán thành công!
                </h3>
                <p className="text-gray-600 mb-6">
                  Lịch đặt của bạn đã được xác nhận. Chuyển hướng về trang chủ...
                </p>
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-navy-1 mx-auto"></div>
              </div>
            ) : (
              /* Payment Form */
              <div className="space-y-6">
                {/* Payment Summary */}
                <div className="bg-gray-50 rounded-[12px] p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Tóm tắt thanh toán
                  </h4>

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Tiêu đề:</span>
                      <span className="font-medium text-gray-900">{booking.title}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Cơ sở:</span>
                      <span className="font-medium text-gray-900">{booking.culturalCenter.name}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Thời gian bắt đầu:</span>
                      <span className="font-medium text-gray-900">{formatTime(booking.startTime)}</span>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Thời gian kết thúc:</span>
                      <span className="font-medium text-gray-900">{formatTime(booking.endTime)}</span>
                    </div>

                    <div className="border-t border-gray-200 pt-3 mt-4">
                      <div className="flex justify-between items-center text-lg font-bold">
                        <span className="text-gray-900">Tổng tiền:</span>
                        <span className="text-navy-1">{formatCurrency(totalAmount)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* QR Code Section */}
                <div className="text-center">
                  <div className="bg-white border-2 border-gray-200 rounded-[12px] p-6 inline-block">
                    <div className="flex items-center justify-center gap-2 mb-4">
                      {paymentStatus === 'processing' ? (
                        <Clock className="h-5 w-5 text-orange-500 animate-pulse" />
                      ) : (
                        <QrCode className="h-5 w-5 text-navy-1" />
                      )}
                      <span className="font-medium text-gray-900">
                        {paymentStatus === 'processing' ? 'Đang xử lý thanh toán...' : 'Quét mã QR để thanh toán'}
                      </span>
                    </div>

                    {qrCodeUrl && paymentStatus !== 'processing' && (
                      <div className="mb-4">
                        <img
                          src={qrCodeUrl}
                          alt="VietQR Code"
                          className="w-48 h-48 mx-auto border border-gray-200 rounded-[8px]"
                        />
                      </div>
                    )}

                    {paymentStatus === 'processing' && (
                      <div className="mb-4">
                        <div className="w-48 h-48 mx-auto bg-gray-100 rounded-[8px] flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-navy-1"></div>
                        </div>
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-6">
                      Sử dụng ứng dụng ngân hàng để quét mã QR và thanh toán
                    </p>

                    {/* Simulate Payment Button (Development Mode) */}
                    <button
                      onClick={handleSimulatePayment}
                      disabled={paymentStatus === 'processing'}
                      className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-[8px] font-medium hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {paymentStatus === 'processing' ? 'Đang xử lý...' : 'Mô phỏng thanh toán thành công'}
                    </button>
                  </div>
                </div>

                {/* Status Indicator */}
                <div className="text-center">
                  <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium ${
                    paymentStatus === 'processing'
                      ? 'bg-orange-100 text-orange-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    <Clock className="h-4 w-4" />
                    {paymentStatus === 'processing' ? 'Đang chờ xác nhận...' : 'Chờ thanh toán'}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
