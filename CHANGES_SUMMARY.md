# Tóm tắt các thay đổi theo yêu cầu

## 📋 Tổng quan

Đã cập nhật hệ thống quản lý nhân khẩu và nhà văn hóa theo yêu cầu của Ban quản lý tổ dân phố 7 phường La Khê.

## ✅ 1. Quản lý thông tin hộ khẩu, nhân khẩu

### 1.1. Thông tin hộ khẩu (Household)

**Các trường mới được thêm:**
- `ownerName` - Họ tên chủ hộ (bắt buộc)
- `street` - Đường phố (ấp) (tùy chọn)
- `ward` - Phường (xã, thị trấn) (bắt buộc)
- `district` - Quận (huyện) (bắt buộc)

**Chức năng mới:**
- ✅ Lịch sử thay đổi hộ khẩu (`HouseholdChangeHistory`)
- ✅ Tách hộ khẩu (`POST /api/households/[id]/split`)
- ✅ Quan hệ tách hộ (splitFrom/splitTo)

### 1.2. Thông tin nhân khẩu (Person)

**Các trường mới được thêm:**
- `placeOfBirth` - Nơi sinh
- `origin` - Nguyên quán
- `ethnicity` - Dân tộc
- `occupation` - Nghề nghiệp
- `workplace` - Nơi làm việc
- `idType` - Loại giấy tờ (CMND/CCCD)
- `idIssueDate` - Ngày cấp
- `idIssuePlace` - Nơi cấp
- `registrationDate` - Ngày đăng ký thường trú
- `previousAddress` - Địa chỉ nơi thường trú trước khi chuyển đến
- `status` - Trạng thái (ACTIVE, MOVED_OUT, DECEASED)
- `moveOutDate` - Ngày chuyển đi
- `moveOutPlace` - Nơi chuyển đến
- `notes` - Ghi chú (ví dụ: "Đã qua đời")

**Lưu ý:** `idNumber` giờ là tùy chọn (trẻ em chưa có CMND/CCCD)

**Chức năng mới:**
- ✅ Lịch sử thay đổi nhân khẩu (`PersonChangeHistory`)
- ✅ Thêm nhân khẩu mới (tự động ghi lịch sử)
- ✅ Thay đổi nhân khẩu (chuyển đi, qua đời)
- ✅ Tạm vắng (`TemporaryAbsence`)
- ✅ Tạm trú (`TemporaryResidence`)

### 1.3. Các hoạt động biến đổi nhân khẩu

**Đã triển khai:**
- ✅ Thêm nhân khẩu mới: Tự động ghi lịch sử với type "ADD"
- ✅ Thay đổi nhân khẩu: API `POST /api/persons/[id]/changes` hỗ trợ:
  - `MOVE_OUT` - Chuyển đi
  - `DECEASED` - Qua đời
  - `UPDATE` - Cập nhật thông tin
- ✅ Tách hộ: API `POST /api/households/[id]/split`
- ✅ Tạm vắng: API `/api/temporary-absences`
- ✅ Tạm trú: API `/api/temporary-residences`

### 1.4. Tìm kiếm và thống kê

**Đã triển khai:**
- ✅ Tìm kiếm nhân khẩu: API `GET /api/persons` với các filter
- ✅ Xem lịch sử thay đổi: API `GET /api/persons/[id]/changes`
- ✅ Thống kê nhân khẩu: API `GET /api/persons/stats` hỗ trợ:
  - Theo giới tính (`byGender=true`)
  - Theo độ tuổi (`byAge=true`): Mầm non, Mẫu giáo, Cấp 1, Cấp 2, Cấp 3, Độ tuổi lao động, Nghỉ hưu
  - Theo khoảng thời gian (`byTimeRange=true&startDate=...&endDate=...`)
  - Tạm vắng/Tạm trú (`byTemporaryStatus=true`)

## ✅ 2. Quản lý sử dụng nhà văn hoá

### 2.1. Thông tin nhà văn hóa (CulturalCenter)

**Các trường mới:**
- `area` - Diện tích (m2)
- `yearBuilt` - Năm xây dựng

### 2.2. Quản lý tài sản (CulturalCenterAsset)

**Đã triển khai:**
- ✅ Model `CulturalCenterAsset` với các trường:
  - `name` - Tên tài sản (bàn, ghế, loa, đài, màn hình...)
  - `category` - Loại tài sản
  - `quantity` - Số lượng
  - `condition` - Tình trạng (GOOD, FAIR, POOR, DAMAGED)
  - `location` - Vị trí trong nhà văn hóa
  - `lastChecked` - Ngày kiểm tra cuối

**API:**
- `GET /api/cultural-centers/[id]/assets` - Danh sách tài sản
- `POST /api/cultural-centers/[id]/assets` - Thêm tài sản
- `PUT /api/cultural-centers/[id]/assets/[assetId]` - Cập nhật tài sản
- `DELETE /api/cultural-centers/[id]/assets/[assetId]` - Xóa tài sản

### 2.3. Hoạt động tại nhà văn hóa (CulturalCenterActivity)

**Đã triển khai:**
- ✅ Model `CulturalCenterActivity` với các trường:
  - `title` - Tiêu đề hoạt động
  - `activityType` - Loại hoạt động (MEETING, CULTURAL, SPORTS, PROPAGANDA)
  - `startDate` - Ngày bắt đầu
  - `endDate` - Ngày kết thúc
  - `organizer` - Người tổ chức
  - `participantCount` - Số người tham gia

**API:**
- `GET /api/cultural-centers/[id]/activities` - Danh sách hoạt động
- `POST /api/cultural-centers/[id]/activities` - Tạo hoạt động

### 2.4. Đăng ký sử dụng và phí (CulturalCenterBooking & CulturalCenterUsageFee)

**Các trường mới trong Booking:**
- `type` - Loại sự kiện (EVENT, WEDDING, MEETING, ACTIVITY)
- `fee` - Phí sử dụng
- `feePaid` - Đã thanh toán

**Đã triển khai:**
- ✅ Model `CulturalCenterUsageFee` để quản lý phí sử dụng:
  - `amount` - Số tiền
  - `paymentDate` - Ngày thanh toán
  - `paymentMethod` - Phương thức thanh toán (CASH, BANK_TRANSFER)
  - `receiptNumber` - Số biên lai
  - `notes` - Ghi chú

**API:**
- `GET /api/bookings/[id]/fee` - Thông tin phí sử dụng
- `POST /api/bookings/[id]/fee` - Tạo/cập nhật phí sử dụng (chỉ Admin)

**Quy trình:**
1. User đăng ký sử dụng nhà văn hóa (có thể kèm phí)
2. Admin duyệt đăng ký (`PATCH /api/bookings/[id]/status`)
3. Admin quản lý phí sử dụng (`POST /api/bookings/[id]/fee`)
4. Hệ thống tự động cập nhật `feePaid` khi có ngày thanh toán

## 📝 Lưu ý quan trọng

### Database Migration

⚠️ **Cần thực hiện migration database trước khi sử dụng!**

Xem file `DATABASE_MIGRATION.md` để biết chi tiết.

### Các trường bắt buộc mới

Khi tạo hộ khẩu mới, cần cung cấp:
- `ownerName` - Họ tên chủ hộ
- `ward` - Phường
- `district` - Quận

Khi tạo nhân khẩu mới, chỉ cần:
- `fullName` - Họ tên
- `dateOfBirth` - Ngày sinh
- `gender` - Giới tính
- `householdId` - Hộ khẩu

Các trường khác là tùy chọn (có thể cập nhật sau).

## 🚀 Bước tiếp theo

1. **Migration database**: Xem `DATABASE_MIGRATION.md`
2. **Cập nhật frontend**: 
   - Thêm các trường mới vào form tạo/sửa hộ khẩu, nhân khẩu
   - Tạo UI cho tạm vắng/tạm trú
   - Tạo UI cho quản lý tài sản và hoạt động nhà văn hóa
   - Tạo UI cho thống kê nhân khẩu
3. **Testing**: Test tất cả các API mới
4. **Documentation**: Cập nhật tài liệu API nếu cần





