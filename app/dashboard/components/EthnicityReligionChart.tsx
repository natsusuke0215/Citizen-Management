'use client'

import { memo, useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts'
import { Users, Heart } from 'lucide-react'

interface EthnicityReligionChartProps {
  ethnicityStats: Record<string, number>
  religionStats: Record<string, number>
  totalPersons: number
}

const COLORS = ['#516089', '#586995', '#7874F9', '#E9B880', '#F1E4D2', '#A8D5BA', '#FFB6C1', '#DDA0DD']

function EthnicityReligionChart({ ethnicityStats, religionStats, totalPersons }: EthnicityReligionChartProps) {
  const [viewMode, setViewMode] = useState<'ethnicity' | 'religion'>('ethnicity')

  const ethnicityData = useMemo(() => {
    return Object.entries(ethnicityStats)
      .map(([name, count]) => ({
        name,
        value: count,
        percentage: totalPersons > 0 ? ((count / totalPersons) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10
  }, [ethnicityStats, totalPersons])

  const religionData = useMemo(() => {
    return Object.entries(religionStats)
      .map(([name, count]) => ({
        name,
        value: count,
        percentage: totalPersons > 0 ? ((count / totalPersons) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10
  }, [religionStats, totalPersons])

  const currentData = viewMode === 'ethnicity' ? ethnicityData : religionData
  const hasData = currentData.length > 0

  return (
    <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
            {viewMode === 'ethnicity' ? (
              <Users className="h-5 w-5 text-white" />
            ) : (
              <Heart className="h-5 w-5 text-white" />
            )}
          </div>
          <h3 className="text-lg font-bold text-gray-900">
            {viewMode === 'ethnicity' ? 'Dân tộc' : 'Tôn giáo'}
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('ethnicity')}
            className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-all ${
              viewMode === 'ethnicity'
                ? 'bg-navy-1 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Dân tộc
          </button>
          <button
            onClick={() => setViewMode('religion')}
            className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-all ${
              viewMode === 'religion'
                ? 'bg-navy-1 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Tôn giáo
          </button>
        </div>
      </div>

      {hasData ? (
        <>
          <div className="mb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={currentData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis type="number" tick={{ fontSize: 12 }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 11 }}
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
                    return [`${val} người (${props.payload.percentage}%)`, 'Số lượng']
                  }}
                />
                <Bar dataKey="value" radius={[0, 12, 12, 0]}>
                  {currentData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 border-t pt-4 max-h-48 overflow-y-auto">
            {currentData.map((item, index) => {
              const percentage = totalPersons > 0 ? (item.value / totalPersons) * 100 : 0
              return (
                <div key={index} className="group">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-700">{item.name}</span>
                    <span className="text-sm font-bold text-gray-900">{item.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-yellow-2 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-navy-1 to-navy-3 h-2 rounded-full transition-all duration-1000 ease-out"
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
          {viewMode === 'ethnicity' ? (
            <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
          ) : (
            <Heart className="h-12 w-12 mx-auto mb-4 opacity-50" />
          )}
          <p>Chưa có dữ liệu {viewMode === 'ethnicity' ? 'dân tộc' : 'tôn giáo'}</p>
        </div>
      )}
    </div>
  )
}

export default memo(EthnicityReligionChart)

