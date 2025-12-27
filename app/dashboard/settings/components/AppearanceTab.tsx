'use client'

import { Palette, Sun, Moon, Monitor } from 'lucide-react'

interface AppearanceTabProps {
  theme: string | undefined
  mounted: boolean
  onThemeChange: (theme: 'light' | 'dark' | 'system') => void
}

export default function AppearanceTab({ theme, mounted, onThemeChange }: AppearanceTabProps) {
  const themeOptions = [
    { value: 'light', label: 'Sáng', icon: Sun },
    { value: 'dark', label: 'Tối', icon: Moon },
    { value: 'system', label: 'Tự động', icon: Monitor }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-[15px] shadow-drop p-6">
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Palette className="h-6 w-6 text-navy-1" />
            Giao diện
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Tùy chỉnh giao diện và trải nghiệm của bạn
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Chủ đề
            </label>
            <div className="grid grid-cols-3 gap-4">
              {themeOptions.map((option) => {
                const Icon = option.icon
                const isActive = mounted && theme === option.value
                return (
                  <button
                    key={option.value}
                    onClick={() => onThemeChange(option.value as 'light' | 'dark' | 'system')}
                    className={`p-4 rounded-[10px] border-2 transition-all ${
                      isActive
                        ? 'border-navy-1 bg-navy-1/10 dark:bg-navy-1/20'
                        : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                    }`}
                  >
                    <Icon className={`h-6 w-6 mx-auto mb-2 ${isActive ? 'text-navy-1' : 'text-gray-400 dark:text-gray-500'}`} />
                    <p className={`text-sm font-medium ${isActive ? 'text-navy-1 dark:text-navy-3' : 'text-gray-700 dark:text-gray-300'}`}>
                      {option.label}
                    </p>
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

