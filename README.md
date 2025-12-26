# Hệ thống quản lý nhân khẩu và nhà văn hóa

Hệ thống quản lý nhân khẩu hiện đại với tính năng quản lý nhà văn hóa, được xây dựng bằng Next.js 14, TypeScript, Prisma và Tailwind CSS.

## 🚀 Tính năng chính

### 👨‍💼 Admin
- **Quản lý hộ khẩu**: Tạo, xem, sửa, xóa thông tin hộ khẩu
- **Quản lý nhân khẩu**: Quản lý thông tin các thành viên trong hộ khẩu
- **Phân loại khu phố**: Quản lý và phân loại theo từng khu phố
- **Quản lý nhà văn hóa**: Quản lý 3 tòa nhà nhà văn hóa với bản đồ
- **Duyệt yêu cầu**: Xét duyệt các yêu cầu từ người dùng
- **Thống kê**: Dashboard với các thống kê tổng quan

### 👤 User
- **Xem hộ khẩu**: Xem thông tin hộ khẩu của bản thân
- **Tạo yêu cầu**: Gửi yêu cầu sửa thông tin, thêm/xóa nhân khẩu
- **Đặt lịch nhà văn hóa**: Đặt lịch sử dụng với chế độ public/private
- **Xem lịch trống**: Xem lịch trống và lịch đã đăng ký của nhà văn hóa

### 🏢 Nhà văn hóa
- **3 tòa nhà**: Quản lý tòa nhà A, B, C với thông tin chi tiết
- **Đặt lịch**: Hệ thống đặt lịch với kiểm tra trùng lặp
- **Chế độ hiển thị**: Public (mọi người xem được) hoặc Private (chỉ người đặt xem)
- **Lịch trống**: Hiển thị lịch trống theo từng tòa nhà và thời gian

## 🛠️ Công nghệ sử dụng

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS, Headless UI
- **Database**: SQLite với Prisma ORM
- **Authentication**: JWT với plain text passwords
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## 📦 Cài đặt

### Yêu cầu hệ thống
- Node.js 18+ 
- npm hoặc yarn

### Bước 1: Clone repository
```bash
git clone https://github.com/natsusuke0215/Citizen-Management.git
cd Citizen-Management
```

### Bước 2: Cài đặt dependencies
```bash
npm install
```

### Bước 3: Thiết lập database
```bash
# Tạo database và chạy migrations
npx prisma db push

# (Tùy chọn) Xem database với Prisma Studio
npx prisma studio
```

### Bước 4: Tạo file environment
Tạo file `.env.local`:
```env
JWT_SECRET=your-secret-key-here
DATABASE_URL="file:./prisma/dev.db"
```
// Tạo dữ liệu mẫu (với plain text passwords)
npm run db:seed

// Lưu ý: Nếu database đã có dữ liệu cũ với mật khẩu hash, 
// chạy thêm: npx tsx scripts/update-passwords-to-plaintext.ts

### Bước 5: Chạy ứng dụng
```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:3000`

## 🗄️ Cấu trúc database

### Các bảng chính:
- **User**: Thông tin người dùng (Admin/User)
- **District**: Khu phố
- **Household**: Hộ khẩu
- **Person**: Nhân khẩu
- **Request**: Yêu cầu từ user
- **CulturalCenter**: Nhà văn hóa
- **CulturalCenterBooking**: Lịch đặt nhà văn hóa
- **Notification**: Thông báo

## 🎯 Hướng dẫn sử dụng

### Đăng ký tài khoản Admin
1. Truy cập `/register` để tạo tài khoản
2. Cập nhật role thành ADMIN trong database:
```sql
UPDATE User SET role = 'ADMIN' WHERE email = 'your-email@example.com';
```

### Tạo dữ liệu mẫu
1. Tạo khu phố trong `/dashboard/districts`
2. Tạo hộ khẩu trong `/dashboard/households`
3. Thêm nhà văn hóa trong `/dashboard/cultural-centers`

### Quy trình sử dụng
1. **Admin**: Tạo khu phố → Tạo hộ khẩu → Gán user vào hộ khẩu
2. **User**: Đăng nhập → Xem hộ khẩu → Tạo yêu cầu → Đặt lịch nhà văn hóa
3. **Admin**: Duyệt yêu cầu → Quản lý lịch đặt

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Đăng nhập
- `POST /api/auth/register` - Đăng ký
- `POST /api/auth/logout` - Đăng xuất

### Dashboard
- `GET /api/dashboard/stats` - Thống kê tổng quan

### Hộ khẩu
- `GET /api/households` - Danh sách hộ khẩu
- `POST /api/households` - Tạo hộ khẩu
- `PUT /api/households/[id]` - Cập nhật hộ khẩu
- `DELETE /api/households/[id]` - Xóa hộ khẩu

### Khu phố
- `GET /api/districts` - Danh sách khu phố
- `POST /api/districts` - Tạo khu phố
- `PUT /api/districts/[id]` - Cập nhật khu phố
- `DELETE /api/districts/[id]` - Xóa khu phố

### Nhà văn hóa
- `GET /api/cultural-centers` - Danh sách nhà văn hóa
- `POST /api/cultural-centers` - Tạo nhà văn hóa
- `PUT /api/cultural-centers/[id]` - Cập nhật nhà văn hóa
- `DELETE /api/cultural-centers/[id]` - Xóa nhà văn hóa

### Đặt lịch
- `GET /api/bookings` - Danh sách lịch đặt
- `POST /api/bookings` - Tạo lịch đặt
- `PUT /api/bookings/[id]` - Cập nhật lịch đặt
- `DELETE /api/bookings/[id]` - Xóa lịch đặt
- `PATCH /api/bookings/[id]/status` - Duyệt/từ chối lịch đặt
- `GET /api/bookings/calendar` - Lịch theo ngày/tòa nhà

### Yêu cầu
- `GET /api/requests` - Danh sách yêu cầu (Admin)
- `POST /api/requests` - Tạo yêu cầu
- `PATCH /api/requests/[id]/status` - Duyệt/từ chối yêu cầu
- `GET /api/my-requests` - Yêu cầu của user
- `GET /api/my-household` - Hộ khẩu của user
- `GET /api/my-household/persons` - Nhân khẩu trong hộ khẩu

## 🎨 Giao diện

### Trang chính
- **Landing page**: Giới thiệu hệ thống
- **Login/Register**: Đăng nhập và đăng ký

### Dashboard Admin
- **Tổng quan**: Thống kê hệ thống
- **Quản lý hộ khẩu**: CRUD hộ khẩu
- **Quản lý khu phố**: CRUD khu phố  
- **Quản lý nhà văn hóa**: CRUD nhà văn hóa
- **Duyệt yêu cầu**: Xét duyệt yêu cầu từ user
- **Quản lý lịch đặt**: Duyệt lịch đặt nhà văn hóa

### Dashboard User
- **Hộ khẩu của tôi**: Xem thông tin hộ khẩu
- **Yêu cầu của tôi**: Quản lý yêu cầu đã gửi
- **Nhà văn hóa**: Xem danh sách nhà văn hóa
- **Đặt lịch**: Đặt lịch sử dụng nhà văn hóa
- **Lịch trống**: Xem lịch trống và lịch đã đăng ký

## 🔒 Bảo mật

- **JWT Authentication**: Xác thực bằng JWT token
- **Role-based Access**: Phân quyền Admin/User
- **Password Storage**: Lưu trữ mật khẩu dưới dạng plain text
- **Input Validation**: Kiểm tra dữ liệu đầu vào
- **SQL Injection Protection**: Sử dụng Prisma ORM

## 🚀 Triển khai

### Production Build
```bash
npm run build
npm start
```

### Environment Variables
```env
NODE_ENV=production
JWT_SECRET=your-production-secret
DATABASE_URL=your-production-database-url
```

## 📝 Ghi chú

- Hệ thống sử dụng SQLite cho development, có thể chuyển sang PostgreSQL/MySQL cho production
- Tất cả API đều có xử lý lỗi và validation
- Giao diện responsive, hỗ trợ mobile
- Hỗ trợ đa ngôn ngữ (hiện tại là tiếng Việt)

## 🤝 Đóng góp

1. Fork repository
2. Tạo feature branch
3. Commit changes
4. Push to branch
5. Tạo Pull Request

## 📄 License

MIT License - xem file LICENSE để biết thêm chi tiết.
