# Công nghệ và Thư viện sử dụng trong dự án

## 📋 Tổng quan

Dự án **Hệ thống Quản lý Nhân khẩu và Nhà Văn hóa** được xây dựng trên nền tảng **Next.js 14** với **TypeScript**, sử dụng kiến trúc full-stack hiện đại.

---

## 🎯 Core Framework & Runtime

### **Next.js 14.2.35**
- **Mục đích:** Framework React full-stack với Server-Side Rendering (SSR) và Static Site Generation (SSG)
- **Sử dụng:**
  - App Router (Next.js 13+) cho routing và layout
  - API Routes cho backend endpoints (`/api/*`)
  - Server Components và Client Components
  - Built-in optimization (image, font, script)
- **Lợi ích:** SEO tốt, performance cao, tích hợp sẵn backend

### **React 18.2.0**
- **Mục đích:** UI library cho xây dựng giao diện người dùng
- **Sử dụng:**
  - Functional Components với Hooks
  - useState, useEffect, useMemo, useCallback
  - Context API cho state management
- **Tính năng:** Concurrent rendering, Suspense, Server Components

### **TypeScript 5.3.3**
- **Mục đích:** Type-safe JavaScript, giảm lỗi runtime
- **Cấu hình:**
  - Strict mode enabled
  - Path aliases (`@/*`)
  - ES5 target với ES6+ features
- **Lợi ích:** Type checking, IntelliSense, refactoring an toàn

---

## 🗄️ Database & ORM

### **Prisma 5.7.1**
- **Mục đích:** Next-generation ORM cho TypeScript và Node.js
- **Sử dụng:**
  - Schema definition (`prisma/schema.prisma`)
  - Type-safe database client (`@prisma/client`)
  - Migrations và database seeding
- **Tính năng:**
  - Auto-generated TypeScript types
  - Query builder type-safe
  - Relationship management
  - Prisma Studio cho database GUI

### **SQLite**
- **Mục đích:** Database file-based, không cần server riêng
- **Sử dụng:**
  - Development database (`prisma/dev.db`)
  - Dễ dàng migrate sang PostgreSQL/MySQL cho production
- **Lợi ích:** Zero-config, portable, phù hợp cho development

---

## 🎨 Styling & UI Components

### **Tailwind CSS 3.3.6**
- **Mục đích:** Utility-first CSS framework
- **Sử dụng:**
  - Responsive design (mobile-first)
  - Custom color palette (navy, yellow themes)
  - Custom utilities và animations
  - Dark mode support (với next-themes)
- **Tính năng:** JIT compilation, purging unused CSS, custom plugins

### **@headlessui/react 1.7.17**
- **Mục đích:** Unstyled, accessible UI components
- **Sử dụng:**
  - Dialog, Menu, Popover components
  - Accessible by default (ARIA compliant)
- **Lợi ích:** Customizable styling, accessibility built-in

### **Lucide React 0.294.0**
- **Mục đích:** Icon library với 1000+ icons
- **Sử dụng:**
  - Icons cho navigation, buttons, cards
  - Consistent icon style
- **Lợi ích:** Tree-shakeable, lightweight, TypeScript support

---

## 🔐 Authentication & Security

### **jsonwebtoken 9.0.2**
- **Mục đích:** JWT-based authentication
- **Sử dụng:**
  - Token generation và verification
  - Stateless authentication
  - Secure API endpoints
- **Tính năng:** Token expiration, payload encoding

### **bcryptjs 2.4.3**
- **Mục đích:** Password hashing (mặc dù project hiện tại dùng plain text)
- **Sẵn sàng:** Có thể tích hợp cho production security
- **Lợi ích:** One-way hashing, salt rounds

### **next-auth 4.24.5**
- **Mục đích:** Authentication framework cho Next.js
- **Trạng thái:** Đã cài đặt nhưng có thể chưa sử dụng đầy đủ
- **Tính năng:** Multiple providers, session management

---

## 📝 Form Handling & Validation

### **react-hook-form 7.48.2**
- **Mục đích:** Form state management và validation
- **Sử dụng:**
  - Form validation với rules
  - Performance optimization (uncontrolled components)
  - Error handling và display
- **Lợi ích:** Minimal re-renders, easy validation

---

## 📊 Data Visualization

### **Recharts 3.6.0**
- **Mục đích:** Chart library cho React
- **Sử dụng:**
  - Age groups chart (Bar chart)
  - Gender statistics (Pie chart)
  - Population statistics visualization
- **Components:** BarChart, PieChart, ResponsiveContainer
- **Lợi ích:** Responsive, customizable, TypeScript support

---

## 📄 PDF Generation

### **Puppeteer ^24.34.0**
- **Mục đích:** Headless Chrome browser automation
- **Sử dụng:**
  - Render HTML templates thành PDF
  - Hỗ trợ font tiếng Việt hoàn hảo
  - Server-side PDF generation
- **Templates:**
  - Phiếu khai báo hộ khẩu (CT01)
  - Phiếu khai báo tạm trú (CT02)
  - Phiếu khai báo tạm vắng (CT03)
- **Lợi ích:** High-quality PDF, CSS support, font rendering

### **jsPDF ^3.0.4** & **jspdf-autotable ^5.0.2**
- **Mục đích:** Client-side PDF generation (legacy)
- **Trạng thái:** Đã migrate sang Puppeteer nhưng vẫn giữ lại
- **Sử dụng:** Fallback hoặc simple PDF generation

### **pdf-lib 1.17.1**
- **Mục đích:** PDF manipulation library
- **Sử dụng:** PDF editing, merging, form filling
- **Lợi ích:** Create/modify PDFs programmatically

---

## 🗓️ Calendar & Date Management

### **react-calendar 4.6.0**
- **Mục đích:** Calendar component cho React
- **Sử dụng:**
  - Date picker trong forms
  - Calendar view cho bookings
- **Tính năng:** Date selection, range selection, localization

### **date-fns 2.30.0**
- **Mục đích:** Date utility library
- **Sử dụng:**
  - Format dates (dd/MM/yyyy)
  - Date calculations (age, duration)
  - Date comparisons và filtering
- **Lợi ích:** Lightweight, immutable, tree-shakeable

---

## 🗺️ Maps & Location

### **Leaflet 1.9.4** & **react-leaflet 4.2.1**
- **Mục đích:** Interactive maps
- **Sử dụng:**
  - Hiển thị vị trí nhà văn hóa
  - Map markers và popups
- **Tính năng:** OpenStreetMap integration, custom markers

---

## 🔔 Notifications & Feedback

### **react-hot-toast 2.4.1**
- **Mục đích:** Toast notification library
- **Sử dụng:**
  - Success/error messages
  - Loading states
  - User feedback
- **Tính năng:** Auto-dismiss, positioning, animations

---

## 🎨 Theme & Dark Mode

### **next-themes ^0.4.6**
- **Mục đích:** Theme management cho Next.js
- **Sử dụng:**
  - Dark/light mode switching
  - System theme detection
  - Theme persistence
- **Tính năng:** SSR-safe, no flash, localStorage sync

---

## 🛠️ Utility Libraries

### **clsx 2.0.0**
- **Mục đích:** Conditional className utility
- **Sử dụng:** Dynamic CSS classes với conditions
- **Lợi ích:** Clean code, easy conditional styling

### **autoprefixer 10.4.16**
- **Mục đích:** CSS vendor prefixing
- **Sử dụng:** PostCSS plugin cho Tailwind
- **Lợi ích:** Cross-browser compatibility

### **postcss 8.4.32**
- **Mục đích:** CSS processing tool
- **Sử dụng:** Tailwind CSS compilation
- **Tính năng:** Plugin system, CSS transformations

---

## 🧪 Development Tools

### **ESLint 8.56.0**
- **Mục đích:** JavaScript/TypeScript linting
- **Cấu hình:** `eslint-config-next` cho Next.js best practices
- **Lợi ích:** Code quality, consistency, catch errors early

### **tsx 4.6.2**
- **Mục đích:** TypeScript execution tool
- **Sử dụng:**
  - Run TypeScript scripts (`db:seed`)
  - Development scripts
- **Lợi ích:** No compilation step, fast execution

---

## 📦 Type Definitions

### **@types packages**
- `@types/node`, `@types/react`, `@types/react-dom`
- `@types/bcryptjs`, `@types/jsonwebtoken`
- `@types/jspdf`, `@types/puppeteer`
- **Mục đích:** TypeScript type definitions cho JavaScript libraries
- **Lợi ích:** Type safety, IntelliSense support

---

## 🏗️ Project Structure & Architecture

### **App Router (Next.js 13+)**
- File-based routing với `app/` directory
- Layouts và nested routes
- Server và Client Components separation

### **API Routes**
- RESTful API trong `app/api/`
- Route handlers với TypeScript
- Middleware cho authentication

### **Modular Architecture**
- Components trong `components/` và `app/*/components/`
- Hooks trong `app/*/hooks/`
- Utils trong `lib/` và `app/*/utils/`
- Types trong `lib/types.ts` và `app/*/types/`

---

## 🔄 Build & Deployment

### **Build Process**
- `npm run build` - Production build với optimization
- `npm run dev` - Development server với hot reload
- `npm start` - Production server

### **Database Management**
- `npm run db:generate` - Generate Prisma Client
- `npm run db:push` - Push schema to database
- `npm run db:migrate` - Run migrations
- `npm run db:studio` - Open Prisma Studio GUI
- `npm run db:seed` - Seed database với sample data

---

## 📈 Performance Optimizations

1. **Code Splitting:** Automatic với Next.js
2. **Image Optimization:** Next.js Image component
3. **Font Optimization:** Next.js Font optimization
4. **Tree Shaking:** Unused code elimination
5. **Memoization:** React.useMemo, useCallback
6. **Lazy Loading:** Dynamic imports cho components

---

## 🔒 Security Considerations

1. **JWT Authentication:** Secure token-based auth
2. **Input Validation:** Form validation với react-hook-form
3. **SQL Injection Protection:** Prisma ORM parameterized queries
4. **XSS Prevention:** React's built-in escaping
5. **CORS:** API route protection
6. **Environment Variables:** Sensitive data trong `.env.local`

---

## 🌐 Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)
- Responsive design cho all screen sizes

---

## 📚 Learning Resources

- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **React:** https://react.dev
- **TypeScript:** https://www.typescriptlang.org/docs

---

## 🔮 Future Enhancements

Có thể tích hợp thêm:
- **Redis:** Caching và session storage
- **PostgreSQL/MySQL:** Production database
- **Docker:** Containerization
- **CI/CD:** GitHub Actions, Vercel
- **Testing:** Jest, React Testing Library
- **Monitoring:** Sentry, LogRocket
- **API Documentation:** Swagger/OpenAPI

