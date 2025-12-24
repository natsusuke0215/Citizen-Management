# Hướng dẫn Migration Database

## ⚠️ Lưu ý quan trọng

Do schema đã được cập nhật với nhiều trường mới bắt buộc, bạn cần thực hiện migration database. Có 2 cách:

### Cách 1: Reset database (Mất toàn bộ dữ liệu)

Nếu bạn đang trong môi trường development và không cần giữ lại dữ liệu cũ:

```bash
# Xóa database cũ
rm prisma/dev.db

# Tạo database mới
npx prisma db push

# (Tùy chọn) Seed dữ liệu mẫu
npm run db:seed
```

### Cách 2: Migration với giữ lại dữ liệu (Khuyến nghị cho production)

1. **Tạo migration script** để cập nhật dữ liệu hiện có:

```bash
npx prisma migrate dev --name add_new_fields
```

2. **Cập nhật dữ liệu hiện có** trong database:

```sql
-- Cập nhật các hộ khẩu hiện có với dữ liệu mặc định
UPDATE households 
SET 
  ownerName = 'Chưa cập nhật',
  ward = 'Chưa cập nhật',
  district = 'Chưa cập nhật'
WHERE ownerName IS NULL OR ward IS NULL OR district IS NULL;
```

3. **Sau đó chạy migration**:

```bash
npx prisma migrate deploy
```

## Các thay đổi chính trong schema

### Household (Hộ khẩu)
- ✅ Thêm `ownerName` (Họ tên chủ hộ) - **BẮT BUỘC**
- ✅ Thêm `street` (Đường phố/ấp) - Tùy chọn
- ✅ Thêm `ward` (Phường/xã/thị trấn) - **BẮT BUỘC**
- ✅ Thêm `district` (Quận/huyện) - **BẮT BUỘC**
- ✅ Thêm quan hệ `changeHistory` (Lịch sử thay đổi)
- ✅ Thêm quan hệ `splitFrom` và `splitTo` (Tách hộ)

### Person (Nhân khẩu)
- ✅ Thêm nhiều trường mới: `placeOfBirth`, `origin`, `ethnicity`, `occupation`, `workplace`
- ✅ Thêm thông tin giấy tờ: `idType`, `idIssueDate`, `idIssuePlace`, `registrationDate`
- ✅ Thêm `previousAddress` (Địa chỉ cũ)
- ✅ Thêm `status` (ACTIVE, MOVED_OUT, DECEASED)
- ✅ Thêm `moveOutDate`, `moveOutPlace`, `notes`
- ✅ Thêm quan hệ `changeHistory`, `temporaryAbsences`, `temporaryResidences`
- ⚠️ `idNumber` giờ là **TÙY CHỌN** (trẻ em chưa có CMND/CCCD)

### CulturalCenter (Nhà văn hóa)
- ✅ Thêm `area` (Diện tích m2)
- ✅ Thêm `yearBuilt` (Năm xây dựng)
- ✅ Thêm quan hệ `assets` và `activities`

### CulturalCenterBooking (Đặt lịch)
- ✅ Thêm `type` (EVENT, WEDDING, MEETING, ACTIVITY)
- ✅ Thêm `fee` (Phí sử dụng)
- ✅ Thêm `feePaid` (Đã thanh toán)
- ✅ Thêm quan hệ `usageFee`

### Các model mới
- ✅ `PersonChangeHistory` - Lịch sử thay đổi nhân khẩu
- ✅ `HouseholdChangeHistory` - Lịch sử thay đổi hộ khẩu
- ✅ `TemporaryAbsence` - Tạm vắng
- ✅ `TemporaryResidence` - Tạm trú
- ✅ `CulturalCenterAsset` - Tài sản nhà văn hóa
- ✅ `CulturalCenterActivity` - Hoạt động nhà văn hóa
- ✅ `CulturalCenterUsageFee` - Phí sử dụng nhà văn hóa

## API mới được thêm

### Nhân khẩu
- `GET /api/persons/[id]/changes` - Lịch sử thay đổi nhân khẩu
- `POST /api/persons/[id]/changes` - Ghi nhận thay đổi (chuyển đi, qua đời)
- `GET /api/persons/stats` - Thống kê nhân khẩu

### Hộ khẩu
- `POST /api/households/[id]/split` - Tách hộ khẩu

### Tạm vắng/Tạm trú
- `GET /api/temporary-absences` - Danh sách tạm vắng
- `POST /api/temporary-absences` - Tạo giấy tạm vắng
- `GET /api/temporary-residences` - Danh sách tạm trú
- `POST /api/temporary-residences` - Tạo giấy tạm trú

### Nhà văn hóa
- `GET /api/cultural-centers/[id]/assets` - Danh sách tài sản
- `POST /api/cultural-centers/[id]/assets` - Thêm tài sản
- `PUT /api/cultural-centers/[id]/assets/[assetId]` - Cập nhật tài sản
- `DELETE /api/cultural-centers/[id]/assets/[assetId]` - Xóa tài sản
- `GET /api/cultural-centers/[id]/activities` - Danh sách hoạt động
- `POST /api/cultural-centers/[id]/activities` - Tạo hoạt động
- `GET /api/bookings/[id]/fee` - Thông tin phí sử dụng
- `POST /api/bookings/[id]/fee` - Tạo/cập nhật phí sử dụng

## Sau khi migration

1. **Cập nhật dữ liệu hiện có**: Đảm bảo tất cả hộ khẩu có đầy đủ thông tin mới
2. **Kiểm tra API**: Test các API mới để đảm bảo hoạt động đúng
3. **Cập nhật frontend**: Cập nhật các form và component để hỗ trợ các trường mới




