# Hướng dẫn tải font Roboto

## Cách 1: Tải từ Google Fonts (Khuyến nghị)

1. Truy cập: https://fonts.google.com/specimen/Roboto
2. Click nút "Download family"
3. Giải nén file zip
4. Tìm file `Roboto-Regular.ttf` trong thư mục `static/`
5. Copy file `Roboto-Regular.ttf` vào thư mục `scripts/` của project

## Cách 2: Tải trực tiếp

Truy cập link này để tải trực tiếp:
https://github.com/google/fonts/raw/main/apache/roboto/static/Roboto-Regular.ttf

Lưu file vào: `scripts/Roboto-Regular.ttf`

## Sau khi tải xong

Chạy script convert:
```bash
node scripts/convert-font.js
```

Script sẽ tạo file `font-base64-output.txt` chứa chuỗi Base64 của font.

