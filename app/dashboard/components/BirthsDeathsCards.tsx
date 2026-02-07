'use client'

import { memo } from 'react'
import { Baby, Skull } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

interface BirthsDeathsCardsProps {
  births: {
    total: number
    thisYear: number
  }
  deaths: {
    total: number
    thisYear: number
  }
}

function BirthsDeathsCards({ births, deaths }: BirthsDeathsCardsProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Sinh tử</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-[15px] border-2 border-emerald-200 hover:border-emerald-400 transition-all duration-300 shadow-md hover:shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-200 opacity-20 rounded-full -mr-12 -mt-12"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-emerald-500 rounded-[8px]">
                <Baby className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-emerald-700">Sinh</span>
            </div>
            <div className="text-4xl font-bold text-emerald-600 mb-1">
              <AnimatedCounter value={births.thisYear} />
            </div>
            <div className="text-xs text-emerald-600 font-medium">Năm {currentYear}</div>
            {births.total > 0 && (
              <div className="text-xs text-emerald-500 mt-2 pt-2 border-t border-emerald-200">
                Tổng: {births.total.toLocaleString()}
              </div>
            )}
          </div>
        </div>
        <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-[15px] border-2 border-gray-200 hover:border-gray-400 transition-all duration-300 shadow-md hover:shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gray-200 opacity-20 rounded-full -mr-12 -mt-12"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-gray-500 rounded-[8px]">
                <Skull className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-gray-700">Tử</span>
            </div>
            <div className="text-4xl font-bold text-gray-600 mb-1">
              <AnimatedCounter value={deaths.thisYear} />
            </div>
            <div className="text-xs text-gray-600 font-medium">Năm {currentYear}</div>
            {deaths.total > 0 && (
              <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-200">
                Tổng: {deaths.total.toLocaleString()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(BirthsDeathsCards)

