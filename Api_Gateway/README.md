# API Gateway - Hệ thống quản lý KTX

Backend API cho hệ thống quản lý ký túc xá sinh viên.

## Cấu trúc dự án

```
Api_Gateway/
├── Models/          # Entity models (15 bảng)
├── DTO/             # Data Transfer Objects
│   ├── Auth/        # Login, Register DTOs
│   └── Common/      # ApiResponse
├── DAL/             # Data Access Layer
│   └── QuanLyKTXContext.cs
├── BLL/             # Business Logic Layer
│   └── AuthBLL.cs
├── Services/        # Services (JWT, Password)
├── Controllers/     # API Controllers
│   └── AuthController.cs
└── Program.cs       # Entry point
```

## Công nghệ sử dụng

- .NET 8.0
- Entity Framework Core 8.0
- SQL Server
- JWT Authentication
- BCrypt.Net (Password hashing)
- Swagger/OpenAPI

## Cài đặt

### 1. Cài đặt dependencies

```bash
dotnet restore
```

### 2. Cấu hình database

Cập nhật connection string trong `appsettings.json`:

```json
{
  "ConnectionStrings": {
    "DefaultConnection": "Server=localhost;Database=QuanLyKTX;Trusted_Connection=True;TrustServerCertificate=True"
  }
}
```

### 3. Tạo database

Chạy script SQL để tạo database:

```bash
sqlcmd -S localhost -i ../Database_Clean.sql
```

### 4. Chạy ứng dụng

```bash
dotnet run
```

API sẽ chạy tại: `https://localhost:7xxx` hoặc `http://localhost:5xxx`

## API Endpoints

### Authentication

#### POST /api/auth/login
Đăng nhập vào hệ thống

**Request:**
```json
{
  "tenDangNhap": "admin",
  "matKhau": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng nhập thành công",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "vaiTro": "Admin",
    "maTaiKhoan": 1,
    "maNguoiDung": 1,
    "hoTen": "Nguyễn Văn Admin",
    "email": "admin@ktx.edu.vn",
    "maActor": 1
  }
}
```

#### POST /api/auth/register
Đăng ký tài khoản mới

**Request (Sinh viên):**
```json
{
  "tenDangNhap": "sv001",
  "matKhau": "password123",
  "vaiTro": "SinhVien",
  "hoTen": "Nguyễn Văn A",
  "gioiTinh": "Nam",
  "ngaySinh": "2003-01-01",
  "soDienThoai": "0123456789",
  "email": "sv001@student.edu.vn",
  "cccd": "001234567890",
  "diaChi": "Hà Nội",
  "maSV": "SV001",
  "khoa": "Công nghệ thông tin",
  "nganh": "Khoa học máy tính",
  "lop": "CNTT01",
  "namHoc": 2024,
  "diemTB": 3.5
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công",
  "data": "Đăng ký thành công"
}
```

## Database Models

### Bảng chung (2)
- **TaiKhoan**: Tài khoản đăng nhập
- **NguoiDung**: Thông tin người dùng

### Bảng riêng (3)
- **Admin**: Quản trị viên
- **CanBoKTX**: Cán bộ quản lý
- **SinhVien**: Sinh viên

### Bảng chức năng (10)
- **ToaNha**: Tòa nhà
- **Phong**: Phòng
- **Giuong**: Giường
- **DangKyPhong**: Đăng ký phòng
- **HopDong**: Hợp đồng
- **HoaDon**: Hóa đơn
- **ViPham**: Vi phạm
- **ThongBao**: Thông báo
- **YeuCauBaoTri**: Yêu cầu bảo trì
- **BaoCaoThongKe**: Báo cáo thống kê

## Authentication & Authorization

API sử dụng JWT Bearer Token để xác thực.

### Sử dụng token:

```
Authorization: Bearer {token}
```

### Vai trò:
- **Admin**: Toàn quyền quản trị
- **CanBo**: Quản lý tòa nhà, duyệt đăng ký, tạo hợp đồng/hóa đơn
- **SinhVien**: Đăng ký phòng, xem hợp đồng/hóa đơn

## Swagger Documentation

Truy cập Swagger UI tại: `https://localhost:7xxx/swagger`

## Development

### Build
```bash
dotnet build
```

### Run
```bash
dotnet run
```

### Watch (auto-reload)
```bash
dotnet watch run
```

## Các bước tiếp theo

1. ✅ Tạo Models và DbContext
2. ✅ Tạo Authentication (Login/Register)
3. ⏳ Tạo CRUD cho các entity
4. ⏳ Tạo Business Logic cho các chức năng
5. ⏳ Tạo Authorization Attributes
6. ⏳ Tạo API cho từng module

## License

MIT
