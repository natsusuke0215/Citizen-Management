'use client'

import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

interface DistrictChartProps {
  districtStats: Record<string, number>
  total: number
}

const COLORS = ['#516089', '#586995', '#7874F9', '#E9B880', '#F1E4D2']

export default function DistrictChart({ districtStats, total }: DistrictChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(districtStats)
      .map(([district, count]) => ({
        district,
        count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.count - a.count)
  }, [districtStats, total])

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-[20px] shadow-drop p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Phân bố theo khu phố</h3>
        <p className="text-gray-500 text-center py-8">Không có dữ liệu</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Phân bố theo khu phố</h3>
        <div className="text-xs text-gray-500 bg-yellow-2 px-3 py-1.5 rounded-[8px] font-medium">
          {total} người
        </div>
      </div>
      
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis type="number" tick={{ fontSize: 12 }} />
            <YAxis 
              dataKey="district" 
              type="category" 
              tick={{ fontSize: 12 }}
              width={120}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
              }}
              formatter={(value: number | undefined, _name: string | undefined, props: any) => {
                const val = value || 0
                return [
                  `${val} người (${props.payload.percentage}%)`,
                  'Số lượng'
                ]
              }}
            />
            <Bar dataKey="count" radius={[0, 12, 12, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

