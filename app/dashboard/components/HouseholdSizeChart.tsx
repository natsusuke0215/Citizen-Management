'use client'

import { memo, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Home } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

interface HouseholdSizeChartProps {
  householdSizeStats: Record<number, number>
  totalHouseholds: number
}

const COLORS = ['#516089', '#586995', '#7874F9', '#E9B880', '#F1E4D2']

function HouseholdSizeChart({ householdSizeStats, totalHouseholds }: HouseholdSizeChartProps) {
  const chartData = useMemo(() => {
    const maxSize = Math.max(...Object.keys(householdSizeStats).map(Number), 5)
    const data = []
    
    for (let i = 1; i <= maxSize; i++) {
      data.push({
        size: i,
        count: householdSizeStats[i] || 0,
        label: i === 1 ? '1 người' : `${i} người`
      })
    }
    
    return data.filter(item => item.count > 0)
  }, [householdSizeStats])

  const averageSize = useMemo(() => {
    const totalPersons = Object.entries(householdSizeStats).reduce(
      (sum, [size, count]) => sum + Number(size) * count,
      0
    )
    return totalHouseholds > 0 ? (totalPersons / totalHouseholds).toFixed(1) : '0'
  }, [householdSizeStats, totalHouseholds])

  return (
    <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
            <Home className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Phân bố kích thước hộ khẩu</h3>
        </div>
        <div className="text-xs text-gray-500 bg-yellow-2 px-3 py-1.5 rounded-[8px] font-medium">
          TB: <AnimatedCounter value={parseFloat(averageSize)} duration={1000} /> người/hộ
        </div>
      </div>

      {chartData.length > 0 ? (
        <>
          <div className="mb-6 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="label" 
                  tick={{ fontSize: 12 }}
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
                    const val = value || 0
                    const percentage = totalHouseholds > 0 ? ((val / totalHouseholds) * 100).toFixed(1) : '0'
                    return [`${val} hộ (${percentage}%)`, 'Số lượng']
                  }}
                />
                <Bar dataKey="count" radius={[12, 12, 0, 0]}>
                  {chartData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-3 border-t pt-4">
            {chartData.map((item, index) => {
              const percentage = totalHouseholds > 0 ? (item.count / totalHouseholds) * 100 : 0
              return (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-gray-700">{item.label}</span>
                    <span className="text-sm font-bold text-gray-900">{item.count.toLocaleString()} hộ</span>
                  </div>
                  <div className="w-full bg-yellow-2 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-navy-1 to-navy-3 h-3 rounded-full transition-all duration-1000 ease-out"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{percentage.toFixed(1)}%</div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <Home className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có dữ liệu kích thước hộ khẩu</p>
        </div>
      )}
    </div>
  )
}

export default memo(HouseholdSizeChart)

