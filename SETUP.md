# Hướng dẫn cài đặt hệ thống quản lý nhân khẩu

## 🚀 Cài đặt nhanh

### Bước 1: Cài đặt dependencies
```bash
npm install
```

### Bước 2: Thiết lập database
```bash
# Tạo database
npx prisma db push

# Tạo dữ liệu mẫu
npm run db:seed
```

### Bước 3: Tạo file environment
Tạo file `.env.local`:
```env
JWT_SECRET=your-secret-key-here
DATABASE_URL="file:./prisma/dev.db"
NODE_ENV=development
```

### Bước 4: Chạy ứng dụng
```bash
npm run dev
```

Truy cập `http://localhost:3000`

## 👤 Tài khoản mẫu

Sau khi chạy seed, bạn có thể đăng nhập với:

**Admin:**
- Email: `admin@example.com`
- Password: `admin123`

**User:**
- Email: `user@example.com` 
- Password: `user123`

## 📋 Cấu trúc dự án

```
population-management-system/
├── app/                    # Next.js 14 App Router
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   ├── login/            # Auth pages
│   └── register/
├── components/            # React components
├── lib/                   # Utilities
│   ├── prisma.ts         # Prisma client
│   └── auth.ts           # Auth utilities
├── prisma/               # Database schema
│   └── schema.prisma
├── scripts/              # Database scripts
│   └── seed.ts           # Seed data
└── public/               # Static files
```

## 🗄️ Database Schema

### Các bảng chính:

1. **User** - Người dùng (Admin/User)
2. **District** - Khu phố
3. **Household** - Hộ khẩu
4. **Person** - Nhân khẩu
5. **Request** - Yêu cầu từ user
6. **CulturalCenter** - Nhà văn hóa
7. **CulturalCenterBooking** - Lịch đặt nhà văn hóa
8. **Notification** - Thông báo

## 🔧 Scripts có sẵn

```bash
# Development
npm run dev              # Chạy development server
npm run build            # Build production
npm run start            # Chạy production server

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema to database
npm run db:migrate       # Run migrations
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed sample data

# Linting
npm run lint             # Run ESLint
```

## 🎯 Quy trình sử dụng

### 1. Admin Setup
1. Đăng nhập với tài khoản admin
2. Tạo khu phố trong `/dashboard/districts`
3. Tạo hộ khẩu trong `/dashboard/households`
4. Gán user vào hộ khẩu (cập nhật trong database)

### 2. User Workflow
1. Đăng nhập với tài khoản user
2. Xem thông tin hộ khẩu trong `/dashboard/my-household`
3. Tạo yêu cầu trong `/dashboard/my-requests`
4. Đặt lịch nhà văn hóa trong `/dashboard/bookings`

### 3. Admin Approval
1. Duyệt yêu cầu trong `/dashboard/requests`
2. Duyệt lịch đặt trong `/dashboard/bookings`
3. Quản lý nhà văn hóa trong `/dashboard/cultural-centers`

## 🏢 Quản lý nhà văn hóa

### 3 tòa nhà:
- **Tòa A**: Màu xanh dương
- **Tòa B**: Màu xanh lá
- **Tòa C**: Màu tím

### Tính năng:
- Đặt lịch với kiểm tra trùng lặp
- Chế độ Public/Private
- Xem lịch trống theo ngày/tòa nhà
- Quản lý tiện nghi (máy chiếu, âm thanh, điều hòa)

## 🔒 Bảo mật

- JWT authentication
- Password hashing với bcryptjs
- Role-based access control
- Input validation
- SQL injection protection với Prisma

## 📱 Responsive Design

- Mobile-first approach
- Tailwind CSS
- Headless UI components
- Responsive grid layouts

## 🚀 Production Deployment

### Environment Variables:
```env
NODE_ENV=production
JWT_SECRET=your-production-secret
DATABASE_URL=your-production-database-url
```

### Build Commands:
```bash
npm run build
npm start
```

### Database Migration:
```bash
npx prisma migrate deploy
```

## 🐛 Troubleshooting

### Lỗi thường gặp:

1. **Database connection error**
   - Kiểm tra DATABASE_URL trong .env.local
   - Chạy `npx prisma db push`

2. **Authentication error**
   - Kiểm tra JWT_SECRET trong .env.local
   - Xóa cookies và đăng nhập lại

3. **Build error**
   - Chạy `npm run db:generate`
   - Kiểm tra TypeScript errors

### Debug Commands:
```bash
# Xem database
npx prisma studio

# Reset database
rm prisma/dev.db
npx prisma db push
npm run db:seed

# Check logs
npm run dev -- --verbose
```

## 📞 Hỗ trợ

Nếu gặp vấn đề, hãy kiểm tra:
1. Console logs trong browser
2. Terminal logs
3. Database connection
4. Environment variables

## 🔄 Updates

Để cập nhật hệ thống:
1. Pull latest changes
2. Chạy `npm install`
3. Chạy `npx prisma db push`
4. Restart server
