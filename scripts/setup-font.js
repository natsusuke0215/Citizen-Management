/**
 * Script để tải và convert font Roboto sang Base64
 * Chạy: node scripts/setup-font.js
 */

const fs = require('fs');
const https = require('https');
const path = require('path');

// Try multiple possible URLs
const fontUrls = [
  'https://fonts.gstatic.com/s/roboto/v30/KFOmCnqEu92Fr1Mu4mxP.ttf',
  'https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf',
  'https://raw.githubusercontent.com/google/fonts/main/apache/roboto/static/Roboto-Regular.ttf'
];
const fontUrl = fontUrls[0]; // Use first URL
const fontPath = path.join(__dirname, 'Roboto-Regular.ttf');
const outputPath = path.join(__dirname, 'font-base64-output.txt');

console.log('📥 Đang tải font Roboto-Regular.ttf...');

// Download font
const file = fs.createWriteStream(fontPath);
https.get(fontUrl, (response) => {
  if (response.statusCode === 200) {
    response.pipe(file);
    file.on('finish', () => {
      file.close();
      console.log('✅ Đã tải font thành công!');
      convertFont();
    });
  } else if (response.statusCode === 302 || response.statusCode === 301) {
    // Handle redirect
    file.close();
    fs.unlinkSync(fontPath);
    console.log('⚠️ Đang chuyển hướng, thử lại...');
    https.get(response.headers.location, (redirectResponse) => {
      redirectResponse.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('✅ Đã tải font thành công!');
        convertFont();
      });
    });
  } else {
    file.close();
    fs.unlinkSync(fontPath);
    console.error('❌ Lỗi khi tải font:', response.statusCode);
    showManualInstructions();
  }
}).on('error', (err) => {
  file.close();
  if (fs.existsSync(fontPath)) {
    fs.unlinkSync(fontPath);
  }
  console.error('❌ Lỗi kết nối:', err.message);
  showManualInstructions();
});

function convertFont() {
  try {
    console.log('🔄 Đang convert sang Base64...');
    
    const fontBuffer = fs.readFileSync(fontPath);
    const fontBase64 = fontBuffer.toString('base64');
    
    fs.writeFileSync(outputPath, fontBase64, 'utf8');
    
    console.log('✅ Convert thành công!');
    console.log('');
    console.log('📄 File output:', outputPath);
    console.log('📊 Kích thước:', (fontBase64.length / 1024).toFixed(2), 'KB');
    console.log('');
    console.log('📋 Bước tiếp theo:');
    console.log('1. Mở file lib/fonts.ts');
    console.log('2. Thay thế toàn bộ nội dung trong ROBOTO_REGULAR_BASE64 bằng nội dung từ font-base64-output.txt');
    console.log('3. Xóa các dòng DEMO_BASE64_STRING_PLACEHOLDER');
    console.log('4. Lưu file và test lại PDF');
    
    // Auto-update fonts.ts if possible
    updateFontsFile(fontBase64);
  } catch (error) {
    console.error('❌ Lỗi khi convert:', error.message);
  }
}

function updateFontsFile(fontBase64) {
  try {
    const fontsFilePath = path.join(__dirname, '..', 'lib', 'fonts.ts');
    let fontsContent = fs.readFileSync(fontsFilePath, 'utf8');
    
    // Replace the placeholder with actual base64
    const newContent = `export const ROBOTO_REGULAR_BASE64 = \`${fontBase64}\`.trim()`;
    
    // Find and replace the ROBOTO_REGULAR_BASE64 section
    const regex = /export const ROBOTO_REGULAR_BASE64 = `[\s\S]*?`\.trim\(\)/;
    if (regex.test(fontsContent)) {
      fontsContent = fontsContent.replace(regex, newContent);
      fs.writeFileSync(fontsFilePath, fontsContent, 'utf8');
      console.log('');
      console.log('✨ Đã tự động cập nhật lib/fonts.ts!');
      console.log('✅ Bạn có thể test PDF ngay bây giờ.');
    } else {
      console.log('');
      console.log('⚠️ Không thể tự động cập nhật. Vui lòng cập nhật thủ công.');
    }
  } catch (error) {
    console.log('');
    console.log('⚠️ Không thể tự động cập nhật lib/fonts.ts:', error.message);
    console.log('Vui lòng cập nhật thủ công.');
  }
}

function showManualInstructions() {
  console.log('');
  console.log('💡 Cách thủ công:');
  console.log('1. Tải font từ: https://fonts.google.com/specimen/Roboto');
  console.log('   Hoặc: https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf');
  console.log('2. Đặt file vào: scripts/Roboto-Regular.ttf');
  console.log('3. Chạy lại: node scripts/setup-font.js');
  console.log('   Hoặc: node scripts/convert-font.js');
}

