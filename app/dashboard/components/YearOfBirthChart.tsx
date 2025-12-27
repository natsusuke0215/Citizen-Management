'use client'

import { memo, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts'
import { Calendar, Filter } from 'lucide-react'

interface YearOfBirthChartProps {
  birthYearStats: Record<number, { total: number; male: number; female: number }>
  totalPersons: number
}

const COLORS = {
  male: '#516089',
  female: '#7874F9',
  total: '#E9B880'
}

function YearOfBirthChart({ birthYearStats, totalPersons }: YearOfBirthChartProps) {
  const [viewMode, setViewMode] = useState<'total' | 'gender'>('total')

  const chartData = useMemo(() => {
    const entries = Object.entries(birthYearStats)
      .map(([year, stats]) => ({
        year: parseInt(year),
        total: stats.total,
        male: stats.male,
        female: stats.female
      }))
      .sort((a, b) => a.year - b.year)
      .slice(-20) // Hiển thị 20 năm gần nhất

    return entries
  }, [birthYearStats])

  const totalByYear = useMemo(() => {
    return Object.values(birthYearStats).reduce((sum, stats) => sum + stats.total, 0)
  }, [birthYearStats])

  return (
    <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
            <Calendar className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Phân bố theo năm sinh</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('total')}
            className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-all ${
              viewMode === 'total'
                ? 'bg-navy-1 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tổng
          </button>
          <button
            onClick={() => setViewMode('gender')}
            className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-all ${
              viewMode === 'gender'
                ? 'bg-navy-1 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Theo giới tính
          </button>
        </div>
      </div>

      <div className="mb-6 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="year" 
              tick={{ fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number | undefined) => {
                return [`${value || 0} người`, '']
              }}
            />
            {viewMode === 'total' ? (
              <Bar dataKey="total" radius={[12, 12, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS.total} />
                ))}
              </Bar>
            ) : (
              <>
                <Bar dataKey="male" stackId="a" radius={[0, 0, 0, 0]} fill={COLORS.male} />
                <Bar dataKey="female" stackId="a" radius={[12, 12, 0, 0]} fill={COLORS.female} />
                <Legend
                  wrapperStyle={{ paddingTop: '20px' }}
                  formatter={(value) => {
                    if (value === 'male') return 'Nam'
                    if (value === 'female') return 'Nữ'
                    return value
                  }}
                />
              </>
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 border-t pt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-gray-700">Tổng số người có dữ liệu năm sinh</span>
          <span className="font-bold text-gray-900">{totalByYear.toLocaleString()}</span>
        </div>
        <div className="text-xs text-gray-500 bg-yellow-2 px-3 py-2 rounded-[8px]">
          💡 <strong>Mẹo:</strong> Click vào biểu đồ để xem chi tiết. Có thể tìm kiếm "Nam giới sinh năm 1982" bằng cách xem biểu đồ theo giới tính.
        </div>
      </div>
    </div>
  )
}

export default memo(YearOfBirthChart)

