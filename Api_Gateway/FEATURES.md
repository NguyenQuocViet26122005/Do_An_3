# Danh sách chức năng API

## ✅ Chức năng đã hoàn thành

### 1. Authentication (Xác thực)
- ✅ POST `/api/auth/login` - Đăng nhập
- ✅ POST `/api/auth/register` - Đăng ký tài khoản

### 2. Quản lý Tòa nhà
- ✅ GET `/api/toanha` - Lấy danh sách tòa nhà
- ✅ GET `/api/toanha/{id}` - Lấy thông tin tòa nhà
- ✅ POST `/api/toanha` - Tạo tòa nhà mới (Admin, CanBo)
- ✅ PUT `/api/toanha/{id}` - Cập nhật tòa nhà (Admin, CanBo)
- ✅ DELETE `/api/toanha/{id}` - Xóa tòa nhà (Admin)

**Tính năng:**
- Quản lý thông tin tòa nhà (mã tòa, tên, loại, số tầng)
- Gán cán bộ quản lý cho tòa nhà
- Thống kê số phòng và phòng trống
- Kiểm tra ràng buộc khi xóa (không cho xóa nếu có phòng)

### 3. Quản lý Phòng
- ✅ GET `/api/phong` - Lấy danh sách phòng (có filter)
- ✅ GET `/api/phong/{id}` - Lấy thông tin phòng
- ✅ POST `/api/phong` - Tạo phòng mới (Admin, CanBo)
- ✅ PUT `/api/phong/{id}` - Cập nhật phòng (Admin, CanBo)
- ✅ DELETE `/api/phong/{id}` - Xóa phòng (Admin)

**Tính năng:**
- Quản lý thông tin phòng (số phòng, tầng, loại, sức chứa, giá)
- Tự động tạo giường khi tạo phòng
- Lọc phòng theo tòa nhà và trạng thái
- Thống kê số giường trống
- Kiểm tra ràng buộc khi cập nhật/xóa

**Query Parameters:**
- `maToaNha` - Lọc theo tòa nhà
- `trangThai` - Lọc theo trạng thái (ConTrong, DayPhong, BaoTri)

---

## ⏳ Chức năng đang phát triển

### 4. Quản lý Sinh viên
- ⏳ GET `/api/sinhvien` - Lấy danh sách sinh viên
- ⏳ GET `/api/sinhvien/{id}` - Lấy thông tin sinh viên
- ⏳ PUT `/api/sinhvien/{id}` - Cập nhật thông tin sinh viên
- ⏳ GET `/api/sinhvien/profile` - Lấy thông tin cá nhân

### 5. Đăng ký phòng
- ⏳ GET `/api/dangky` - Lấy danh sách đăng ký
- ⏳ GET `/api/dangky/{id}` - Lấy thông tin đăng ký
- ⏳ POST `/api/dangky` - Sinh viên đăng ký phòng
- ⏳ PUT `/api/dangky/{id}/duyet` - Cán bộ duyệt đăng ký
- ⏳ PUT `/api/dangky/{id}/tuchoi` - Cán bộ từ chối đăng ký
- ⏳ DELETE `/api/dangky/{id}` - Hủy đăng ký

### 6. Quản lý Hợp đồng
- ⏳ GET `/api/hopdong` - Lấy danh sách hợp đồng
- ⏳ GET `/api/hopdong/{id}` - Lấy thông tin hợp đồng
- ⏳ POST `/api/hopdong` - Tạo hợp đồng (Cán bộ)
- ⏳ PUT `/api/hopdong/{id}` - Cập nhật hợp đồng
- ⏳ PUT `/api/hopdong/{id}/chamDut` - Chấm dứt hợp đồng

### 7. Quản lý Hóa đơn
- ⏳ GET `/api/hoadon` - Lấy danh sách hóa đơn
- ⏳ GET `/api/hoadon/{id}` - Lấy thông tin hóa đơn
- ⏳ POST `/api/hoadon` - Tạo hóa đơn (Cán bộ)
- ⏳ PUT `/api/hoadon/{id}` - Cập nhật hóa đơn
- ⏳ POST `/api/hoadon/{id}/thanhtoan` - Thanh toán hóa đơn

### 8. Quản lý Vi phạm
- ⏳ GET `/api/vipham` - Lấy danh sách vi phạm
- ⏳ GET `/api/vipham/{id}` - Lấy thông tin vi phạm
- ⏳ POST `/api/vipham` - Ghi nhận vi phạm (Cán bộ)
- ⏳ PUT `/api/vipham/{id}` - Cập nhật vi phạm
- ⏳ DELETE `/api/vipham/{id}` - Xóa vi phạm

### 9. Quản lý Thông báo
- ⏳ GET `/api/thongbao` - Lấy danh sách thông báo
- ⏳ GET `/api/thongbao/{id}` - Lấy thông tin thông báo
- ⏳ POST `/api/thongbao` - Tạo thông báo (Cán bộ)
- ⏳ PUT `/api/thongbao/{id}/daDoc` - Đánh dấu đã đọc
- ⏳ DELETE `/api/thongbao/{id}` - Xóa thông báo

### 10. Quản lý Bảo trì
- ⏳ GET `/api/baotri` - Lấy danh sách yêu cầu bảo trì
- ⏳ GET `/api/baotri/{id}` - Lấy thông tin yêu cầu
- ⏳ POST `/api/baotri` - Tạo yêu cầu bảo trì (Sinh viên)
- ⏳ PUT `/api/baotri/{id}/xuly` - Xử lý yêu cầu (Cán bộ)
- ⏳ PUT `/api/baotri/{id}` - Cập nhật yêu cầu

### 11. Báo cáo & Thống kê
- ⏳ GET `/api/baocao` - Lấy danh sách báo cáo
- ⏳ GET `/api/baocao/{id}` - Lấy thông tin báo cáo
- ⏳ POST `/api/baocao/doanhthu` - Báo cáo doanh thu (Admin)
- ⏳ POST `/api/baocao/sinhvien` - Báo cáo sinh viên (Admin)
- ⏳ POST `/api/baocao/phong` - Báo cáo phòng (Admin)
- ⏳ POST `/api/baocao/vipham` - Báo cáo vi phạm (Admin)

### 12. Dashboard
- ⏳ GET `/api/dashboard/admin` - Dashboard Admin
- ⏳ GET `/api/dashboard/canbo` - Dashboard Cán bộ
- ⏳ GET `/api/dashboard/sinhvien` - Dashboard Sinh viên

---

## 📊 Tiến độ

- ✅ Hoàn thành: 2/12 chức năng (17%)
- ⏳ Đang phát triển: 0/12 chức năng
- ⏹️ Chưa bắt đầu: 10/12 chức năng (83%)

---

## 🔐 Phân quyền

### Admin
- Toàn quyền quản trị hệ thống
- Quản lý tòa nhà, phòng
- Xem báo cáo thống kê
- Quản lý tài khoản

### Cán bộ KTX
- Quản lý tòa nhà, phòng được phân công
- Duyệt đăng ký phòng
- Tạo hợp đồng, hóa đơn
- Ghi nhận vi phạm
- Xử lý yêu cầu bảo trì
- Gửi thông báo

### Sinh viên
- Xem thông tin phòng trống
- Đăng ký phòng
- Xem hợp đồng, hóa đơn
- Thanh toán hóa đơn
- Gửi yêu cầu bảo trì
- Nhận thông báo

---

## 📝 Ghi chú

- Tất cả API đều yêu cầu JWT token (trừ login/register)
- Response format: `ApiResponse<T>` với `success`, `message`, `data`
- Validation được thực hiện ở cả DTO và BLL
- Transaction được sử dụng cho các thao tác phức tạp
