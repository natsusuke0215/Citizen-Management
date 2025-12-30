'use client'

import { memo, useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell, ResponsiveContainer } from 'recharts'

interface AgeGroupsChartProps {
  ageGroups: {
    '0-17': number
    '18-30': number
    '31-50': number
    '51-65': number
    '65+': number
  }
  totalPersons: number
}

const COLORS = ['#516089', '#586995', '#7874F9', '#E9B880', '#F1E4D2']

function AgeGroupsChart({ ageGroups, totalPersons }: AgeGroupsChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(ageGroups).map(([age, count]) => ({
      name: age.replace('-', '-'),
      value: count,
      percentage: totalPersons > 0 ? ((count / totalPersons) * 100).toFixed(1) : 0
    }))
  }, [ageGroups, totalPersons])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Phân bố theo độ tuổi</h3>
        <div className="text-xs text-gray-500 dark:text-gray-300 bg-yellow-2 dark:bg-navy-1/30 px-3 py-1.5 rounded-[8px] font-medium">
          {totalPersons} người
        </div>
      </div>
      
      <div className="mb-6 h-56">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" className="dark:stroke-gray-700" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: 'var(--axis-text, #374151)' }} />
            <YAxis tick={{ fontSize: 12, fill: 'var(--axis-text, #374151)' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--tooltip-bg, white)',
                border: '1px solid var(--tooltip-border, #e5e7eb)',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                color: 'var(--tooltip-text, #111827)'
              }}
              formatter={(value: number | undefined, _name: string | undefined, props: any) => {
                const val = value || 0
                return [
                  `${val} người (${props.payload.percentage}%)`,
                  'Số lượng'
                ]
              }}
            />
            <Bar dataKey="value" radius={[12, 12, 0, 0]}>
              {chartData.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index] || COLORS[0]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
        {Object.entries(ageGroups).map(([age, count], index) => {
          const percentage = totalPersons > 0 ? (count / totalPersons) * 100 : 0
          return (
            <div key={age} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{age} tuổi</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{count.toLocaleString()}</span>
              </div>
              <div className="w-full bg-yellow-2 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-navy-1 to-navy-3 h-3 rounded-full transition-all duration-1000 ease-out"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{percentage.toFixed(1)}%</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default memo(AgeGroupsChart)

