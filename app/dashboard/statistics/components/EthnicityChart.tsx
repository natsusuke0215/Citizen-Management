'use client'

import { useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

interface EthnicityChartProps {
  ethnicityStats: Record<string, number>
  total: number
}

const COLORS = ['#516089', '#586995', '#7874F9', '#E9B880', '#F1E4D2', '#C4B5FD', '#A78BFA', '#8B5CF6']

export default function EthnicityChart({ ethnicityStats, total }: EthnicityChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(ethnicityStats)
      .map(([ethnicity, count]) => ({
        name: ethnicity,
        value: count,
        percentage: total > 0 ? ((count / total) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10
  }, [ethnicityStats, total])

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-[20px] shadow-drop p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Phân bố theo dân tộc</h3>
        <p className="text-gray-500 text-center py-8">Không có dữ liệu</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900">Phân bố theo dân tộc</h3>
        <div className="text-xs text-gray-500 bg-yellow-2 px-3 py-1.5 rounded-[8px] font-medium">
          {total} người
        </div>
      </div>
      
      <div className="h-64 mb-4">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percentage }) => `${name}: ${percentage}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-2 border-t pt-4">
        {chartData.map((item, index) => {
          const percentage = total > 0 ? (item.value / total) * 100 : 0
          return (
            <div key={item.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                <span className="text-sm font-bold text-gray-900">{item.value.toLocaleString()}</span>
              </div>
              <div className="w-full bg-yellow-2 rounded-full h-3 overflow-hidden">
                <div
                  className="h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: COLORS[index % COLORS.length]
                  }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

