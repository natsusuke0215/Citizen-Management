'use client'

import { memo } from 'react'
import { ArrowRight, ArrowLeft } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

interface MoveInOutCardsProps {
  movedOut: {
    total: number
    thisYear: number
  }
  movedIn: {
    thisYear: number
  }
}

function MoveInOutCards({ movedOut, movedIn }: MoveInOutCardsProps) {
  const currentYear = new Date().getFullYear()

  return (
    <div className="bg-white dark:bg-gray-800 rounded-[20px] shadow-drop p-6 hover:shadow-drop-lg transition-all duration-300 animate-fadeIn border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-6">Chuyển đi / Chuyển đến</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-amber-50 to-amber-100 rounded-[15px] border-2 border-amber-200 hover:border-amber-400 transition-all duration-300 shadow-md hover:shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-200 opacity-20 rounded-full -mr-12 -mt-12"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-amber-500 rounded-[8px]">
                <ArrowRight className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-amber-700">Chuyển đi</span>
            </div>
            <div className="text-4xl font-bold text-amber-600 mb-1">
              <AnimatedCounter value={movedOut.thisYear} />
            </div>
            <div className="text-xs text-amber-600 font-medium">Năm {currentYear}</div>
          </div>
        </div>
        <div className="group relative overflow-hidden p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-[15px] border-2 border-blue-200 hover:border-blue-400 transition-all duration-300 shadow-md hover:shadow-lg">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-200 opacity-20 rounded-full -mr-12 -mt-12"></div>
          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <div className="p-2 bg-blue-500 rounded-[8px]">
                <ArrowLeft className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-700">Chuyển đến</span>
            </div>
            <div className="text-4xl font-bold text-blue-600 mb-1">
              <AnimatedCounter value={movedIn.thisYear} />
            </div>
            <div className="text-xs text-blue-600 font-medium">Năm {currentYear}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(MoveInOutCards)

