'use client'

import { useState, useEffect } from 'react'
import { Users, Building, FileText, Calendar, TrendingUp, AlertCircle } from 'lucide-react'

interface DashboardStats {
  totalHouseholds: number
  totalPersons: number
  totalDistricts: number
  totalRequests: number
  pendingRequests: number
  totalBookings: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalHouseholds: 0,
    totalPersons: 0,
    totalDistricts: 0,
    totalRequests: 0,
    pendingRequests: 0,
    totalBookings: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/dashboard/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Tổng số hộ khẩu',
      value: stats.totalHouseholds,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'Tổng số nhân khẩu',
      value: stats.totalPersons,
      icon: Users,
      color: 'bg-green-500',
      change: '+8%',
      changeType: 'positive'
    },
    {
      name: 'Số khu phố',
      value: stats.totalDistricts,
      icon: Building,
      color: 'bg-purple-500',
      change: '+2%',
      changeType: 'positive'
    },
    {
      name: 'Yêu cầu chờ duyệt',
      value: stats.pendingRequests,
      icon: AlertCircle,
      color: 'bg-yellow-500',
      change: '+5%',
      changeType: 'negative'
    },
    {
      name: 'Tổng số yêu cầu',
      value: stats.totalRequests,
      icon: FileText,
      color: 'bg-indigo-500',
      change: '+15%',
      changeType: 'positive'
    },
    {
      name: 'Lịch đặt nhà văn hóa',
      value: stats.totalBookings,
      icon: Calendar,
      color: 'bg-pink-500',
      change: '+20%',
      changeType: 'positive'
    }
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Tổng quan hệ thống</h1>
        <p className="mt-1 text-sm text-gray-500">
          Thống kê tổng quan về hệ thống quản lý nhân khẩu và nhà văn hóa
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((card) => (
          <div key={card.name} className="card">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className={`p-3 rounded-md ${card.color}`}>
                  <card.icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">
                    {card.name}
                  </dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {card.value.toLocaleString()}
                    </div>
                    <div className={`ml-2 flex items-baseline text-sm font-semibold ${
                      card.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
                    }`}>
                      <TrendingUp className="self-center flex-shrink-0 h-4 w-4" />
                      <span className="sr-only">
                        {card.changeType === 'positive' ? 'Increased' : 'Decreased'} by
                      </span>
                      {card.change}
                    </div>
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Recent Requests */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Yêu cầu gần đây
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <FileText className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Yêu cầu cập nhật hộ khẩu
                    </p>
                    <p className="text-sm text-gray-500">
                      Nguyễn Văn A - 2 giờ trước
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  Chờ duyệt
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">
                      Đặt lịch nhà văn hóa
                    </p>
                    <p className="text-sm text-gray-500">
                      Trần Thị B - 4 giờ trước
                    </p>
                  </div>
                </div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Đã duyệt
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Thao tác nhanh
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-primary-600" />
                  <span className="ml-3 text-sm font-medium text-primary-900">
                    Thêm hộ khẩu mới
                  </span>
                </div>
                <span className="text-primary-600">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <div className="flex items-center">
                  <Building className="h-5 w-5 text-primary-600" />
                  <span className="ml-3 text-sm font-medium text-primary-900">
                    Quản lý nhà văn hóa
                  </span>
                </div>
                <span className="text-primary-600">→</span>
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors">
                <div className="flex items-center">
                  <FileText className="h-5 w-5 text-primary-600" />
                  <span className="ml-3 text-sm font-medium text-primary-900">
                    Xem yêu cầu chờ duyệt
                  </span>
                </div>
                <span className="text-primary-600">→</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
