# Biểu đồ lớp - Hệ thống Quản lý KTX

## Cách xem biểu đồ

### Cách 1: Sử dụng PlantUML Online
1. Truy cập: https://www.plantuml.com/plantuml/uml/
2. Copy nội dung file `Class_Diagram.puml`
3. Paste vào editor và xem kết quả

### Cách 2: Sử dụng VS Code
1. Cài extension: "PlantUML" by jebbs
2. Mở file `Class_Diagram.puml`
3. Nhấn `Alt + D` để xem preview

### Cách 3: Sử dụng Visual Paradigm
1. Mở Visual Paradigm
2. Import file PlantUML
3. Hoặc vẽ lại theo cấu trúc dưới đây

## Cấu trúc hệ thống

### 1. BẢNG CHUNG (2 lớp)
- **TaiKhoan**: Quản lý đăng nhập, phân quyền
- **NguoiDung**: Thông tin cá nhân chung

### 2. BẢNG RIÊNG - ACTORS (3 lớp)
- **Admin**: Quản trị viên hệ thống
- **CanBoKTX**: Cán bộ quản lý KTX
- **SinhVien**: Sinh viên ở KTX

### 3. QUẢN LÝ CƠ SỞ VẬT CHẤT (3 lớp)
- **ToaNha**: Quản lý tòa nhà
- **Phong**: Quản lý phòng
- **Giuong**: Quản lý giường

### 4. QUẢN LÝ ĐĂNG KÝ & HỢP ĐỒNG (2 lớp)
- **DangKyPhong**: Đăng ký phòng ở
- **HopDong**: Hợp đồng thuê phòng

### 5. QUẢN LÝ TÀI CHÍNH (1 lớp)
- **HoaDon**: Hóa đơn thanh toán

### 6. QUẢN LÝ KỶ LUẬT (1 lớp)
- **ViPham**: Vi phạm nội quy

### 7. QUẢN LÝ THÔNG TIN (2 lớp)
- **ThongBao**: Thông báo hệ thống
- **YeuCauBaoTri**: Yêu cầu sửa chữa

### 8. BÁO CÁO (1 lớp)
- **BaoCaoThongKe**: Báo cáo và thống kê

## Các mối quan hệ chính

### 1. Generalization (Kế thừa) - Ký hiệu: <|--
**Quan hệ "is-a" (là một)**

```
NguoiDung <|-- Admin
NguoiDung <|-- CanBoKTX  
NguoiDung <|-- SinhVien
```

- Admin **là một** NguoiDung
- CanBoKTX **là một** NguoiDung
- SinhVien **là một** NguoiDung
- Kế thừa tất cả thuộc tính và phương thức từ lớp cha

### 2. Dependency (Phụ thuộc) - Ký hiệu: ..>
**Quan hệ tạm thời, yếu**

```
TaiKhoan ..> NguoiDung : <<create>>
DangKyPhong ..> HopDong : <<create>>
HopDong ..> HoaDon : <<create>>
```

- TaiKhoan tạo ra NguoiDung
- DangKyPhong được duyệt thì tạo HopDong
- HopDong phát sinh HoaDon hàng tháng
- Quan hệ tạm thời, không lưu trữ lâu dài

### 3. Association (Liên kết) - Ký hiệu: -- hoặc -->
**Quan hệ "has-a" hoặc "uses" (có/sử dụng)**

#### Liên kết 1-1 (One-to-One):
```
TaiKhoan (1) -- (1) NguoiDung
SinhVien (0..1) -- (0..1) Giuong
```

#### Liên kết 1-nhiều (One-to-Many):
```
CanBoKTX (1) --> (0..*) ToaNha : quản lý
SinhVien (1) --> (0..*) DangKyPhong : đăng ký
SinhVien (1) --> (0..*) HopDong : ký
Admin (1) --> (0..*) BaoCaoThongKe : tạo
```

#### Liên kết nhiều-nhiều (Many-to-Many):
```
SinhVien (1) -- (0..*) DangKyPhong -- (0..*) Phong
```
- Sinh viên có thể đăng ký nhiều phòng (các học kỳ khác nhau)
- Phòng có thể được nhiều sinh viên đăng ký

### 4. Aggregation (Tập hợp) - Ký hiệu: o--
**Quan hệ "has-a" yếu - Phần có thể tồn tại độc lập**

```
CanBoKTX (1) o-- (0..*) DangKyPhong : duyệt
CanBoKTX (1) o-- (0..*) HopDong : tạo
CanBoKTX (1) o-- (0..*) HoaDon : lập
CanBoKTX (1) o-- (0..*) ViPham : ghi nhận
CanBoKTX (0..1) o-- (0..*) YeuCauBaoTri : xử lý
CanBoKTX (1) o-- (0..*) ThongBao : gửi
```

- Cán bộ duyệt đăng ký, nhưng đăng ký vẫn tồn tại khi cán bộ nghỉ việc
- Cán bộ tạo hợp đồng, nhưng hợp đồng không phụ thuộc vào cán bộ đó
- Quan hệ lỏng lẻo, có thể thay đổi

### 5. Composition (Tổng hợp) - Ký hiệu: *--
**Quan hệ "contains" mạnh - Phần không thể tồn tại độc lập**

```
ToaNha (1) *-- (0..*) Phong : chứa
Phong (1) *-- (0..*) Giuong : có
HopDong (1) *-- (0..*) HoaDon : phát sinh
```

- Tòa nhà **chứa** phòng → Xóa tòa nhà thì xóa tất cả phòng
- Phòng **có** giường → Xóa phòng thì xóa tất cả giường
- Hợp đồng **phát sinh** hóa đơn → Hủy hợp đồng thì hủy tất cả hóa đơn
- Quan hệ chặt chẽ, phụ thuộc hoàn toàn

## So sánh Aggregation vs Composition

| Đặc điểm | Aggregation (o--) | Composition (*--) |
|----------|-------------------|-------------------|
| Độ mạnh | Yếu | Mạnh |
| Tồn tại độc lập | Có | Không |
| Ví dụ | CanBo duyệt DangKy | ToaNha chứa Phong |
| Khi xóa tổng thể | Phần vẫn tồn tại | Phần bị xóa theo |
| Sở hữu | Chia sẻ | Độc quyền |

## Ví dụ cụ thể

### Composition (Mạnh):
```
ToaNha A bị phá dỡ
→ Tất cả Phòng trong tòa A bị phá dỡ
→ Tất cả Giường trong các phòng đó cũng mất
```

### Aggregation (Yếu):
```
CanBo Nguyễn Văn A nghỉ việc
→ DangKyPhong do A duyệt vẫn còn
→ HopDong do A tạo vẫn hiệu lực
→ Chỉ cần gán CanBo khác quản lý
```

### Association (Liên kết):
```
SinhVien Trần Văn B tốt nghiệp
→ DangKyPhong của B vẫn lưu lịch sử
→ HopDong của B vẫn lưu hồ sơ
→ Chỉ đánh dấu trạng thái "Đã tốt nghiệp"
```

## Thuộc tính và Phương thức

### Mỗi lớp bao gồm:

**Thuộc tính (Attributes):**
- Khóa chính (PK)
- Khóa ngoại (FK)
- Các trường dữ liệu
- Trạng thái, ngày tạo

**Phương thức (Methods):**
- CRUD operations (Create, Read, Update, Delete)
- Business logic methods
- Validation methods
- Calculation methods

## Ví dụ chi tiết

### Lớp SinhVien
```
Thuộc tính:
- MaSinhVien: int (PK)
- MaNguoiDung: int (FK)
- MaSV: string (unique)
- Khoa, Nganh, Lop: string
- NamHoc: int
- DiemTB: decimal

Phương thức:
+ DangKyPhong(): DangKyPhong
+ XemPhongTrong(): List<Phong>
+ XemHopDong(): List<HopDong>
+ XemHoaDon(): List<HoaDon>
+ ThanhToanHoaDon(): bool
+ XemViPham(): List<ViPham>
+ GuiYeuCauBaoTri(): YeuCauBaoTri
+ XemThongBao(): List<ThongBao>
```

### Lớp CanBoKTX
```
Thuộc tính:
- MaCanBo: int (PK)
- MaNguoiDung: int (FK)
- MaNV: string (unique)
- ChucVu, PhongBan: string
- NgayVaoLam: Date

Phương thức:
+ QuanLyToaNha(): void
+ QuanLyPhong(): void
+ DuyetDangKy(): bool
+ TaoHopDong(): HopDong
+ TaoHoaDon(): HoaDon
+ GhiViPham(): ViPham
+ XuLyBaoTri(): bool
+ GuiThongBao(): ThongBao
```

### Lớp HoaDon
```
Thuộc tính:
- MaHoaDon: int (PK)
- SoHoaDon: string (unique)
- MaHopDong, MaSinhVien: int (FK)
- Thang, Nam: int
- TienPhong, TienDien, TienNuoc: decimal
- PhiDichVu, PhiPhat, TongTien: decimal
- ChiSoDien, ChiSoNuoc: decimal
- TrangThai: string
- NgayThanhToan: DateTime

Phương thức:
+ TaoHoaDon(): bool
+ TinhTongTien(): decimal
+ ThanhToan(): bool
+ XacNhanThanhToan(): bool
+ XemChiTiet(): HoaDon
+ InHoaDon(): string
+ GuiThongBao(): bool
+ KiemTraQuaHan(): bool
```

## Multiplicity (Bội số)

- `1` : Đúng 1
- `0..1` : 0 hoặc 1
- `0..*` : 0 hoặc nhiều
- `1..*` : 1 hoặc nhiều

## Ký hiệu UML

### Các loại quan hệ:
- `<|--` : Generalization (Kế thừa) - "is-a"
- `*--` : Composition (Tổng hợp mạnh) - "contains"
- `o--` : Aggregation (Tập hợp yếu) - "has-a"
- `-->` : Association có hướng - "uses"
- `--` : Association hai chiều - "knows"
- `..>` : Dependency (Phụ thuộc) - "depends on"
- `..|>` : Realization (Thực thi interface)

### Visibility (Phạm vi truy cập):
- `+` : Public
- `-` : Private
- `#` : Protected
- `~` : Package

### Constraints (Ràng buộc):
- `<<PK>>` : Primary Key
- `<<FK>>` : Foreign Key
- `<<unique>>` : Unique constraint
- `<<create>>` : Tạo đối tượng
- `<<use>>` : Sử dụng

## Ghi chú

1. Mỗi người dùng chỉ có 1 vai trò (Admin, CanBo, hoặc SinhVien)
2. Sinh viên có thể đăng ký nhiều lần (các học kỳ khác nhau)
3. Mỗi hợp đồng tạo ra nhiều hóa đơn (theo tháng)
4. Cán bộ có thể quản lý nhiều tòa nhà
5. Admin chỉ tạo báo cáo, không tham gia quản lý trực tiếp

## Tích hợp với Backend

Các lớp này đã được implement trong:
- **Models**: `Api_Gateway/Models/`
- **DAL**: `Api_Gateway/DAL/` (Repository Pattern)
- **BLL**: `Api_Gateway/BLL/` (Business Logic)
- **Controllers**: `Api_Gateway/Controllers/` (API Endpoints)

## Tích hợp với Frontend

Các chức năng tương ứng trong React:
- **Admin**: `React_UI/do_an_3/src/pages/Admin/`
- **CanBo**: `React_UI/do_an_3/src/pages/CanBo/`
- **SinhVien**: `React_UI/do_an_3/src/pages/SinhVien/`
