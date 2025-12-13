# Hướng Dẫn Triển Khai (Deployment Guide)

Tài liệu này hướng dẫn chi tiết cách đưa mã nguồn lên GitHub, triển khai Backend lên Cloudflare Workers và Frontend lên Netlify.

## 1. Đưa mã nguồn lên GitHub

### Bước 1: Tạo Repository mới trên GitHub
1. Truy cập [github.com](https://github.com) và đăng nhập.
2. Nhấn nút **New** (hoặc dấu + ở góc trên bên phải -> New repository).
3. Đặt tên cho repository (ví dụ: `gac-truyen-lu`).
4. Chọn **Public** hoặc **Private**.
5. Nhấn **Create repository**.

### Bước 2: Đẩy code lên GitHub
Mở terminal (hoặc Command Prompt) tại thư mục dự án của bạn và chạy các lệnh sau:

```bash
# Khởi tạo git nếu chưa có
git init

# Thêm tất cả file vào git
git add .

# Commit code
git commit -m "Initial commit"

# Đổi tên nhánh chính thành main
git branch -M main

# Liên kết với repository trên GitHub (thay URL bằng URL của bạn)
git remote add origin https://github.com/USERNAME/gac-truyen-lu.git

# Đẩy code lên
git push -u origin main
```

---

## 2. Triển khai Backend lên Cloudflare Workers

Backend chịu trách nhiệm xử lý dữ liệu, đăng nhập và cơ sở dữ liệu.

### Bước 1: Cài đặt Wrangler (Cloudflare CLI)
Nếu chưa cài đặt, chạy lệnh:
```bash
npm install -g wrangler
```

### Bước 2: Đăng nhập Cloudflare
```bash
wrangler login
```
Trình duyệt sẽ mở ra, hãy đăng nhập và cho phép Wrangler truy cập.

### Bước 3: Tạo Database D1
```bash
wrangler d1 create gac-truyen-lu-db
```
Sau khi chạy, bạn sẽ nhận được `database_id`. Hãy copy nó.

### Bước 4: Cấu hình `backend/wrangler.toml`
Mở file `backend/wrangler.toml` và cập nhật `database_id`:

```toml
[[d1_databases]]
binding = "DB"
database_name = "gac-truyen-lu-db"
database_id = "PASTE_YOUR_DATABASE_ID_HERE"
```

### Bước 5: Khởi tạo bảng (Schema)
Chạy lệnh sau để tạo bảng trong database thật trên Cloudflare:
```bash
cd backend
wrangler d1 execute gac-truyen-lu-db --file=schema.sql --remote
```

### Bước 6: Triển khai Backend
```bash
npm run deploy
```
Sau khi xong, bạn sẽ nhận được một URL (ví dụ: `https://gac-truyen-lu-backend.username.workers.dev`).
**Hãy copy URL này.**

---

## 3. Triển khai Frontend lên Netlify

Frontend là giao diện người dùng (React).

### Bước 1: Cập nhật API URL
Mở file `src/store/useAuthStore.ts` và `src/store/useStoryStore.ts`.
Thay thế `https://backend.youware.com/api` bằng URL Backend của bạn vừa nhận được ở trên.

Ví dụ:
```typescript
const API_URL = 'https://gac-truyen-lu-backend.username.workers.dev/api';
```

### Bước 2: Đẩy code cập nhật lên GitHub
```bash
git add .
git commit -m "Update API URL"
git push
```

### Bước 3: Kết nối Netlify với GitHub
1. Truy cập [netlify.com](https://www.netlify.com) và đăng nhập.
2. Nhấn **Add new site** -> **Import from existing project**.
3. Chọn **GitHub**.
4. Tìm và chọn repository `gac-truyen-lu`.

### Bước 4: Cấu hình Build
Netlify thường tự động nhận diện, nhưng hãy kiểm tra:
- **Build command**: `npm run build`
- **Publish directory**: `dist`

### Bước 5: Deploy
Nhấn **Deploy site**. Netlify sẽ tự động build và cung cấp cho bạn một đường dẫn (ví dụ: `https://gac-truyen-lu.netlify.app`).

---

## 4. Cấu hình Google Login (Quan trọng)

Để nút đăng nhập Google hoạt động trên domain mới:

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/).
2. Chọn project chứa Client ID của bạn.
3. Vào **APIs & Services** -> **Credentials**.
4. Chọn Client ID đang dùng.
5. Tại mục **Authorized JavaScript origins**, thêm URL của Netlify (ví dụ: `https://gac-truyen-lu.netlify.app`).
6. Lưu lại.

## Hoàn tất!
Bây giờ trang web của bạn đã chạy thật sự trên internet:
- Frontend: Netlify
- Backend: Cloudflare Workers
- Database: Cloudflare D1
- Code: GitHub
