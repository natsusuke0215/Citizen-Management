export enum UserRole {
  TEAM_LEADER = 'TEAM_LEADER',        // Tổ trưởng (gộp từ ADMIN và LEADER)
  DEPUTY = 'DEPUTY',                  // Tổ phó
  FACILITY_MANAGER = 'FACILITY_MANAGER', // Quản lý CSVC (Nhà văn hóa)
  CALENDAR_MANAGER = 'CALENDAR_MANAGER',  // Quản lý lịch (Calendar)
  ADMIN = 'ADMIN'                     // Quản trị viên (Admin)
}

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  createdAt: string
  updatedAt: string
}

export interface CreateUserData {
  email: string
  password: string
  name: string
  role: UserRole
}

export interface UpdateUserRoleData {
  role: UserRole
}

