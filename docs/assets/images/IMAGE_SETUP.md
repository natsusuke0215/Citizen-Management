# Hướng dẫn thêm hình ảnh vào hệ thống

## 📁 Cấu trúc thư mục

```
public/assets/images/
├── backgrounds/     # Hình nền cho các trang
│   ├── login.jpg    # Hình nền trang đăng nhập
│   ├── register.jpg # Hình nền trang đăng ký
│   ├── landing.jpg  # Hình nền trang chủ
│   └── dashboard.jpg # Hình nền dashboard (tùy chọn)
├── logos/           # Logo và branding
│   └── logo.png     # Logo chính của hệ thống
└── icons/           # Icon tùy chỉnh (nếu có)
```

## 🖼️ Thêm hình nền

### Trang đăng nhập (`/login`)
1. Đặt file vào: `public/assets/images/backgrounds/login.jpg`
2. Tên file có thể là: `login.jpg`, `login.png`, `login.webp`, hoặc `login.jpeg`
3. Kích thước khuyến nghị: **1920x1080px** hoặc lớn hơn
4. Định dạng: JPG, PNG, WebP
5. Hệ thống sẽ tự động tìm và sử dụng hình ảnh

### Trang đăng ký (`/register`)
1. Đặt file vào: `public/assets/images/backgrounds/register.jpg`
2. Tên file có thể là: `register.jpg`, `register.png`, `register.webp`, hoặc `register.jpeg`
3. Kích thước khuyến nghị: **1920x1080px** hoặc lớn hơn
4. Định dạng: JPG, PNG, WebP
5. Hệ thống sẽ tự động tìm và sử dụng hình ảnh

### Trang chủ (`/`)
1. Đặt file vào: `public/assets/images/backgrounds/landing.jpg`
2. Tên file có thể là: `landing.jpg`, `landing.png`, `landing.webp`, hoặc `landing.jpeg`
3. Kích thước khuyến nghị: **1920x1080px** hoặc lớn hơn

## 🎨 Thêm Logo

1. Đặt file vào: `public/assets/images/logos/logo.png`
2. Kích thước khuyến nghị: **512x512px** (cho logo vuông)
3. Định dạng: PNG (có nền trong suốt) hoặc SVG

## ⚙️ Cách hoạt động

### Ưu tiên hình ảnh:
1. **Hình ảnh từ localStorage** (người dùng tự tải lên) - Ưu tiên cao nhất
2. **Hình ảnh từ assets/images** - Ưu tiên thứ hai
3. **Gradient background mặc định** - Nếu không có hình ảnh

### Tự động phát hiện:
- Hệ thống sẽ tự động thử các định dạng: `.jpg`, `.jpeg`, `.png`, `.webp`
- Sử dụng hình ảnh đầu tiên được tìm thấy

## 📝 Lưu ý

- Tất cả hình ảnh sẽ được Next.js tự động tối ưu hóa
- Hình ảnh trong `assets/images` sẽ được commit vào Git
- Nếu muốn giữ hình ảnh riêng tư, thêm vào `.gitignore`:
  ```
  public/assets/images/backgrounds/*.jpg
  public/assets/images/backgrounds/*.png
  ```

## 🔄 Tùy chỉnh hình nền (Người dùng)

Người dùng có thể tùy chỉnh hình nền thông qua:
- **Trang đăng nhập**: Nút "Đổi hình nền" ở góc dưới bên phải
- **Trang đăng ký**: Nút "Đổi hình nền" ở góc dưới bên phải
- Hình ảnh được lưu trong localStorage và có ưu tiên cao nhất

## 💡 Gợi ý

- Sử dụng hình ảnh có độ phân giải cao để đảm bảo chất lượng trên màn hình lớn
- Tối ưu hóa kích thước file để tăng tốc độ tải trang
- Sử dụng WebP format để có kích thước file nhỏ hơn với chất lượng tốt

