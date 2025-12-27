import jwt from 'jsonwebtoken'
import { prisma } from './prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export interface UserPayload {
  id: string
  email: string
  name: string
  role: string
}

// Plain text password comparison (no hashing)
export function verifyPassword(password: string, storedPassword: string): boolean {
  return password === storedPassword
}

export function generateToken(payload: UserPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): UserPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserPayload
  } catch {
    return null
  }
}

// Hàm an toàn dùng cho Middleware (chỉ decode, không verify signature để tránh lỗi trên Edge)
export function decodeTokenOnly(token: string): UserPayload | null {
  try {
    return jwt.decode(token) as UserPayload
  } catch {
    return null
  }
}

export async function authenticateUser(email: string, password: string) {
  const user = await prisma.user.findUnique({
    where: { email }
  })

  if (!user || !verifyPassword(password, user.password)) {
    return null
  }

  const { password: _, ...userWithoutPassword } = user
  return userWithoutPassword
}

export async function createUser(email: string, password: string, name: string, role: string = 'USER') {
  // Store password as plain text (no hashing)
  return prisma.user.create({
    data: {
      email,
      password: password, // Plain text password
      name,
      role
    }
  })
}
