# Hệ thống Kế Toán Đi Xanh

Repository chứa đầy đủ frontend kế toán và backend nghiệp vụ Đi Xanh.

## Cấu trúc

- Thư mục gốc: frontend React/Vinext dành cho bộ phận kế toán.
- `backend/`: API FastAPI, giao diện vận hành cũ và các cấu hình triển khai mẫu.
- Dữ liệu vận hành, `.env`, service account, virtual environment và các bản backup không được commit.

## Chạy ứng dụng

Yêu cầu Node.js 22.13 trở lên.

```powershell
npm run dev
```

Mở `http://localhost:3000` trong trình duyệt.

## Kiểm tra bản production

```powershell
npm run build
npm run start
```

## Dữ liệu và chức năng

Frontend kết nối với API backend qua biến `DIXANH_API_URL`, sử dụng chung dữ liệu Google Sheets và không tạo bản sao dữ liệu.

Phạm vi được giữ theo đúng quyền Kế toán của app cũ:

- Xem đơn hàng và xác nhận trạng thái nộp tiền.
- Quản lý hóa đơn, cập nhật trạng thái và tạo hóa đơn gộp.
- Theo dõi, xác nhận thu hồi và xuất báo cáo công nợ.
- Theo dõi, xác nhận và xuất báo cáo hoa hồng xe thương quyền.
- Xuất các báo cáo Excel được phân quyền.
- Tính chi phí sử dụng xe qua đêm.

Đăng nhập bằng tài khoản Kế toán đã được tạo trong hệ thống Đi Xanh. Có thể đổi máy chủ dữ liệu bằng biến `DIXANH_API_URL` trong `.env.local`.

## Chạy backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\pip install -r requirements.txt
Copy-Item .env.example .env
.venv\Scripts\uvicorn main:app --host 127.0.0.1 --port 8020
```

Điền cấu hình Google Sheets và tài khoản trong `backend/.env` trước khi chạy. File này đã được loại trừ khỏi Git.

## Quy tắc tăng ca Xe Hàng

Giờ tăng ca tính lương mỗi ngày được tính từ tổng thời gian ca, trừ **10 giờ công chuẩn** và giờ nghỉ trưa đã khai báo. Mức làm tròn và đơn giá được xử lý tại backend.
