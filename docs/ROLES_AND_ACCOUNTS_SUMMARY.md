# Tóm tắt về Role và Tài khoản

## 📋 Tổng quan

Tài liệu này mô tả hệ thống phân quyền và quản lý tài khoản hiện tại trong hệ thống Quản lý Nhân khẩu.

---

## 🔐 Các Role hiện tại trong hệ thống

### Enum UserRole (`lib/types.ts`)

Hệ thống hiện có **5 roles** được định nghĩa:

```typescript
export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
  LEADER = 'LEADER',
  DEPUTY = 'DEPUTY',
  FACILITY_MANAGER = 'FACILITY_MANAGER'
}
```

### Chi tiết từng Role

#### 1. ADMIN
- **Mã**: `ADMIN`
- **Tên hiển thị**: Quản trị viên
- **Màu badge**: Đỏ (`bg-red-100 text-red-800`)
- **Quyền truy cập**:
  - ✅ Toàn quyền truy cập tất cả tính năng
  - ✅ Quản lý tài khoản (xem, tạo, xóa, cập nhật role)
  - ✅ Quản lý hộ khẩu
  - ✅ Quản lý nhân khẩu
  - ✅ Duyệt yêu cầu
  - ✅ Duyệt lịch đặt nhà văn hóa
  - ✅ Quản lý phí sử dụng

#### 2. USER
- **Mã**: `USER`
- **Tên hiển thị**: Người dùng
- **Màu badge**: Xanh dương (`bg-blue-100 text-blue-800`)
- **Quyền truy cập**:
  - ✅ Dashboard
  - ✅ Cài đặt
  - ❌ Không có quyền quản lý

#### 3. LEADER
- **Mã**: `LEADER`
- **Tên hiển thị**: Tổ trưởng
- **Màu badge**: Tím (`bg-purple-100 text-purple-800`)
- **Quyền truy cập**:
  - ✅ Dashboard
  - ✅ Quản lý hộ khẩu
  - ✅ Quản lý nhân khẩu
  - ✅ Nhà văn hóa
  - ✅ Thêm lịch
  - ✅ Cài đặt
  - ❌ Không có quyền quản lý tài khoản

#### 4. DEPUTY
- **Mã**: `DEPUTY`
- **Tên hiển thị**: Tổ phó
- **Màu badge**: Chàm (`bg-indigo-100 text-indigo-800`)
- **Quyền truy cập**:
  - ✅ Dashboard
  - ✅ Quản lý hộ khẩu
  - ✅ Quản lý nhân khẩu
  - ✅ Nhà văn hóa
  - ✅ Thêm lịch
  - ✅ Cài đặt
  - ❌ Không có quyền quản lý tài khoản

#### 5. FACILITY_MANAGER
- **Mã**: `FACILITY_MANAGER`
- **Tên hiển thị**: Quản lý CSVC
- **Màu badge**: Xanh lá (`bg-green-100 text-green-800`)
- **Quyền truy cập**:
  - ✅ Dashboard
  - ✅ Nhà văn hóa
  - ✅ Quản lý lịch
  - ✅ Cài đặt
  - ❌ Không có quyền quản lý hộ khẩu
  - ❌ Không có quyền quản lý nhân khẩu
  - ❌ Không có quyền quản lý tài khoản

---

## 📱 Menu Navigation theo Role

### ADMIN / TEAM_LEADER
```
✅ Tổng quan
✅ Quản lý hộ khẩu
   ├─ Thêm hộ khẩu
   ├─ Đăng ký thường trú
   ├─ Tách hộ khẩu
   ├─ Xóa hộ khẩu
   ├─ Chuyển hộ khẩu
   └─ Lịch sử thay đổi
✅ Quản lý nhân khẩu
   ├─ Danh sách nhân khẩu
   ├─ Cấp giấy tạm trú
   └─ Cấp giấy tạm vắng
✅ Quản lý tài khoản ⭐
✅ Nhà văn hóa
✅ Thêm lịch
✅ Cài đặt
```

### LEADER / DEPUTY / DEPUTY_LEADER
```
✅ Tổng quan
✅ Quản lý hộ khẩu
   ├─ Thêm hộ khẩu
   ├─ Đăng ký thường trú
   ├─ Tách hộ khẩu
   ├─ Xóa hộ khẩu
   ├─ Chuyển hộ khẩu
   └─ Lịch sử thay đổi
✅ Quản lý nhân khẩu
   ├─ Danh sách nhân khẩu
   ├─ Cấp giấy tạm trú
   └─ Cấp giấy tạm vắng
❌ Quản lý tài khoản (KHÔNG có quyền)
✅ Nhà văn hóa
✅ Thêm lịch
✅ Cài đặt
```

### FACILITY_MANAGER
```
✅ Tổng quan
❌ Quản lý hộ khẩu (KHÔNG có quyền)
❌ Quản lý nhân khẩu (KHÔNG có quyền)
❌ Quản lý tài khoản (KHÔNG có quyền)
✅ Nhà văn hóa
✅ Quản lý lịch
✅ Cài đặt
```

### USER
```
✅ Tổng quan
✅ Cài đặt
❌ Các tính năng quản lý khác
```

---

## 👥 Quản lý Tài khoản

### Trang Quản lý Tài khoản (`/dashboard/accounts`)

**Chỉ ADMIN mới có quyền truy cập trang này.**

#### Chức năng chính:

1. **Xem danh sách tất cả người dùng**
   - Hiển thị: Tên, Email, Role, Ngày tạo
   - Tìm kiếm theo tên hoặc email
   - Hiển thị badge màu theo role

2. **Tạo tài khoản mới**
   - Form tạo: Email, Mật khẩu, Tên, Role
   - Role mặc định: `USER`
   - Validation: 
     - Email unique
     - Mật khẩu tối thiểu 6 ký tự
     - Tất cả trường bắt buộc

3. **Cập nhật Role**
   - Chọn role từ dropdown
   - Các role có sẵn: ADMIN, USER, LEADER, DEPUTY, FACILITY_MANAGER
   - Chỉ ADMIN mới có quyền cập nhật

4. **Xóa tài khoản**
   - Không thể xóa chính tài khoản của mình
   - Chỉ ADMIN mới có quyền xóa

---

## 🔄 Đăng ký tài khoản mới

### Route: `POST /api/auth/register`

- **Public route** (không cần authentication)
- **Body**: `{ name, email, password }`
- **Role mặc định**: `USER`
- **Validation**:
  - Tất cả trường bắt buộc
  - Mật khẩu tối thiểu 6 ký tự
  - Email phải unique

---

## 🛡️ Phân quyền API

### Chỉ ADMIN có quyền:

- `GET /api/users` - Xem danh sách tất cả người dùng
- `POST /api/users` - Tạo người dùng mới
- `DELETE /api/users/[id]` - Xóa người dùng
- `PATCH /api/users/[id]/role` - Cập nhật role của người dùng
- `PATCH /api/requests/[id]/status` - Duyệt/từ chối yêu cầu
- `PATCH /api/bookings/[id]/status` - Duyệt/từ chối lịch đặt
- `POST /api/bookings/[id]/fee` - Quản lý phí sử dụng

### ADMIN, LEADER, DEPUTY có quyền:

- Quản lý hộ khẩu
- Quản lý nhân khẩu
- Duyệt yêu cầu và lịch đặt

---

## 📊 Database Schema

### Model User (`prisma/schema.prisma`)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("USER") // ADMIN, MANAGER, USER
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  householdId String?
  household   Household? @relation(fields: [householdId], references: [id])
  requests    Request[]
  bookings    CulturalCenterBooking[]

  @@map("users")
}
```

**Lưu ý**: 
- Trong schema, role là `String` với comment `// ADMIN, MANAGER, USER`
- Trong code TypeScript, enum có 5 giá trị: ADMIN, USER, LEADER, DEPUTY, FACILITY_MANAGER
- Cần đồng bộ giữa schema comment và enum thực tế

---

## ⚠️ Vấn đề hiện tại

1. **Không nhất quán giữa Schema và Code**:
   - Schema comment: `ADMIN, MANAGER, USER`
   - Enum thực tế: `ADMIN, USER, LEADER, DEPUTY, FACILITY_MANAGER`

2. **Logic Navigation sử dụng role mới**:
   - Layout.tsx đang check `TEAM_LEADER`, `DEPUTY_LEADER` (role mới)
   - Nhưng enum vẫn có `ADMIN`, `LEADER`, `DEPUTY` (role cũ)
   - Cần đồng bộ giữa enum và logic navigation

3. **Thiếu route guard cho Account Management**:
   - Middleware chỉ chặn FACILITY_MANAGER
   - Chưa có guard rõ ràng cho `/dashboard/accounts` (chỉ ADMIN mới được vào)

---

## 🔧 Khuyến nghị

1. **Đồng bộ Role System**:
   - Quyết định sử dụng role cũ (ADMIN, LEADER, DEPUTY) hay role mới (TEAM_LEADER, DEPUTY_LEADER)
   - Cập nhật enum và tất cả logic liên quan

2. **Cập nhật Schema Comment**:
   - Đồng bộ comment trong schema.prisma với enum thực tế

3. **Thêm Route Guards**:
   - `/dashboard/accounts` → Chỉ ADMIN
   - `/dashboard/households` → ADMIN, LEADER, DEPUTY
   - `/dashboard/persons` → ADMIN, LEADER, DEPUTY

---

## 📝 Files liên quan

- `lib/types.ts` - Định nghĩa UserRole enum
- `app/dashboard/layout.tsx` - Navigation menu theo role
- `app/dashboard/accounts/page.tsx` - Trang quản lý tài khoản
- `middleware.ts` - Route guards
- `app/api/users/*` - API quản lý người dùng
- `prisma/schema.prisma` - Database schema

---

*Tài liệu được tạo: $(date)*

