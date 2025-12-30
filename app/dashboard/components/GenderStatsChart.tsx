'use client'

import { memo, useMemo } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'

interface GenderStatsChartProps {
  genderStats: {
    'Nam': number
    'Nữ': number
    'Khác': number
  }
  totalPersons: number
}

const GENDER_COLORS: Record<string, string> = {
  'Nam': '#516089',
  'Nữ': '#7874F9',
  'Khác': '#E9B880'
}

function GenderStatsChart({ genderStats, totalPersons }: GenderStatsChartProps) {
  const chartData = useMemo(() => {
    return Object.entries(genderStats)
      .filter(([, count]) => count > 0)
      .map(([gender, count]) => ({
        name: gender,
        value: count,
        percentage: totalPersons > 0 ? ((count / totalPersons) * 100).toFixed(1) : 0
      }))
  }, [genderStats, totalPersons])

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn border border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">Phân bố theo giới tính</h3>
        <div className="text-xs text-gray-500 dark:text-gray-300 bg-yellow-2 dark:bg-navy-1/30 px-3 py-1.5 rounded-[8px] font-medium">
          {totalPersons} người
        </div>
      </div>

      <div className="mb-6 h-64 flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={true}
              label={({ name, cx, cy, midAngle, outerRadius, payload }: any) => {
                if (!midAngle || !outerRadius) return null
                const RADIAN = Math.PI / 180
                const radius = outerRadius + 25
                const x = cx + radius * Math.cos(-midAngle * RADIAN)
                const y = cy + radius * Math.sin(-midAngle * RADIAN)
                const percentage = payload?.percentage || '0'
                
                return (
                  <text
                    x={x}
                    y={y}
                    fill="var(--label-text, #374151)"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                    className="text-sm font-semibold"
                  >
                    {`${name}: ${percentage}%`}
                  </text>
                )
              }}
              outerRadius={90}
              fill="#8884d8"
              dataKey="value"
            >
              {chartData.map((item, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={GENDER_COLORS[item.name] || GENDER_COLORS['Khác']}
                />
              ))}
            </Pie>
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
          </PieChart>
        </ResponsiveContainer>
      </div>

      <div className="space-y-3 border-t border-gray-200 dark:border-gray-700 pt-4">
        {Object.entries(genderStats).map(([gender, count]) => {
          const percentage = totalPersons > 0 ? (count / totalPersons) * 100 : 0
          const colorClass = gender === 'Nam' ? 'from-navy-1 to-navy-2' : gender === 'Nữ' ? 'from-navy-3 to-navy-2' : 'from-yellow-1 to-yellow-2'
          return (
            <div key={gender} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{gender}</span>
                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{count.toLocaleString()}</span>
              </div>
              <div className="w-full bg-yellow-2 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
                <div
                  className={`bg-gradient-to-r ${colorClass} h-3 rounded-full transition-all duration-1000 ease-out`}
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

export default memo(GenderStatsChart)

