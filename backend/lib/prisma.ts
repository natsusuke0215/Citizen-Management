import { PrismaClient } from '@prisma/client'

const DEFAULT_DB_URL = 'file:./database/dev.db'

if (!process.env.DATABASE_URL || process.env.DATABASE_URL === 'file:./prisma/dev.db') {
  process.env.DATABASE_URL = DEFAULT_DB_URL
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[Prisma] DATABASE_URL chưa được cấu hình đúng. Đang sử dụng mặc định:', DEFAULT_DB_URL)
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
