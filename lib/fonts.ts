/**
 * Font Base64 cho jsPDF
 * 
 * HƯỚNG DẪN CONVERT FONT TTF SANG BASE64:
 * 
 * CÁCH 1: Sử dụng Node.js script
 * Tạo file convert-font.js:
 * 
 * const fs = require('fs');
 * const fontPath = './Roboto-Regular.ttf'; // Đường dẫn đến file font
 * const fontBase64 = fs.readFileSync(fontPath, 'base64');
 * console.log('Font Base64:');
 * console.log(fontBase64);
 * 
 * Chạy: node convert-font.js > font-output.txt
 * 
 * CÁCH 2: Sử dụng tool online
 * - https://everythingfonts.com/base64
 * - https://www.fontsquirrel.com/tools/webfont-generator
 * - https://base64.guru/converter/encode/file
 * 
 * CÁCH 3: Sử dụng PowerShell (Windows)
 * [Convert]::ToBase64String([IO.File]::ReadAllBytes("Roboto-Regular.ttf"))
 * 
 * CÁCH 4: Sử dụng command line (Linux/Mac)
 * base64 -i Roboto-Regular.ttf -o font-base64.txt
 * 
 * SAU KHI CÓ CHUỖI BASE64:
 * 1. Copy toàn bộ chuỗi Base64 (rất dài, có thể hàng nghìn dòng)
 * 2. Paste vào biến ROBOTO_REGULAR_BASE64 bên dưới
 * 3. Lưu file và sử dụng
 */

// ============================================
// DEMO BASE64 (GIẢ LẬP - CHỈ ĐỂ THAM KHẢO)
// ============================================
// Đây chỉ là một phần nhỏ của chuỗi Base64 thật
// Font thật sẽ có hàng nghìn ký tự Base64
// Ví dụ: "AAEAAAAOAIAAAwBgT1MvMj3hSQEAAADsAAAATmNtYXDQEhm3AAABPAAAAUpjdnQgBkQFRgAAApQAAAAKZnBnbYoKeDsAAAKsAAANkWdhc3AAAAAQAAACjgAAAAAjZ2x5ZgA3..."
// ============================================

export const ROBOTO_REGULAR_BASE64 = `
AAEAAAAOAIAAAwBgT1MvMj3hSQEAAADsAAAATmNtYXDQEhm3AAABPAAAAUpjdnQgBkQFRgAAApQAAAAKZnBnbYoKeDsAAAKsAAANkWdhc3AAAAAQAAACjgAAAAAjZ2x5ZgA3
DEMO_BASE64_STRING_PLACEHOLDER
PLEASE_REPLACE_WITH_ACTUAL_FONT_BASE64
THIS_IS_JUST_A_PLACEHOLDER_TO_SHOW_WHERE_TO_PASTE
THE_ACTUAL_BASE64_STRING_WILL_BE_VERY_LONG_THOUSANDS_OF_CHARACTERS
`.trim()

/**
 * Tên font để sử dụng trong jsPDF
 */
export const FONT_NAME = 'Roboto'
export const FONT_STYLE = 'normal'
export const FONT_FILE_NAME = 'Roboto-Regular.ttf'

