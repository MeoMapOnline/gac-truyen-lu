# Hướng Dẫn Cài Đặt & Quản Trị (Đơn Giản Nhất)

Tài liệu này sẽ giúp bạn đưa trang web lên mạng và đăng nhập vào trang quản trị.

---

## Phần 1: Đưa Web Lên Mạng (Deployment)

Bạn cần làm 3 việc chính:
1.  **Lưu code**: Đưa lên GitHub.
2.  **Chạy Backend**: Đưa lên Cloudflare Workers (để xử lý dữ liệu).
3.  **Chạy Frontend**: Đưa lên Netlify (để người dùng truy cập).

### Bước 1: Đưa code lên GitHub
1.  Vào [github.com](https://github.com) tạo một repository mới (ví dụ: `gac-truyen-lu`).
2.  Mở terminal (cửa sổ lệnh) ở thư mục dự án và chạy:
    ```bash
    git init
    git add .
    git commit -m "First commit"
    git branch -M main
    git remote add origin https://github.com/USERNAME/gac-truyen-lu.git
    git push -u origin main
    ```
    *(Thay `USERNAME` bằng tên GitHub của bạn)*

### Bước 2: Cài đặt Backend (Cloudflare)
1.  **Cài đặt công cụ**:
    ```bash
    npm install -g wrangler
    wrangler login
    ```
2.  **Tạo Database**:
    ```bash
    wrangler d1 create gac-truyen-lu-db
    ```
    *Copy `database_id` hiện ra màn hình.*
3.  **Cấu hình**: Mở file `backend/wrangler.toml`, dán `database_id` vào dòng `database_id = "..."`.
4.  **Tạo bảng dữ liệu**:
    ```bash
    cd backend
    wrangler d1 execute gac-truyen-lu-db --file=schema.sql --remote
    ```
5.  **Đưa lên mạng**:
    ```bash
    npm run deploy
    ```
    *Copy đường dẫn hiện ra (ví dụ: `https://gac-truyen-lu-backend.abc.workers.dev`). Đây là API URL.*

### Bước 3: Cài đặt Frontend (Netlify)
1.  **Cập nhật API URL**: Mở file `src/store/useAuthStore.ts` và `src/store/useStoryStore.ts`. Thay `https://backend.youware.com/api` bằng API URL bạn vừa copy ở trên.
2.  **Đẩy code cập nhật lên GitHub**:
    ```bash
    git add .
    git commit -m "Update API"
    git push
    ```
3.  **Vào Netlify**: Chọn "Import from GitHub", chọn repository `gac-truyen-lu`, rồi nhấn **Deploy**.

---

## Phần 2: Hướng Dẫn Quản Trị (Admin)

Bạn hỏi: **"Quản trị đăng nhập bằng cách nào?"**

**Trả lời**: Bạn đăng nhập bằng chính tài khoản Google của bạn trên trang web. Nhưng để hệ thống biết bạn là Admin, bạn cần **cấp quyền** cho tài khoản đó trong cơ sở dữ liệu.

### Cách cấp quyền Admin (Chỉ làm 1 lần đầu tiên)

1.  **Đăng nhập vào Web**: Truy cập trang web của bạn, bấm "Đăng nhập bằng Google".
2.  **Vào Cloudflare Dashboard** (như ảnh bạn gửi):
    *   Vào mục **D1** -> Chọn database `gac-truyen-lu-db`.
    *   Vào tab **Console** (Bảng điều khiển).
3.  **Chạy lệnh SQL sau để cấp quyền Admin cho chính bạn**:
    ```sql
    UPDATE users SET role = 'admin' WHERE email = 'EMAIL_CUA_BAN@gmail.com';
    ```
    *(Thay `EMAIL_CUA_BAN` bằng email bạn vừa dùng để đăng nhập)*.
    *   Nhấn **Execute** (Thực thi).

### Cách vào trang Quản Trị
1.  Sau khi chạy lệnh trên, quay lại trang web của bạn.
2.  Tải lại trang (F5).
3.  Vào mục **Cá Nhân**.
4.  Bạn sẽ thấy nút **Quản Trị** xuất hiện ở thanh menu dưới cùng (hoặc trong danh sách menu).
5.  Bấm vào đó để vào giao diện quản lý (Duyệt bài, Rút tiền, Thống kê...).

---

## Phần 3: Cấu hình Google Login

Để nút đăng nhập Google hoạt động trên tên miền thật (ví dụ `gactruyenlu.netlify.app`):
1.  Vào [Google Cloud Console](https://console.cloud.google.com/).
2.  Tìm Client ID bạn đang dùng.
3.  Thêm đường dẫn trang web của bạn vào mục **Authorized JavaScript origins**.
