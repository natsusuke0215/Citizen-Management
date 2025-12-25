# Tài liệu về Role và Tài khoản

## 📋 Tổng quan

Tài liệu này mô tả hệ thống phân quyền và quản lý tài khoản hiện tại trong hệ thống Quản lý Nhân khẩu sau khi refactor.

---

## 🔐 Các Role hiện tại

Hệ thống hiện có **3 roles** được định nghĩa trong `lib/types.ts`:

```typescript
export enum UserRole {
  TEAM_LEADER = 'TEAM_LEADER',        // Tổ trưởng (gộp từ ADMIN và LEADER)
  DEPUTY = 'DEPUTY',                  // Tổ phó
  FACILITY_MANAGER = 'FACILITY_MANAGER' // Quản lý CSVC
}
```

### Chi tiết từng Role

#### 1. TEAM_LEADER (Tổ trưởng)
- **Mã**: `TEAM_LEADER`
- **Tên hiển thị**: Tổ trưởng
- **Màu badge**: Đỏ (`bg-red-100 text-red-800`)
- **Mô tả**: Gộp từ ADMIN và LEADER cũ, có toàn quyền trong hệ thống
- **Quyền truy cập**:
  - ✅ **Dashboard** (Tổng quan)
  - ✅ **Quản lý hộ khẩu** (với đầy đủ sub-menu)
  - ✅ **Quản lý nhân khẩu** (với đầy đủ sub-menu)
  - ✅ **Quản lý tài khoản** ⭐ (chỉ role này có quyền)
  - ✅ **Nhà văn hóa**
  - ✅ **Thêm lịch** (Schedule)
  - ✅ **Cài đặt**

#### 2. DEPUTY (Tổ phó)
- **Mã**: `DEPUTY`
- **Tên hiển thị**: Tổ phó
- **Màu badge**: Chàm (`bg-indigo-100 text-indigo-800`)
- **Quyền truy cập**:
  - ✅ **Dashboard** (Tổng quan)
  - ✅ **Quản lý hộ khẩu** (với đầy đủ sub-menu)
  - ✅ **Quản lý nhân khẩu** (với đầy đủ sub-menu)
  - ❌ **Quản lý tài khoản** (KHÔNG có quyền)
  - ✅ **Nhà văn hóa**
  - ✅ **Thêm lịch** (Schedule)
  - ✅ **Cài đặt**

#### 3. FACILITY_MANAGER (Quản lý CSVC)
- **Mã**: `FACILITY_MANAGER`
- **Tên hiển thị**: Quản lý CSVC
- **Màu badge**: Xanh lá (`bg-green-100 text-green-800`)
- **Quyền truy cập** (HẠN CHẾ):
  - ✅ **Dashboard** (Tổng quan)
  - ❌ **Quản lý hộ khẩu** (KHÔNG có quyền)
  - ❌ **Quản lý nhân khẩu** (KHÔNG có quyền)
  - ❌ **Quản lý tài khoản** (KHÔNG có quyền)
  - ✅ **Nhà văn hóa**
  - ✅ **Thêm lịch** (Schedule)
  - ✅ **Cài đặt**

---

## 📱 Menu Navigation chi tiết

### TEAM_LEADER (Tổ trưởng) - Toàn quyền

```
✅ Tổng quan (/dashboard)
✅ Quản lý hộ khẩu (/dashboard/households)
   ├─ Thêm hộ khẩu
   ├─ Đăng ký thường trú
   ├─ Tách hộ khẩu
   ├─ Xóa hộ khẩu
   ├─ Chuyển hộ khẩu
   └─ Lịch sử thay đổi
✅ Quản lý nhân khẩu (/dashboard/persons)
   ├─ Danh sách nhân khẩu
   ├─ Cấp giấy tạm trú
   └─ Cấp giấy tạm vắng
✅ Quản lý tài khoản (/dashboard/accounts) ⭐
✅ Nhà văn hóa (/dashboard/cultural-centers)
✅ Thêm lịch (/dashboard/bookings)
✅ Cài đặt (/dashboard/settings)
```

### DEPUTY (Tổ phó) - Trừ Quản lý tài khoản

```
✅ Tổng quan (/dashboard)
✅ Quản lý hộ khẩu (/dashboard/households)
   ├─ Thêm hộ khẩu
   ├─ Đăng ký thường trú
   ├─ Tách hộ khẩu
   ├─ Xóa hộ khẩu
   ├─ Chuyển hộ khẩu
   └─ Lịch sử thay đổi
✅ Quản lý nhân khẩu (/dashboard/persons)
   ├─ Danh sách nhân khẩu
   ├─ Cấp giấy tạm trú
   └─ Cấp giấy tạm vắng
❌ Quản lý tài khoản (KHÔNG có quyền)
✅ Nhà văn hóa (/dashboard/cultural-centers)
✅ Thêm lịch (/dashboard/bookings)
✅ Cài đặt (/dashboard/settings)
```

### FACILITY_MANAGER (Quản lý CSVC) - Hạn chế

```
✅ Tổng quan (/dashboard)
❌ Quản lý hộ khẩu (KHÔNG có quyền)
❌ Quản lý nhân khẩu (KHÔNG có quyền)
❌ Quản lý tài khoản (KHÔNG có quyền)
✅ Nhà văn hóa (/dashboard/cultural-centers)
✅ Thêm lịch (/dashboard/bookings)
✅ Cài đặt (/dashboard/settings)
```

---

## 🛡️ Route Guards (Middleware)

### Account Management
- **Route**: `/dashboard/accounts`
- **Quyền**: Chỉ `TEAM_LEADER`
- **Hành động**: Redirect về `/dashboard` nếu không có quyền

### Household Management
- **Route**: `/dashboard/households`
- **Quyền**: `TEAM_LEADER` và `DEPUTY`
- **Hành động**: Redirect về `/dashboard` nếu không có quyền

### Resident Management (Persons)
- **Route**: `/dashboard/persons`
- **Quyền**: `TEAM_LEADER` và `DEPUTY`
- **Hành động**: Redirect về `/dashboard` nếu không có quyền

### FACILITY_MANAGER Restrictions
- **Routes bị chặn**:
  - `/dashboard/districts`
  - `/dashboard/requests`
  - `/dashboard/my-household`
- **Hành động**: Redirect về `/dashboard`

---

## 👥 Quản lý Tài khoản

### Trang Quản lý Tài khoản (`/dashboard/accounts`)

**⚠️ Chỉ TEAM_LEADER mới có quyền truy cập trang này.**

#### Chức năng chính:

1. **Xem danh sách tất cả người dùng**
   - Hiển thị: Tên, Email, Role, Ngày tạo
   - Tìm kiếm theo tên hoặc email
   - Hiển thị badge màu theo role:
     - 🔴 Đỏ: TEAM_LEADER (Tổ trưởng)
     - 🔵 Chàm: DEPUTY (Tổ phó)
     - 🟢 Xanh lá: FACILITY_MANAGER (Quản lý CSVC)

2. **Tạo tài khoản mới**
   - Form tạo: Email, Mật khẩu, Tên, Role
   - Role mặc định: `FACILITY_MANAGER`
   - Validation: 
     - Email unique
     - Mật khẩu tối thiểu 6 ký tự
     - Tất cả trường bắt buộc

3. **Cập nhật Role**
   - Chọn role từ dropdown
   - Các role có sẵn: TEAM_LEADER, DEPUTY, FACILITY_MANAGER
   - Chỉ TEAM_LEADER mới có quyền cập nhật

4. **Xóa tài khoản**
   - Không thể xóa chính tài khoản của mình
   - Chỉ TEAM_LEADER mới có quyền xóa

---

## 🔄 Đăng ký tài khoản mới

### Route: `POST /api/auth/register`

- **Public route** (không cần authentication)
- **Body**: `{ name, email, password }`
- **Role mặc định**: `FACILITY_MANAGER`
- **Validation**:
  - Tất cả trường bắt buộc
  - Mật khẩu tối thiểu 6 ký tự
  - Email phải unique
- **Lưu ý**: Role có thể được thay đổi sau bởi TEAM_LEADER thông qua quản lý tài khoản

---

## 🔐 Phân quyền API

### Chỉ TEAM_LEADER có quyền:

- `GET /api/users` - Xem danh sách tất cả người dùng
- `POST /api/users` - Tạo người dùng mới
- `DELETE /api/users/[id]` - Xóa người dùng
- `PATCH /api/users/[id]/role` - Cập nhật role của người dùng

### TEAM_LEADER và DEPUTY có quyền:

- Quản lý hộ khẩu (tất cả endpoints)
- Quản lý nhân khẩu (tất cả endpoints)
- `PATCH /api/requests/[id]/status` - Duyệt/từ chối yêu cầu
- `PATCH /api/bookings/[id]/status` - Duyệt/từ chối lịch đặt
- `POST /api/bookings/[id]/fee` - Quản lý phí sử dụng
- `PUT /api/bookings/[id]` - Chỉnh sửa lịch đặt (nếu là owner hoặc có quyền)
- `DELETE /api/bookings/[id]` - Xóa lịch đặt (nếu là owner hoặc có quyền)

---

## 📊 Database Schema

### Model User (`prisma/schema.prisma`)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String
  role      String   @default("FACILITY_MANAGER") // TEAM_LEADER, DEPUTY, FACILITY_MANAGER
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
- Role là `String` với default value `"FACILITY_MANAGER"`
- Comment đã được cập nhật: `TEAM_LEADER, DEPUTY, FACILITY_MANAGER`

---

## 🔄 Tương thích ngược

Hệ thống vẫn hỗ trợ các role cũ để đảm bảo tương thích:

- `ADMIN` → Được xử lý như `TEAM_LEADER`
- `LEADER` → Được xử lý như `TEAM_LEADER`
- `USER` → Fallback về menu cơ bản

**Khuyến nghị**: Nên migrate tất cả users sang role mới (TEAM_LEADER, DEPUTY, FACILITY_MANAGER)

---

## 📝 So sánh Role cũ và mới

| Role cũ | Role mới | Ghi chú |
|---------|----------|---------|
| ADMIN | TEAM_LEADER | Gộp thành 1 role |
| LEADER | TEAM_LEADER | Gộp thành 1 role |
| DEPUTY | DEPUTY | Giữ nguyên |
| FACILITY_MANAGER | FACILITY_MANAGER | Giữ nguyên |
| USER | ❌ Đã xóa | Không còn sử dụng |

---

## 📝 Files liên quan

- `lib/types.ts` - Định nghĩa UserRole enum
- `app/dashboard/layout.tsx` - Navigation menu theo role
- `app/dashboard/accounts/page.tsx` - Trang quản lý tài khoản
- `middleware.ts` - Route guards
- `app/api/users/*` - API quản lý người dùng
- `prisma/schema.prisma` - Database schema

---

## ✅ Checklist quyền truy cập

### TEAM_LEADER (Tổ trưởng)
- [x] Dashboard
- [x] Quản lý hộ khẩu
- [x] Quản lý nhân khẩu
- [x] Quản lý tài khoản
- [x] Nhà văn hóa
- [x] Thêm lịch
- [x] Cài đặt

### DEPUTY (Tổ phó)
- [x] Dashboard
- [x] Quản lý hộ khẩu
- [x] Quản lý nhân khẩu
- [ ] Quản lý tài khoản ❌
- [x] Nhà văn hóa
- [x] Thêm lịch
- [x] Cài đặt

### FACILITY_MANAGER (Quản lý CSVC)
- [x] Dashboard
- [ ] Quản lý hộ khẩu ❌
- [ ] Quản lý nhân khẩu ❌
- [ ] Quản lý tài khoản ❌
- [x] Nhà văn hóa
- [x] Thêm lịch
- [x] Cài đặt

---

*Tài liệu được cập nhật sau refactor - $(date)*

