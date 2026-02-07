import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🔄 Bắt đầu cập nhật mật khẩu thành plain text...')

  // Known passwords from seed file
  const knownPasswords: Record<string, string> = {
    'admin@example.com': 'admin123',
    'user@example.com': 'user123',
    'totruong@gmail.com': '123456',
    'topho@gmail.com': '123456',
    'quanlycsvc@gmail.com': '123456',
  }

  // Default password for accounts not in known list
  const DEFAULT_PASSWORD = '123456'

  // Get all users
  const users = await prisma.user.findMany()

  let updatedCount = 0
  let skippedCount = 0
  let resetCount = 0

  for (const user of users) {
    // Check if password is hashed (starts with bcrypt prefix)
    if (user.password.startsWith('$2b$') || user.password.startsWith('$2a$')) {
      console.log(`\n📝 Tìm thấy mật khẩu đã hash cho: ${user.email}`)
      
      // Try to find known password
      const knownPassword = knownPasswords[user.email]
      
      if (knownPassword) {
        // Verify the hash matches the known password
        const isValid = await bcrypt.compare(knownPassword, user.password)
        
        if (isValid) {
          // Update to plain text
          await prisma.user.update({
            where: { id: user.id },
            data: { password: knownPassword }
          })
          console.log(`✅ Đã cập nhật mật khẩu cho ${user.email} thành plain text: ${knownPassword}`)
          updatedCount++
        } else {
          // Hash doesn't match, try common passwords or reset
          console.log(`⚠️  Mật khẩu hash không khớp với mật khẩu đã biết cho ${user.email}`)
          
          // Try default password
          const isValidDefault = await bcrypt.compare(DEFAULT_PASSWORD, user.password)
          if (isValidDefault) {
            await prisma.user.update({
              where: { id: user.id },
              data: { password: DEFAULT_PASSWORD }
            })
            console.log(`✅ Đã đặt lại mật khẩu cho ${user.email} thành: ${DEFAULT_PASSWORD}`)
            resetCount++
          } else {
            // Reset to default password
            await prisma.user.update({
              where: { id: user.id },
              data: { password: DEFAULT_PASSWORD }
            })
            console.log(`🔄 Đã đặt lại mật khẩu cho ${user.email} thành mật khẩu mặc định: ${DEFAULT_PASSWORD}`)
            console.log(`   (Mật khẩu cũ không khớp với bất kỳ mật khẩu đã biết nào)`)
            resetCount++
          }
        }
      } else {
        // Unknown user, try to verify with default password or reset
        console.log(`⚠️  Không tìm thấy mật khẩu đã biết cho ${user.email}`)
        
        // Try default password
        const isValidDefault = await bcrypt.compare(DEFAULT_PASSWORD, user.password)
        if (isValidDefault) {
          await prisma.user.update({
            where: { id: user.id },
            data: { password: DEFAULT_PASSWORD }
          })
          console.log(`✅ Đã cập nhật mật khẩu cho ${user.email} thành plain text: ${DEFAULT_PASSWORD}`)
          updatedCount++
        } else {
          // Reset to default password
          await prisma.user.update({
            where: { id: user.id },
            data: { password: DEFAULT_PASSWORD }
          })
          console.log(`🔄 Đã đặt lại mật khẩu cho ${user.email} thành mật khẩu mặc định: ${DEFAULT_PASSWORD}`)
          resetCount++
        }
      }
    } else {
      console.log(`✓ Mật khẩu của ${user.email} đã là plain text`)
      skippedCount++
    }
  }

  console.log('\n📊 Tóm tắt:')
  console.log(`   ✅ Đã cập nhật: ${updatedCount} tài khoản`)
  console.log(`   🔄 Đã đặt lại: ${resetCount} tài khoản`)
  console.log(`   ✓ Đã bỏ qua: ${skippedCount} tài khoản (đã là plain text)`)
  console.log('\n✅ Hoàn tất cập nhật mật khẩu!')
  console.log('\n💡 Lưu ý: Các tài khoản được đặt lại mật khẩu có thể đăng nhập bằng mật khẩu mặc định: 123456')
}

main()
  .catch((e) => {
    console.error('❌ Lỗi khi cập nhật mật khẩu:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

