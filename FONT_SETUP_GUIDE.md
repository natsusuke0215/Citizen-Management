# Hướng Dẫn Cài Đặt Font Tiếng Việt cho PDF

## Vấn Đề

jsPDF mặc định sử dụng font Helvetica không hỗ trợ đầy đủ ký tự tiếng Việt có dấu. Để hiển thị đúng tiếng Việt trong PDF, bạn cần nạp font hỗ trợ tiếng Việt.

## Giải Pháp

Sử dụng font Roboto-Regular (hoặc font khác hỗ trợ tiếng Việt) được convert sang Base64 và nạp vào jsPDF.

---

## CÁCH 1: Sử dụng Script Node.js (Khuyến nghị)

### Bước 1: Tải font Roboto-Regular.ttf

- Truy cập: https://fonts.google.com/specimen/Roboto
- Tải file `Roboto-Regular.ttf`
- Đặt file vào thư mục gốc của project (cùng cấp với `package.json`)

### Bước 2: Chạy script convert

```bash
node scripts/convert-font-to-base64.js
```

Script sẽ:
- Đọc file `Roboto-Regular.ttf`
- Convert sang Base64
- Hiển thị chuỗi Base64 trong console
- Lưu vào file `font-base64-output.txt`

### Bước 3: Copy chuỗi Base64 vào code

1. Mở file `lib/fonts.ts`
2. Tìm biến `ROBOTO_REGULAR_BASE64`
3. Thay thế nội dung giữa dấu backtick (`` ` ``) bằng chuỗi Base64 vừa copy
4. Lưu file

**Lưu ý:** Chuỗi Base64 rất dài (hàng nghìn ký tự), đảm bảo copy đầy đủ.

---

## CÁCH 2: Sử dụng Tool Online

### Bước 1: Tải font

Tải file `Roboto-Regular.ttf` từ Google Fonts.

### Bước 2: Convert sang Base64

Sử dụng một trong các tool sau:

- **https://base64.guru/converter/encode/file**
  1. Chọn file font
  2. Click "Encode"
  3. Copy chuỗi Base64

- **https://everythingfonts.com/base64**
  1. Upload file font
  2. Copy chuỗi Base64 output

- **https://www.fontsquirrel.com/tools/webfont-generator**
  1. Upload file font
  2. Chọn "Base64 encoding"
  3. Download và mở file CSS
  4. Copy phần Base64 từ `src: url(data:font/ttf;base64,...)`

### Bước 3: Paste vào code

1. Mở file `lib/fonts.ts`
2. Tìm biến `ROBOTO_REGULAR_BASE64`
3. Thay thế nội dung placeholder bằng chuỗi Base64
4. Lưu file

---

## CÁCH 3: Sử dụng PowerShell (Windows)

```powershell
[Convert]::ToBase64String([IO.File]::ReadAllBytes("Roboto-Regular.ttf")) | Out-File -Encoding utf8 font-base64.txt
```

Sau đó mở file `font-base64.txt` và copy nội dung vào `lib/fonts.ts`.

---

## CÁCH 4: Sử dụng Command Line (Linux/Mac)

```bash
base64 -i Roboto-Regular.ttf -o font-base64.txt
```

Sau đó mở file `font-base64.txt` và copy nội dung vào `lib/fonts.ts`.

---

## Kiểm Tra

Sau khi cài đặt font:

1. Chạy ứng dụng: `npm run dev`
2. Test chức năng xuất PDF
3. Mở file PDF và kiểm tra:
   - ✅ Các ký tự tiếng Việt hiển thị đúng (ă, â, ê, ô, ơ, ư, đ, ...)
   - ✅ Không còn ký tự lạ hoặc dấu hỏi (?)

## Xử Lý Lỗi

### Lỗi: "Font Base64 chưa được cấu hình"

**Nguyên nhân:** Bạn chưa thay thế placeholder trong `lib/fonts.ts`

**Giải pháp:** 
- Mở file `lib/fonts.ts`
- Tìm và thay thế `DEMO_BASE64_STRING_PLACEHOLDER` bằng chuỗi Base64 thật

### Lỗi: Font không hiển thị đúng

**Nguyên nhân có thể:**
1. Font không hỗ trợ tiếng Việt
2. Chuỗi Base64 bị thiếu hoặc sai
3. Font file bị hỏng

**Giải pháp:**
- Đảm bảo sử dụng font hỗ trợ tiếng Việt (Roboto, Arial Unicode MS, Times New Roman)
- Kiểm tra lại chuỗi Base64 (phải rất dài, không có khoảng trắng)
- Tải lại font và convert lại

### Lỗi: "Cannot read property 'addFileToVFS'"

**Nguyên nhân:** Version jsPDF không hỗ trợ

**Giải pháp:**
- Cập nhật jsPDF: `npm install jspdf@latest`
- Kiểm tra version trong `package.json`

---

## Font Khác

Nếu muốn sử dụng font khác (không phải Roboto):

1. Tải font hỗ trợ tiếng Việt (ví dụ: Arial Unicode MS, Times New Roman)
2. Convert sang Base64
3. Cập nhật trong `lib/fonts.ts`:
   - Thay đổi `FONT_NAME` (ví dụ: 'ArialUnicodeMS')
   - Thay đổi `FONT_FILE_NAME` (ví dụ: 'ArialUnicodeMS.ttf')
   - Thay đổi `ROBOTO_REGULAR_BASE64` thành chuỗi Base64 mới

---

## Tài Liệu Tham Khảo

- jsPDF Font Documentation: https://github.com/parallax/jsPDF#use-of-unicode-characters--utf-8
- Google Fonts: https://fonts.google.com/
- Base64 Converter: https://base64.guru/converter/encode/file

