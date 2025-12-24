# Phân tích khoảng trống yêu cầu

Tài liệu này liệt kê các yêu cầu còn thiếu hoặc chưa đầy đủ trong hệ thống hiện tại.

## 📋 Tổng quan

Hệ thống đã triển khai khá đầy đủ các chức năng cơ bản, nhưng vẫn còn một số điểm cần bổ sung để đáp ứng đầy đủ yêu cầu.

---

## ❌ 1. THIẾU: Trường "Bí danh" trong thông tin nhân khẩu

### Yêu cầu:
- **Thông tin nhân khẩu** cần có trường **Bí danh**

### Hiện trạng:
- Schema `Person` không có trường `alias` hoặc `pseudonym`
- Form thêm/sửa nhân khẩu không có trường nhập bí danh

### Cần bổ sung:
1. Thêm trường `alias` (String?) vào model `Person` trong `schema.prisma`
2. Cập nhật API `/api/persons` để xử lý trường `alias`
3. Cập nhật UI form thêm/sửa nhân khẩu để có trường nhập bí danh
4. Cập nhật chức năng tìm kiếm để có thể tìm theo bí danh

---

## ⚠️ 2. CHƯA ĐẦY ĐỦ: Phân quyền theo nghiệp vụ

### Yêu cầu:
- **Tổ trưởng và tổ phó** có quyền thực hiện tất cả các nghiệp vụ quản lý
- **Các cán bộ khác** chỉ phụ trách từng nghiệp vụ theo phân công

### Hiện trạng:
- Schema có comment về role `MANAGER` nhưng code chỉ sử dụng `ADMIN` và `USER`
- Chưa có hệ thống phân quyền chi tiết theo từng nghiệp vụ
- Chưa có bảng quản lý quyền của từng cán bộ

### Cần bổ sung:
1. Thêm role `MANAGER` (Tổ trưởng/Tổ phó) vào enum Role
2. Tạo bảng `UserPermission` hoặc `UserRole` để quản lý quyền theo nghiệp vụ:
   - Quản lý hộ khẩu
   - Quản lý nhân khẩu
   - Quản lý tạm vắng/tạm trú
   - Quản lý nhà văn hóa
   - Duyệt yêu cầu
   - Xem thống kê
3. Cập nhật middleware và API để kiểm tra quyền theo nghiệp vụ
4. Tạo UI quản lý phân quyền cho ADMIN

---

## ⚠️ 3. CHƯA ĐẦY ĐỦ: Xử lý đặc biệt cho "Thêm nhân khẩu mới (Sinh con)"

### Yêu cầu:
- Thêm thông tin nhân khẩu mới
- Bỏ trống nghề nghiệp/CMND
- Nơi chuyển đến ghi là "mới sinh"

### Hiện trạng:
- API cho phép bỏ trống `occupation` và `idNumber` (đã đúng)
- Nhưng không có xử lý đặc biệt để tự động ghi "mới sinh" vào `previousAddress` hoặc `notes`
- Không có flag hoặc type để đánh dấu đây là trường hợp sinh con

### Cần bổ sung:
1. Thêm trường `isNewBorn` (Boolean) hoặc `birthType` (String) vào model `Person`
2. Hoặc thêm logic trong API: nếu `previousAddress` không được cung cấp và người dùng chọn "Sinh con", tự động set `previousAddress = "mới sinh"`
3. Cập nhật UI form để có checkbox/option "Sinh con" để tự động điền các trường phù hợp
4. Cập nhật `PersonChangeHistory` để ghi nhận loại thay đổi là "BIRTH" hoặc "NEW_BORN"

---

## ⚠️ 4. CHƯA ĐẦY ĐỦ: Thống kê tài sản nhà văn hóa

### Yêu cầu:
- Cán bộ quản lý cần **thống kê số lượng** tài sản
- Kiểm tra hiện trạng và thống kê

### Hiện trạng:
- Có API `GET /api/cultural-centers/[id]/assets` để lấy danh sách tài sản
- Có model `CulturalCenterAsset` với các trường: `name`, `category`, `quantity`, `condition`
- **THIẾU**: API thống kê tài sản theo:
  - Tổng số lượng từng loại tài sản
  - Thống kê theo tình trạng (GOOD, FAIR, POOR, DAMAGED)
  - Thống kê theo category
  - Thống kê theo vị trí (location)

### Cần bổ sung:
1. Tạo API `GET /api/cultural-centers/[id]/assets/stats` để thống kê:
   - Tổng số lượng từng loại tài sản (group by name)
   - Số lượng theo tình trạng (group by condition)
   - Số lượng theo category (group by category)
   - Số lượng theo vị trí (group by location)
2. Tạo UI hiển thị thống kê tài sản trong trang quản lý nhà văn hóa
3. Có thể thêm biểu đồ để trực quan hóa

---

## ✅ 5. ĐÃ CÓ: Các chức năng khác

### Quản lý hộ khẩu, nhân khẩu:
- ✅ Thông tin hộ khẩu đầy đủ (số hộ khẩu, chủ hộ, địa chỉ, phường/xã, quận/huyện)
- ✅ Thông tin nhân khẩu đầy đủ (trừ bí danh - đã nêu ở trên)
- ✅ Chuyển đi (moveOutDate, moveOutPlace)
- ✅ Khai tử (status DECEASED, notes)
- ✅ Thay đổi thông tin hộ (HouseholdChangeHistory)
- ✅ Tách hộ (splitFromId, splitTo)
- ✅ Tạm vắng (TemporaryAbsence)
- ✅ Tạm trú (TemporaryResidence)
- ✅ Tìm kiếm (có trong UI)
- ✅ Xem lịch sử thay đổi (PersonChangeHistory, HouseholdChangeHistory)
- ✅ Thống kê theo giới tính
- ✅ Thống kê theo độ tuổi (Mầm non, Mẫu giáo, Cấp 1-3, Lao động, Nghỉ hưu)
- ✅ Thống kê theo khoảng thời gian
- ✅ Thống kê tạm vắng/tạm trú

### Quản lý nhà văn hóa:
- ✅ Quản lý tài sản (CulturalCenterAsset)
- ✅ Kiểm tra hiện trạng (condition field)
- ✅ Lịch hoạt động chung (CulturalCenterActivity)
- ✅ Đăng ký sử dụng riêng (CulturalCenterBooking)
- ✅ Phê duyệt (status: PENDING, APPROVED, REJECTED)
- ✅ Thu phí sử dụng (fee, CulturalCenterUsageFee)
- ⚠️ Thống kê số lượng tài sản (chưa có API riêng - đã nêu ở trên)

---

## 📊 Tóm tắt ưu tiên

### Ưu tiên cao:
1. **Thêm trường "Bí danh"** - Yêu cầu rõ ràng, dễ triển khai
2. **Thống kê tài sản nhà văn hóa** - Cần thiết cho quản lý

### Ưu tiên trung bình:
3. **Xử lý đặc biệt cho "Sinh con"** - Cải thiện UX, tự động hóa

### Ưu tiên thấp (có thể để sau):
4. **Phân quyền theo nghiệp vụ** - Phức tạp hơn, cần thiết kế kỹ

---

## 🔧 Gợi ý triển khai

### 1. Thêm trường Bí danh:
```prisma
model Person {
  // ... existing fields
  alias String? // Bí danh
}
```

### 2. Thống kê tài sản:
```typescript
// GET /api/cultural-centers/[id]/assets/stats
{
  byName: { [name: string]: number },
  byCondition: { [condition: string]: number },
  byCategory: { [category: string]: number },
  byLocation: { [location: string]: number },
  totalQuantity: number
}
```

### 3. Xử lý Sinh con:
- Thêm option "Sinh con" trong form
- Khi chọn, tự động:
  - Set `previousAddress = "mới sinh"`
  - Bỏ required cho `occupation` và `idNumber`
  - Set `changeType = "BIRTH"` trong history

### 4. Phân quyền:
- Tạo bảng `Permission` với các nghiệp vụ
- Tạo bảng `UserPermission` để gán quyền cho user
- Middleware kiểm tra quyền trước khi cho phép thao tác

---

*Tài liệu này được tạo tự động dựa trên so sánh yêu cầu và code hiện tại.*

