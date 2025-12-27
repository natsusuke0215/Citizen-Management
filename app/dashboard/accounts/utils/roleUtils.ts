import { UserRole } from '@/lib/types'

export const getRoleLabel = (role: UserRole): string => {
  const roleLabels: Record<UserRole, string> = {
    [UserRole.TEAM_LEADER]: 'Tổ trưởng',
    [UserRole.DEPUTY]: 'Tổ phó',
    [UserRole.FACILITY_MANAGER]: 'Quản lý CSVC',
    [UserRole.CALENDAR_MANAGER]: 'Quản lý lịch',
    [UserRole.ADMIN]: 'Quản trị viên'
  }
  return roleLabels[role] || role
}

export const getRoleBadgeColor = (role: UserRole): string => {
  const colors: Record<UserRole, string> = {
    [UserRole.TEAM_LEADER]: 'bg-red-100 text-red-800',
    [UserRole.DEPUTY]: 'bg-indigo-100 text-indigo-800',
    [UserRole.FACILITY_MANAGER]: 'bg-green-100 text-green-800',
    [UserRole.CALENDAR_MANAGER]: 'bg-blue-100 text-blue-800',
    [UserRole.ADMIN]: 'bg-yellow-100 text-yellow-800'
  }
  return colors[role] || 'bg-gray-100 text-gray-800'
}

