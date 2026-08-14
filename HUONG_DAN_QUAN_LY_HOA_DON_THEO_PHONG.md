# 📋 HƯỚNG DẪN QUẢN LÝ HÓA ĐƠN THEO PHÒNG

## 🎯 Tổng quan tính năng

Hệ thống quản lý hóa đơn đã được nâng cấp với tính năng **hiển thị và quản lý theo phòng**, giúp cán bộ dễ dàng theo dõi trạng thái thanh toán của toàn bộ phòng thay vì từng sinh viên riêng lẻ.

---

## ✨ Tính năng mới

### 1. **Hiển thị hóa đơn theo phòng**
- Danh sách chính hiển thị hóa đơn **đã group theo phòng**
- Mỗi dòng đại diện cho **1 phòng trong 1 tháng**
- Thông tin hiển thị:
  - Tòa nhà và số phòng
  - Tháng/năm
  - Số lượng sinh viên trong phòng
  - Số sinh viên đã thanh toán / chưa thanh toán
  - Tổng tiền của cả phòng
  - Tiền đã thu / còn phải thu
  - Trạng thái tổng hợp

### 2. **Logic trạng thái mới**
- ✅ **"Đã thanh toán"**: Chỉ hiển thị khi **TẤT CẢ** sinh viên trong phòng đã thanh toán
- ⏳ **"Chưa thanh toán"**: Hiển thị khi **CÒN ÍT NHẤT 1** sinh viên chưa thanh toán

### 3. **Chi tiết hóa đơn từng sinh viên**
Khi click vào nút "Chi tiết", hiển thị:
- Thông tin chung của phòng
- Danh sách hóa đơn của **TỪNG sinh viên** trong phòng
- Trạng thái thanh toán của từng người
- Tổng kết thu chi
- Nút xác nhận thanh toán (cá nhân hoặc toàn phòng)

### 4. **Bộ lọc nâng cao**
- Lọc theo **tháng**
- Lọc theo **năm**
- Lọc theo **trạng thái** (Đã thanh toán / Chưa thanh toán)

### 5. **Thanh toán toàn bộ phòng**
- Xác nhận thanh toán cho **TẤT CẢ** sinh viên trong phòng cùng lúc
- Tiết kiệm thời gian khi sinh viên thanh toán tập thể
- Tự động cập nhật trạng thái tất cả hóa đơn

---

## 🔧 Thay đổi kỹ thuật

### Backend (C# .NET)

#### 1. **DTO mới: `HoaDonTheoPhongDTO`**
```csharp
Api_Gateway/DTO/HoaDon/HoaDonTheoPhongDTO.cs
```

**Thuộc tính chính:**
- `MaPhong`, `TenPhong`, `TenToaNha`: Thông tin phòng
- `Thang`, `Nam`: Kỳ hóa đơn
- `SoLuongSinhVien`: Tổng sinh viên trong phòng
- `SoLuongDaThanhToan`: Số sinh viên đã thanh toán
- `TongTienTatCa`: Tổng tiền của cả phòng
- `TongTienDaThu`: Số tiền đã thu được
- `TongTienConLai`: Số tiền còn phải thu
- `TrangThai`: "DaThanhToan" hoặc "ChuaThanhToan"
- `DanhSachHoaDon`: Chi tiết hóa đơn từng sinh viên

#### 2. **Business Logic: `HoaDonBLL`**

**Method mới:**

##### a. `GetHoaDonTheoPhong()`
```csharp
Task<ApiResponse<List<HoaDonTheoPhongDTO>>> GetHoaDonTheoPhong(
    int? thang = null, 
    int? nam = null, 
    string? trangThai = null
)
```
- Lấy tất cả hóa đơn
- Group theo (MaPhong, Thang, Nam)
- Tính toán trạng thái tổng hợp
- Hỗ trợ lọc theo tháng/năm/trạng thái

##### b. `ThanhToanToanBoPhong()`
```csharp
Task<ApiResponse<string>> ThanhToanToanBoPhong(
    int maPhong, 
    int thang, 
    int nam, 
    string phuongThucThanhToan
)
```
- Đánh dấu tất cả hóa đơn trong phòng là "DaThanhToan"
- Cập nhật ngày thanh toán và phương thức
- Sử dụng transaction để đảm bảo tính toàn vẹn

#### 3. **API Endpoints mới**

##### a. `GET /api/hoadon/theo-phong`
**Query params:**
- `thang` (optional): Lọc theo tháng
- `nam` (optional): Lọc theo năm
- `trangThai` (optional): "DaThanhToan" hoặc "ChuaThanhToan"

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "maPhong": 1,
      "tenPhong": "101",
      "tenToaNha": "Tòa A",
      "thang": 8,
      "nam": 2026,
      "soLuongSinhVien": 4,
      "soLuongDaThanhToan": 2,
      "tongTienTatCa": 4800000,
      "tongTienDaThu": 2400000,
      "tongTienConLai": 2400000,
      "trangThai": "ChuaThanhToan",
      "danhSachHoaDon": [...]
    }
  ]
}
```

##### b. `POST /api/hoadon/theo-phong/thanhtoan`
**Request body:**
```json
{
  "maPhong": 1,
  "thang": 8,
  "nam": 2026,
  "phuongThucThanhToan": "Tiền mặt"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Thanh toán thành công toàn bộ phòng (tháng 8/2026)",
  "data": "Đã xác nhận thanh toán 4 hóa đơn"
}
```

##### c. `POST /api/hoadon/theo-phong/create`
- Đường dẫn API đã được thay đổi từ `/theo-phong` → `/theo-phong/create`
- Tránh conflict với endpoint GET `/theo-phong`

---

### Frontend (React + TypeScript)

#### 1. **Service: `hoaDonService.ts`**

**Interface mới:**
```typescript
export interface HoaDonTheoPhong {
  maPhong: number;
  tenPhong?: string;
  tenToaNha?: string;
  thang: number;
  nam: number;
  soLuongSinhVien: number;
  soLuongDaThanhToan: number;
  tongTienTatCa: number;
  tongTienDaThu: number;
  tongTienConLai: number;
  trangThai: string;
  danhSachHoaDon: HoaDon[];
  ngayPhatHanh?: string;
  hanThanhToan?: string;
}
```

**Method mới:**
```typescript
// Lấy hóa đơn theo phòng
getHoaDonTheoPhong(thang?, nam?, trangThai?)

// Thanh toán toàn bộ phòng
thanhToanToanBoPhong(maPhong, thang, nam, phuongThucThanhToan)

// Tạo hóa đơn (endpoint đã đổi)
createTheoPhong() // Gọi đến /theo-phong/create
```

#### 2. **Component: `CanBoHoaDon.tsx`**

**Thay đổi chính:**
- State `data` giờ lưu `HoaDonTheoPhong[]` thay vì `HoaDon[]`
- Gọi `getHoaDonTheoPhong()` thay vì `getAll()`
- Table hiển thị theo phòng
- Thêm bộ lọc tháng/năm/trạng thái
- Modal chi tiết hiển thị danh sách sinh viên từ `danhSachHoaDon`
- Nút "Thanh toán toàn bộ phòng"

**Cấu trúc columns mới:**
- Tòa nhà - Phòng
- Tháng/Năm
- Sinh viên (tổng / đã thanh toán / chưa thanh toán)
- Tổng tiền (tổng / đã thu / còn lại)
- Trạng thái
- Thao tác (Chi tiết + Thanh toán toàn phòng)

---

## 📊 Luồng hoạt động

### Luồng 1: Xem danh sách hóa đơn

```
1. Cán bộ truy cập trang "Quản lý hóa đơn"
   ↓
2. Frontend gọi GET /api/hoadon/theo-phong
   ↓
3. Backend:
   - Lấy tất cả hóa đơn
   - Group theo (MaPhong, Thang, Nam)
   - Tính toán số lượng và tổng tiền
   - Xác định trạng thái (TẤT CẢ đã TT → DaThanhToan)
   ↓
4. Frontend hiển thị danh sách theo phòng
```

### Luồng 2: Xem chi tiết hóa đơn phòng

```
1. Cán bộ click "Chi tiết" trên 1 phòng
   ↓
2. Modal hiển thị:
   - Thông tin chung phòng
   - Danh sách hóa đơn của TỪNG sinh viên
   - Tổng kết thu chi
   ↓
3. Cán bộ có thể:
   - Xác nhận thanh toán từng sinh viên
   - Xác nhận thanh toán toàn bộ phòng
```

### Luồng 3: Thanh toán toàn bộ phòng

```
1. Cán bộ click "Thanh toán toàn phòng"
   ↓
2. Modal confirm hiển thị:
   - Số người chưa thanh toán
   - Tổng tiền còn lại
   ↓
3. Cán bộ xác nhận
   ↓
4. Frontend gọi POST /api/hoadon/theo-phong/thanhtoan
   ↓
5. Backend (Transaction):
   - Lấy tất cả hóa đơn "ChuaThanhToan" trong phòng
   - Cập nhật trạng thái → "DaThanhToan"
   - Cập nhật ngày thanh toán
   - Commit transaction
   ↓
6. Frontend refresh dữ liệu
   ↓
7. Phòng hiển thị trạng thái "Đã thanh toán"
```

---

## 🎨 Giao diện người dùng

### Danh sách chính

```
┌─────────────────────────────────────────────────────────────┐
│ 🔍 Bộ lọc: [Tháng] [Năm] [Trạng thái] [Tạo hóa đơn]      │
├─────────────────────────────────────────────────────────────┤
│ Tòa - Phòng  │ Tháng │ Sinh viên    │ Tổng tiền  │ Thao tác│
├─────────────────────────────────────────────────────────────┤
│ Tòa A        │ 8/    │ 4 người      │ 4,800,000  │ Chi tiết│
│ Phòng 101    │ 2026  │ ✓ Đã: 2     │ Đã: 2.4tr │ TT phòng│
│              │       │ ✗ Chưa: 2    │ Còn: 2.4tr │         │
│ ⏳ Chưa TT   │       │              │            │         │
└─────────────────────────────────────────────────────────────┘
```

### Modal chi tiết

```
┌──────────────────────────────────────────────────────────────┐
│ Chi tiết hóa đơn - Tòa A Phòng 101 (8/2026)   [⏳ Chưa TT] │
├──────────────────────────────────────────────────────────────┤
│ 📍 Thông tin chung                                          │
│ Tòa - Phòng: Tòa A - 101  │ Tháng: 8/2026 │ SV: 4 │ Đã TT: 2│
├──────────────────────────────────────────────────────────────┤
│ 👥 Hóa đơn từng sinh viên:                                  │
│                                                              │
│ 1. Nguyễn Văn A (SV001)                    [✓ Đã thanh toán]│
│ ├─ Tiền phòng: 800,000 VNĐ                                  │
│ ├─ Tiền điện: 100,000 VNĐ                                   │
│ ├─ Tiền nước: 50,000 VNĐ                                    │
│ └─ Tổng: 950,000 VNĐ                                        │
│                                                              │
│ 2. Trần Thị B (SV002)                     [⏳ Chưa TT] [TT]│
│ ├─ Tiền phòng: 800,000 VNĐ                                  │
│ ├─ Tiền điện: 100,000 VNĐ                                   │
│ └─ Tổng: 950,000 VNĐ                                        │
├──────────────────────────────────────────────────────────────┤
│ 💰 Tổng kết                                                  │
│ Tổng: 4,800,000 │ Đã thu: 2,400,000 │ Còn: 2,400,000       │
├──────────────────────────────────────────────────────────────┤
│           [Xác nhận thanh toán toàn bộ phòng (2 người)]     │
└──────────────────────────────────────────────────────────────┘
```

---

## ⚠️ Lưu ý quan trọng

### 1. **Breaking Changes**
- Endpoint tạo hóa đơn đã đổi: `/theo-phong` → `/theo-phong/create`
- Nếu có API client khác đang dùng, cần cập nhật

### 2. **Database**
- Không có thay đổi cấu trúc bảng
- Tất cả logic group và tính toán ở tầng application

### 3. **Performance**
- Với số lượng hóa đơn lớn (>10,000), nên thêm index:
  ```sql
  CREATE INDEX IX_HoaDon_MaPhong_Thang_Nam 
  ON HoaDon(MaPhong, Thang, Nam);
  ```

### 4. **Authorization**
- Endpoint `GET /api/hoadon/theo-phong` chỉ cho Admin và CanBo
- Endpoint `POST /api/hoadon/theo-phong/thanhtoan` chỉ cho CanBo

### 5. **Transaction Safety**
- `ThanhToanToanBoPhong` sử dụng transaction
- Nếu 1 hóa đơn fail → rollback toàn bộ
- Đảm bảo tính toàn vẹn dữ liệu

---

## 🧪 Test Cases

### Test 1: Hiển thị đúng trạng thái
```
Phòng 101, Tháng 8/2026:
- 4 sinh viên, 4 đã thanh toán → Trạng thái: "DaThanhToan" ✅
- 4 sinh viên, 3 đã thanh toán → Trạng thái: "ChuaThanhToan" ✅
- 4 sinh viên, 0 đã thanh toán → Trạng thái: "ChuaThanhToan" ✅
```

### Test 2: Tính toán số tiền đúng
```
Phòng 101:
- SV1: 950,000 VNĐ (Đã TT)
- SV2: 950,000 VNĐ (Đã TT)
- SV3: 1,000,000 VNĐ (Chưa TT)
- SV4: 1,000,000 VNĐ (Chưa TT)

Kết quả:
- Tổng: 3,900,000 ✅
- Đã thu: 1,900,000 ✅
- Còn lại: 2,000,000 ✅
```

### Test 3: Thanh toán toàn phòng
```
1. Trước khi thanh toán: 2/4 người đã TT
2. Click "Thanh toán toàn phòng"
3. Sau khi thanh toán: 4/4 người đã TT ✅
4. Trạng thái phòng: "DaThanhToan" ✅
```

### Test 4: Bộ lọc
```
- Lọc tháng 8 → Chỉ hiển thị hóa đơn tháng 8 ✅
- Lọc năm 2026 → Chỉ hiển thị hóa đơn năm 2026 ✅
- Lọc "Chưa TT" → Chỉ hiển thị phòng còn người chưa TT ✅
```

---

## 📚 Tài liệu tham khảo

- Backend BLL: `Api_Gateway/BLL/HoaDonBLL.cs`
- Backend Controller: `Api_Gateway/Controllers/HoaDonController.cs`
- Backend DTO: `Api_Gateway/DTO/HoaDon/HoaDonTheoPhongDTO.cs`
- Frontend Service: `React_UI/do_an_3/src/services/hoaDonService.ts`
- Frontend Component: `React_UI/do_an_3/src/pages/CanBo/CanBoHoaDon.tsx`

---

## 🎉 Kết luận

Tính năng quản lý hóa đơn theo phòng giúp:
- ✅ Cán bộ dễ dàng theo dõi trạng thái thanh toán theo phòng
- ✅ Tiết kiệm thời gian khi xác nhận thanh toán hàng loạt
- ✅ Giao diện trực quan, dễ sử dụng
- ✅ Logic nghiệp vụ rõ ràng (tất cả đã thanh toán → phòng đã thanh toán)
- ✅ Hỗ trợ lọc và tìm kiếm linh hoạt

Chúc bạn sử dụng hiệu quả! 🚀
