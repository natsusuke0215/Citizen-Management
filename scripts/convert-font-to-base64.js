/**
 * Script để convert font TTF sang Base64
 * 
 * CÁCH SỬ DỤNG:
 * 1. Đặt file font (ví dụ: Roboto-Regular.ttf) vào thư mục gốc của project
 * 2. Chạy lệnh: node scripts/convert-font-to-base64.js
 * 3. Copy chuỗi Base64 output và paste vào lib/fonts.ts
 */

const fs = require('fs');
const path = require('path');

// Tên file font cần convert (đặt trong thư mục gốc)
const fontFileName = 'Roboto-Regular.ttf';
const fontPath = path.join(__dirname, '..', fontFileName);

try {
  // Kiểm tra file có tồn tại không
  if (!fs.existsSync(fontPath)) {
    console.error(`❌ Không tìm thấy file: ${fontPath}`);
    console.log('\n📝 HƯỚNG DẪN:');
    console.log('1. Tải font Roboto-Regular.ttf từ: https://fonts.google.com/specimen/Roboto');
    console.log('2. Đặt file vào thư mục gốc của project (cùng cấp với package.json)');
    console.log('3. Chạy lại script này');
    process.exit(1);
  }

  // Đọc file và convert sang Base64
  console.log(`📖 Đang đọc file: ${fontFileName}...`);
  const fontBuffer = fs.readFileSync(fontPath);
  const fontBase64 = fontBuffer.toString('base64');

  console.log(`✅ Convert thành công!`);
  console.log(`📏 Độ dài chuỗi Base64: ${fontBase64.length} ký tự`);
  console.log('\n' + '='.repeat(80));
  console.log('📋 CHUỖI BASE64 (copy toàn bộ và paste vào lib/fonts.ts):');
  console.log('='.repeat(80));
  console.log(fontBase64);
  console.log('='.repeat(80));
  console.log('\n📝 BƯỚC TIẾP THEO:');
  console.log('1. Copy toàn bộ chuỗi Base64 ở trên');
  console.log('2. Mở file lib/fonts.ts');
  console.log('3. Tìm biến ROBOTO_REGULAR_BASE64');
  console.log('4. Thay thế nội dung giữa dấu backtick bằng chuỗi Base64 vừa copy');
  console.log('5. Lưu file và test lại');

  // Lưu vào file output (tùy chọn)
  const outputPath = path.join(__dirname, '..', 'font-base64-output.txt');
  fs.writeFileSync(outputPath, fontBase64);
  console.log(`\n💾 Đã lưu chuỗi Base64 vào: ${outputPath}`);
  console.log('   (Bạn có thể mở file này để copy nếu cần)');

} catch (error) {
  console.error('❌ Lỗi khi convert font:', error.message);
  process.exit(1);
}

