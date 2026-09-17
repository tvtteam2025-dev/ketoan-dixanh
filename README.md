# App Kế Toán Đi Xanh

Webapp riêng dành cho bộ phận kế toán, gồm dashboard tài chính, giao dịch thu–chi, hóa đơn, công nợ, đối tác, sổ kế toán và báo cáo.

## Chạy ứng dụng

Yêu cầu Node.js 22.13 trở lên.

```powershell
cd C:\Users\Admin\Desktop\AppKeToan
npm run dev
```

Mở `http://localhost:3000` trong trình duyệt.

## Kiểm tra bản production

```powershell
npm run build
npm run start
```

## Dữ liệu và chức năng

Ứng dụng kết nối qua API của hệ thống Đi Xanh tại `103.118.29.100:8020`, do đó sử dụng chung Google Sheets và không tạo bản sao dữ liệu.

Phạm vi được giữ theo đúng quyền Kế toán của app cũ:

- Xem đơn hàng và xác nhận trạng thái nộp tiền.
- Quản lý hóa đơn, cập nhật trạng thái và tạo hóa đơn gộp.
- Theo dõi, xác nhận thu hồi và xuất báo cáo công nợ.
- Theo dõi, xác nhận và xuất báo cáo hoa hồng xe thương quyền.
- Xuất các báo cáo Excel được phân quyền.
- Tính chi phí sử dụng xe qua đêm.

Đăng nhập bằng tài khoản Kế toán đã được tạo trong hệ thống Đi Xanh. Có thể đổi máy chủ dữ liệu bằng biến `DIXANH_API_URL` trong `.env.local`.
