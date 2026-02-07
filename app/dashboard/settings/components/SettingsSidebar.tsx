'use client'

import { User, Lock, Bell } from 'lucide-react'

interface Tab {
  id: string
  name: string
  icon: React.ComponentType<{ className?: string }>
}

interface SettingsSidebarProps {
  activeTab: string
  onTabChange: (tabId: string) => void
}

const tabs: Tab[] = [
  { id: 'profile', name: 'Hồ sơ', icon: User },
  { id: 'security', name: 'Bảo mật', icon: Lock },
  { id: 'notifications', name: 'Thông báo', icon: Bell }
]

export default function SettingsSidebar({ activeTab, onTabChange }: SettingsSidebarProps) {
  return (
    <div className="bg-white rounded-[15px] shadow-drop p-4 space-y-2">
      {tabs.map((tab) => {
        const Icon = tab.icon
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-[10px] transition-all duration-200 ${
              isActive
                ? 'bg-gradient-to-r from-navy-1 to-navy-2 text-white shadow-drop'
                : 'text-gray-700 hover:bg-gray-50'
            }`}
          >
            <Icon className="h-5 w-5" />
            <span className="font-medium">{tab.name}</span>
          </button>
        )
      })}
    </div>
  )
}

