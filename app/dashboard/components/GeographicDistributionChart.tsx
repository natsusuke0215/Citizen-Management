'use client'

import { memo, useMemo, useState } from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts'
import { MapPin, Building } from 'lucide-react'

interface GeographicDistributionChartProps {
  districtStats: Record<string, { name: string; count: number; households: number }>
  wardStats: Record<string, number>
  totalPersons: number
}

const DISTRICT_COLORS = ['#516089', '#586995', '#7874F9', '#E9B880', '#F1E4D2', '#A8D5BA', '#FFB6C1', '#DDA0DD']

function GeographicDistributionChart({ districtStats, wardStats, totalPersons }: GeographicDistributionChartProps) {
  const [viewMode, setViewMode] = useState<'district' | 'ward'>('district')

  const districtChartData = useMemo(() => {
    return Object.entries(districtStats)
      .filter(([, stats]) => stats.count > 0)
      .map(([id, stats]) => ({
        name: stats.name,
        value: stats.count,
        households: stats.households,
        percentage: totalPersons > 0 ? ((stats.count / totalPersons) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value)
  }, [districtStats, totalPersons])

  const wardChartData = useMemo(() => {
    return Object.entries(wardStats)
      .map(([ward, count]) => ({
        name: ward,
        value: count,
        percentage: totalPersons > 0 ? ((count / totalPersons) * 100).toFixed(1) : '0'
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10) // Top 10 phường
  }, [wardStats, totalPersons])

  const currentData = viewMode === 'district' ? districtChartData : wardChartData

  return (
    <div className="bg-white rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-navy-1 to-navy-2 rounded-[10px]">
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">Phân bố địa lý</h3>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('district')}
            className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-all flex items-center gap-2 ${
              viewMode === 'district'
                ? 'bg-navy-1 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Building className="h-4 w-4" />
            Khu phố
          </button>
          <button
            onClick={() => setViewMode('ward')}
            className={`px-3 py-1.5 rounded-[8px] text-sm font-medium transition-all ${
              viewMode === 'ward'
                ? 'bg-navy-1 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Phường/Xã
          </button>
        </div>
      </div>

      {currentData.length > 0 ? (
        <>
          <div className="mb-6 h-64">
            <ResponsiveContainer width="100%" height="100%">
              {viewMode === 'district' ? (
                <PieChart>
                  <Pie
                    data={currentData}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percentage }: any) => `${name}: ${percentage}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {currentData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DISTRICT_COLORS[index % DISTRICT_COLORS.length]}
                      />
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
                      const households = props.payload?.households || 0
                      return [
                        `${val} người (${props.payload.percentage}%)${households > 0 ? ` - ${households} hộ` : ''}`,
                        'Số lượng'
                      ]
                    }}
                  />
                </PieChart>
              ) : (
                <BarChart data={currentData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="name" 
                    tick={{ fontSize: 11 }}
                    angle={-45}
                    textAnchor="end"
                    height={100}
                  />
                  <YAxis tick={{ fontSize: 12 }} />
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
                  <Bar dataKey="value" radius={[12, 12, 0, 0]}>
                    {currentData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={DISTRICT_COLORS[index % DISTRICT_COLORS.length]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              )}
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
                  <div className="text-xs text-gray-500 mt-1">
                    {percentage.toFixed(1)}% {viewMode === 'district' && item.households > 0 && `• ${item.households} hộ`}
                  </div>
                </div>
              )
            })}
          </div>
        </>
      ) : (
        <div className="text-center py-12 text-gray-500">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Chưa có dữ liệu phân bố địa lý</p>
        </div>
      )}
    </div>
  )
}

export default memo(GeographicDistributionChart)

