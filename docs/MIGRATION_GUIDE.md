# Hướng dẫn Migration: Tách Citizen Management thành 2 Repository

## Tổng quan

Hướng dẫn này sẽ giúp bạn tách project Citizen Management hiện tại thành 2 repository riêng biệt:
- **citizen-management-backend**: API server với Express.js
- **citizen-management-frontend**: Next.js frontend application

## Cấu trúc mới

```
citizen-management-backend/          # Backend repository
├── src/
│   ├── routes/                      # API routes
│   ├── middleware/                  # Auth middleware
│   ├── lib/                        # Utilities
│   └── server.js                   # Express server
├── prisma/
│   └── schema.prisma               # Database schema
└── package.json

citizen-management-frontend/         # Frontend repository
├── src/
│   ├── app/                        # Next.js pages
│   └── lib/                        # API client
└── package.json
```

## Bước 1: Setup Backend Repository

### 1.1 Tạo repository mới
```bash
mkdir citizen-management-backend
cd citizen-management-backend
git init
```

### 1.2 Copy files từ project gốc
```bash
# Copy Prisma schema
cp ../Citizen-Management/prisma/schema.prisma ./prisma/

# Copy database file (nếu có)
cp ../Citizen-Management/prisma/dev.db ./prisma/
```

### 1.3 Cài đặt dependencies
```bash
npm install express cors helmet express-rate-limit dotenv
npm install @prisma/client prisma bcryptjs jsonwebtoken
npm install -D nodemon tsx @types/node @types/bcryptjs @types/jsonwebtoken
```

### 1.4 Setup environment
```bash
cp env.example .env
# Chỉnh sửa .env với các giá trị phù hợp
```

### 1.5 Setup database
```bash
npm run db:generate
npm run db:push
```

### 1.6 Test backend
```bash
npm run dev
# Kiểm tra http://localhost:3001/health
```

## Bước 2: Setup Frontend Repository

### 2.1 Tạo repository mới
```bash
mkdir citizen-management-frontend
cd citizen-management-frontend
git init
```

### 2.2 Copy files từ project gốc
```bash
# Copy Next.js files
cp -r ../Citizen-Management/app ./src/
cp ../Citizen-Management/next.config.js ./
cp ../Citizen-Management/tailwind.config.js ./
cp ../Citizen-Management/postcss.config.js ./
cp ../Citizen-Management/tsconfig.json ./
```

### 2.3 Cài đặt dependencies
```bash
npm install next react react-dom
npm install react-hook-form react-hot-toast lucide-react
npm install tailwindcss autoprefixer postcss
npm install @headlessui/react clsx date-fns react-calendar
npm install leaflet react-leaflet axios
npm install -D typescript @types/node @types/react @types/react-dom
npm install -D eslint eslint-config-next
```

### 2.4 Setup environment
```bash
cp env.example .env.local
# Chỉnh sửa .env.local với API URL
```

### 2.5 Test frontend
```bash
npm run dev
# Kiểm tra http://localhost:3000
```

## Bước 3: Cấu hình Development

### 3.1 Backend (.env)
```env
DATABASE_URL="file:./dev.db"
JWT_SECRET="your-super-secret-jwt-key"
PORT=3001
NODE_ENV=development
FRONTEND_URL="http://localhost:3000"
```

### 3.2 Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_APP_NAME="Hệ thống quản lý nhân khẩu"
NEXT_PUBLIC_APP_DESCRIPTION="Quản lý hộ khẩu, nhân khẩu và nhà văn hóa"
```

## Bước 4: Chạy cả 2 services

### Terminal 1 - Backend
```bash
cd citizen-management-backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd citizen-management-frontend
npm run dev
```

## Bước 5: Kiểm tra hoạt động

1. **Backend Health Check**: http://localhost:3001/health
2. **Frontend**: http://localhost:3000
3. **Login**: http://localhost:3000/login
4. **Dashboard**: http://localhost:3000/dashboard

## Bước 6: Deploy (Optional)

### Backend Deployment
- **Vercel**: Sử dụng serverless functions
- **Railway**: Deploy Express.js app
- **Heroku**: Deploy với Procfile
- **DigitalOcean**: VPS deployment

### Frontend Deployment
- **Vercel**: Next.js deployment
- **Netlify**: Static site deployment
- **AWS S3 + CloudFront**: Static hosting

## Lưu ý quan trọng

### Database
- Backend và Frontend sử dụng chung database
- Database file nằm trong backend repository
- Có thể chuyển sang PostgreSQL cho production

### CORS
- Backend cần cấu hình CORS cho frontend domain
- Update `FRONTEND_URL` trong backend .env

### Authentication
- JWT tokens được lưu trong localStorage (frontend)
- Backend validate tokens trong mỗi request
- Auto logout khi token expired

### API Changes
- Frontend gọi API qua HTTP thay vì internal Next.js routes
- Cần handle network errors và retry logic
- Loading states cho async operations

## Troubleshooting

### Backend không start
- Kiểm tra PORT có bị conflict không
- Kiểm tra database connection
- Kiểm tra environment variables

### Frontend không connect được backend
- Kiểm tra CORS configuration
- Kiểm tra API URL trong frontend
- Kiểm tra network connectivity

### Authentication issues
- Kiểm tra JWT secret giống nhau
- Kiểm tra token format
- Kiểm tra localStorage

## Kết luận

Sau khi hoàn thành migration:
- ✅ Backend chạy độc lập trên port 3001
- ✅ Frontend chạy độc lập trên port 3000
- ✅ API communication hoạt động bình thường
- ✅ Authentication flow hoạt động
- ✅ Database được chia sẻ giữa 2 services

Bây giờ bạn có thể deploy 2 services riêng biệt và scale chúng độc lập!
