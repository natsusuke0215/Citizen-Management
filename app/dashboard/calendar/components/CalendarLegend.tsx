'use client'

export default function CalendarLegend() {
  return (
    <div className="mt-8 flex flex-wrap gap-4">
      <div className="flex items-center">
        <div className="w-4 h-4 bg-green-100 border-2 border-green-300 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Trống</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-red-100 border-2 border-red-300 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Đã đặt (công khai)</span>
      </div>
      <div className="flex items-center">
        <div className="w-4 h-4 bg-gray-100 border-2 border-gray-300 rounded mr-2"></div>
        <span className="text-sm text-gray-600">Đã đặt (riêng tư)</span>
      </div>
    </div>
  )
}

