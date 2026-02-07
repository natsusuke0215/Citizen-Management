# Mô tả Kinh nghiệm Dự án - Hệ thống Quản lý Nhân khẩu

## Dự án: Hệ thống Quản lý Nhân khẩu và Nhà Văn hóa

**Vị trí:** Full-stack Developer  
**Thời gian:** [Điền thời gian làm việc]  
**Công nghệ:** Next.js 14, React 18, TypeScript, Prisma ORM, SQLite, Tailwind CSS, Puppeteer, JWT

### Mô tả dự án:
Phát triển hệ thống quản lý nhân khẩu và nhà văn hóa toàn diện, hỗ trợ quản lý thông tin dân cư, hộ khẩu, tạm trú/tạm vắng, và đặt lịch sử dụng nhà văn hóa cho các địa phương.

### Trách nhiệm và thành tựu:

#### 1. **Phát triển Backend API và Database**
- Thiết kế và xây dựng database schema với Prisma ORM, quản lý các entity: User, Household, Person, District, CulturalCenter, Booking, Request
- Xây dựng RESTful API với Next.js API Routes, xử lý CRUD operations cho tất cả modules
- Triển khai hệ thống phân quyền dựa trên vai trò (Role-based Access Control) với JWT authentication
- Xây dựng hệ thống workflow duyệt yêu cầu (Request approval system) với trạng thái PENDING/APPROVED/REJECTED
- Tối ưu hóa queries và xử lý quan hệ phức tạp giữa các bảng (Household split, transfer, change history)

#### 2. **Phát triển Frontend với React và TypeScript**
- Xây dựng giao diện dashboard responsive với Tailwind CSS, hỗ trợ đa thiết bị
- Phát triển các module quản lý: Hộ khẩu, Nhân khẩu, Khu phố, Nhà văn hóa, Yêu cầu, Đặt lịch
- Triển khai form validation với React Hook Form và xử lý lỗi real-time
- Xây dựng hệ thống thông báo (Notifications) với React Hot Toast
- Tích hợp calendar view để hiển thị lịch đặt nhà văn hóa và sự kiện

#### 3. **Hệ thống Thống kê và Data Visualization**
- Phát triển dashboard thống kê với các metrics: tổng nhân khẩu, hộ khẩu, mật độ dân cư
- Xây dựng biểu đồ phân tích theo độ tuổi, giới tính, dân tộc, tôn giáo sử dụng Recharts
- Triển khai tính năng thống kê sinh/tử, chuyển đi/chuyển đến theo năm
- Xây dựng advanced filters và query builder để lọc dữ liệu phức tạp

#### 4. **Tính năng Quản lý Tạm trú/Tạm vắng**
- Phát triển module quản lý tạm trú (temporary residence) cho người từ nơi khác đến
- Phát triển module quản lý tạm vắng (temporary absence) cho người đi xa dài ngày
- Tự động tạo bản ghi nhân khẩu khi cấp giấy tạm trú
- Quản lý trạng thái và thời hạn tạm trú/tạm vắng

#### 5. **Hệ thống Tạo và Xuất PDF**
- Tích hợp Puppeteer để render PDF từ HTML templates, hỗ trợ font tiếng Việt hoàn hảo
- Phát triển các template PDF theo mẫu của Bộ Công an (Thông tư 66/2023/TT-BCA):
  - Phiếu khai báo thông tin hộ khẩu (CT01)
  - Phiếu khai báo tạm trú (CT02)
  - Phiếu khai báo tạm vắng (CT03)
- Tự động tải file PDF sau khi lưu dữ liệu

#### 6. **Quản lý Nhà Văn hóa và Đặt lịch**
- Xây dựng hệ thống quản lý 3 tòa nhà văn hóa với thông tin chi tiết (tầng, phòng, diện tích, tiện ích)
- Phát triển tính năng đặt lịch với kiểm tra trùng lặp thời gian
- Triển khai chế độ hiển thị PUBLIC/PRIVATE cho lịch đặt
- Quản lý tài sản nhà văn hóa (assets) và hoạt động (activities)
- Tính toán phí sử dụng và quản lý thanh toán

#### 7. **Lịch sử Thay đổi và Audit Trail**
- Xây dựng hệ thống lưu lịch sử thay đổi cho nhân khẩu và hộ khẩu
- Ghi lại các thao tác: thêm, sửa, xóa, chuyển đi, tách hộ với timestamp và người thực hiện
- Hiển thị lịch sử thay đổi chi tiết với dữ liệu cũ/mới dạng JSON

#### 8. **Tối ưu hóa và Best Practices**
- Áp dụng TypeScript để đảm bảo type safety và giảm lỗi runtime
- Tổ chức code theo cấu trúc modular, tách biệt components, hooks, utils
- Xử lý lỗi và validation đầy đủ cho tất cả API endpoints
- Tối ưu performance với React hooks (useMemo, useCallback) và lazy loading
- Responsive design với mobile-first approach

### Kỹ năng kỹ thuật được áp dụng:
- **Frontend:** React 18, Next.js 14, TypeScript, Tailwind CSS, React Hook Form, Recharts, Leaflet
- **Backend:** Next.js API Routes, Prisma ORM, SQLite, JWT Authentication
- **Tools:** Puppeteer (PDF generation), React Hot Toast, Lucide Icons
- **Development:** Git, ESLint, TypeScript, Modular Architecture

### Kết quả đạt được:
- Hệ thống quản lý đầy đủ các chức năng từ quản lý nhân khẩu đến đặt lịch nhà văn hóa
- Giao diện thân thiện, responsive, dễ sử dụng
- Hệ thống PDF tự động theo đúng mẫu quy định của Bộ Công an
- Dashboard thống kê trực quan với biểu đồ và metrics real-time
- Code quality cao với TypeScript và best practices

---

## Phiên bản ngắn gọn (cho CV):

**Hệ thống Quản lý Nhân khẩu và Nhà Văn hóa** | Full-stack Developer  
Phát triển hệ thống quản lý nhân khẩu toàn diện với Next.js 14, TypeScript, Prisma ORM. Xây dựng các module quản lý hộ khẩu, nhân khẩu, tạm trú/tạm vắng, nhà văn hóa với hệ thống đặt lịch. Tích hợp Puppeteer để tự động tạo PDF theo mẫu Bộ Công an. Phát triển dashboard thống kê với Recharts và advanced filters. Triển khai phân quyền dựa trên vai trò, workflow duyệt yêu cầu, và audit trail. Giao diện responsive với Tailwind CSS, hỗ trợ đa thiết bị.

**Công nghệ:** Next.js 14, React 18, TypeScript, Prisma ORM, SQLite, Tailwind CSS, Puppeteer, JWT, Recharts



