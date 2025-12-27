'use client'

import { memo } from 'react'
import { LucideIcon } from 'lucide-react'
import AnimatedCounter from './AnimatedCounter'

interface StatsCardProps {
  title: string
  value: number | string
  subtitle?: string
  icon: LucideIcon
  gradient: string
  iconBg: string
  delay?: string
  useCounter?: boolean
  textColor?: string
}

function StatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  gradient,
  iconBg,
  delay = '0s',
  useCounter = true,
  textColor = 'text-white'
}: StatsCardProps) {
  return (
    <div
      className={`group relative overflow-hidden ${gradient} rounded-[20px] shadow-drop hover:shadow-drop-lg transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.02] animate-slideUp`}
      style={{ animationDelay: delay }}
    >
      <div className="absolute top-0 right-0 w-40 h-40 bg-white opacity-10 rounded-full -mr-20 -mt-20 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-white opacity-5 rounded-full -ml-16 -mb-16"></div>
      <div className={`relative p-6 ${textColor}`}>
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 ${iconBg} rounded-[12px] backdrop-blur-sm group-hover:rotate-12 transition-transform duration-300`}>
            <Icon className="h-7 w-7" />
          </div>
          <Icon className="h-5 w-5 opacity-80" />
        </div>
        <div className={`text-5xl font-bold mb-2 ${textColor}`}>
          {useCounter && typeof value === 'number' ? (
            <AnimatedCounter value={value} />
          ) : (
            value
          )}
        </div>
        <div className={`text-sm opacity-90 font-medium ${textColor}`}>{title}</div>
        {subtitle && <div className={`mt-2 text-xs opacity-75 ${textColor}`}>{subtitle}</div>}
      </div>
    </div>
  )
}

export default memo(StatsCard)
