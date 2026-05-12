-- =============================================
-- HỆ THỐNG QUẢN LÝ KÝ TÚC XÁ SINH VIÊN
-- Phiên bản cuối - Có bảng chung, kết nối bảng riêng
-- =============================================

USE master;
GO

IF EXISTS (SELECT * FROM sys.databases WHERE name = 'QuanLyKTX')
BEGIN
    DROP DATABASE QuanLyKTX;
END
GO

CREATE DATABASE QuanLyKTX;
GO

USE QuanLyKTX;
GO

-- =============================================
-- 1. BẢNG CHUNG (2 bảng)
-- =============================================

-- Bảng tài khoản (chung cho tất cả)
CREATE TABLE TaiKhoan (
    MaTaiKhoan INT PRIMARY KEY IDENTITY(1,1),
    TenDangNhap NVARCHAR(50) NOT NULL UNIQUE,
    MatKhau NVARCHAR(255) NOT NULL,
    VaiTro NVARCHAR(20) NOT NULL, -- Admin, CanBo, SinhVien
    TrangThai BIT DEFAULT 1,
    NgayTao DATETIME DEFAULT GETDATE()
);

-- Bảng người dùng (thông tin chung)
CREATE TABLE NguoiDung (
    MaNguoiDung INT PRIMARY KEY IDENTITY(1,1),
    MaTaiKhoan INT NOT NULL UNIQUE,
    HoTen NVARCHAR(100) NOT NULL,
    GioiTinh NVARCHAR(10) NOT NULL,
    NgaySinh DATE NOT NULL,
    SoDienThoai NVARCHAR(20) NOT NULL,
    Email NVARCHAR(100) NOT NULL UNIQUE,
    CCCD NVARCHAR(20) NOT NULL UNIQUE,
    DiaChi NVARCHAR(255),
    NgayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaTaiKhoan) REFERENCES TaiKhoan(MaTaiKhoan)
);

-- =============================================
-- 2. BẢNG RIÊNG (3 bảng - thông tin riêng)
-- =============================================

-- Bảng Admin
CREATE TABLE Admin (
    MaAdmin INT PRIMARY KEY IDENTITY(1,1),
    MaNguoiDung INT NOT NULL UNIQUE,
    MaNV NVARCHAR(20) NOT NULL UNIQUE,
    ChucVu NVARCHAR(100),
    PhongBan NVARCHAR(100),
    NgayVaoLam DATE,
    NgayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung)
);

-- Bảng Cán bộ KTX
CREATE TABLE CanBoKTX (
    MaCanBo INT PRIMARY KEY IDENTITY(1,1),
    MaNguoiDung INT NOT NULL UNIQUE,
    MaNV NVARCHAR(20) NOT NULL UNIQUE,
    ChucVu NVARCHAR(100),
    PhongBan NVARCHAR(100),
    NgayVaoLam DATE,
    NgayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung)
);

-- Bảng Sinh viên
CREATE TABLE SinhVien (
    MaSinhVien INT PRIMARY KEY IDENTITY(1,1),
    MaNguoiDung INT NOT NULL UNIQUE,
    MaSV NVARCHAR(20) NOT NULL UNIQUE,
    Khoa NVARCHAR(100),
    Nganh NVARCHAR(100),
    Lop NVARCHAR(50),
    NamHoc INT,
    DiemTB DECIMAL(3,2),
    NgayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaNguoiDung) REFERENCES NguoiDung(MaNguoiDung)
);

-- =============================================
-- 3. QUẢN LÝ TÒA NHÀ & PHÒNG (3 bảng)
-- =============================================

-- Bảng tòa nhà (nối với CanBoKTX)
CREATE TABLE ToaNha (
    MaToaNha INT PRIMARY KEY IDENTITY(1,1),
    MaToa NVARCHAR(10) NOT NULL UNIQUE,
    TenToaNha NVARCHAR(100) NOT NULL,
    LoaiToaNha NVARCHAR(20) NOT NULL,s
    SoTang INT NOT NULL,
    TrangThai NVARCHAR(20) DEFAULT N'HoatDong',
    MaCanBoQuanLy INT NULL,
    NgayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaCanBoQuanLy) REFERENCES CanBoKTX(MaCanBo)
);

-- Bảng phòng
CREATE TABLE Phong (
    MaPhong INT PRIMARY KEY IDENTITY(1,1),
    MaToaNha INT NOT NULL,
    SoPhong NVARCHAR(20) NOT NULL,
    Tang INT NOT NULL,
    LoaiPhong NVARCHAR(50) NOT NULL,
    SucChua INT NOT NULL,
    SoNguoiHienTai INT DEFAULT 0,
    GiaPhong DECIMAL(18,2) NOT NULL,
    TrangThai NVARCHAR(20) DEFAULT N'ConTrong',
    NgayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaToaNha) REFERENCES ToaNha(MaToaNha),
    UNIQUE(MaToaNha, SoPhong)
);

-- Bảng giường (nối với SinhVien)
CREATE TABLE Giuong (
    MaGiuong INT PRIMARY KEY IDENTITY(1,1),
    MaPhong INT NOT NULL,
    SoGiuong INT NOT NULL,
    TrangThai NVARCHAR(20) DEFAULT N'ConTrong',
    MaSinhVien INT NULL,
    NgayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaPhong) REFERENCES Phong(MaPhong),
    FOREIGN KEY (MaSinhVien) REFERENCES SinhVien(MaSinhVien),
    UNIQUE(MaPhong, SoGiuong)
);

-- =============================================
-- 4. ĐĂNG KÝ PHÒNG (nối với SinhVien & CanBoKTX)
-- =============================================

CREATE TABLE DangKyPhong (
    MaDangKy INT PRIMARY KEY IDENTITY(1,1),
    MaSinhVien INT NOT NULL,
    MaPhong INT NOT NULL,
    MaGiuong INT NULL,
    HocKy NVARCHAR(20) NOT NULL,
    NgayDangKy DATETIME DEFAULT GETDATE(),
    TrangThai NVARCHAR(20) DEFAULT N'ChoDuyet',
    MaCanBoDuyet INT NULL,
    NgayDuyet DATETIME NULL,
    LyDoTuChoi NVARCHAR(255),
    FOREIGN KEY (MaSinhVien) REFERENCES SinhVien(MaSinhVien),
    FOREIGN KEY (MaPhong) REFERENCES Phong(MaPhong),
    FOREIGN KEY (MaGiuong) REFERENCES Giuong(MaGiuong),
    FOREIGN KEY (MaCanBoDuyet) REFERENCES CanBoKTX(MaCanBo)
);

-- =============================================
-- 5. HỢP ĐỒNG (nối với SinhVien & CanBoKTX)
-- =============================================

CREATE TABLE HopDong (
    MaHopDong INT PRIMARY KEY IDENTITY(1,1),
    SoHopDong NVARCHAR(50) NOT NULL UNIQUE,
    MaSinhVien INT NOT NULL,
    MaPhong INT NOT NULL,
    MaGiuong INT NOT NULL,
    HocKy NVARCHAR(20) NOT NULL,
    NgayBatDau DATE NOT NULL,
    NgayKetThuc DATE NOT NULL,
    GiaThue DECIMAL(18,2) NOT NULL,
    TrangThai NVARCHAR(20) DEFAULT N'HieuLuc',
    MaCanBoTao INT NOT NULL,
    NgayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaSinhVien) REFERENCES SinhVien(MaSinhVien),
    FOREIGN KEY (MaPhong) REFERENCES Phong(MaPhong),
    FOREIGN KEY (MaGiuong) REFERENCES Giuong(MaGiuong),
    FOREIGN KEY (MaCanBoTao) REFERENCES CanBoKTX(MaCanBo)
);

-- =============================================
-- 6. HÓA ĐƠN (nối với SinhVien & CanBoKTX)
-- =============================================

CREATE TABLE HoaDon (
    MaHoaDon INT PRIMARY KEY IDENTITY(1,1),
    SoHoaDon NVARCHAR(50) NOT NULL UNIQUE,
    MaHopDong INT NOT NULL,
    MaSinhVien INT NOT NULL,
    Thang INT NOT NULL,
    Nam INT NOT NULL,
    NgayPhatHanh DATE DEFAULT GETDATE(),
    HanThanhToan DATE NOT NULL,
    
    -- Các khoản phí
    TienPhong DECIMAL(18,2) DEFAULT 0,
    TienDien DECIMAL(18,2) DEFAULT 0,
    TienNuoc DECIMAL(18,2) DEFAULT 0,
    PhiDichVu DECIMAL(18,2) DEFAULT 0,
    PhiPhat DECIMAL(18,2) DEFAULT 0,
    TongTien DECIMAL(18,2) NOT NULL,
    
    -- Chỉ số điện nước
    ChiSoDienCu DECIMAL(10,2),
    ChiSoDienMoi DECIMAL(10,2),
    ChiSoNuocCu DECIMAL(10,2),
    ChiSoNuocMoi DECIMAL(10,2),
    
    -- Thanh toán
    TrangThai NVARCHAR(20) DEFAULT N'ChuaThanhToan',
    NgayThanhToan DATETIME NULL,
    PhuongThucThanhToan NVARCHAR(50),
    MaGiaoDich NVARCHAR(100),
    
    MaCanBoTao INT NOT NULL,
    NgayTao DATETIME DEFAULT GETDATE(),
    
    FOREIGN KEY (MaHopDong) REFERENCES HopDong(MaHopDong),
    FOREIGN KEY (MaSinhVien) REFERENCES SinhVien(MaSinhVien),
    FOREIGN KEY (MaCanBoTao) REFERENCES CanBoKTX(MaCanBo)
);

-- =============================================
-- 7. VI PHẠM (nối với SinhVien & CanBoKTX)
-- =============================================

CREATE TABLE ViPham (
    MaViPham INT PRIMARY KEY IDENTITY(1,1),
    MaSinhVien INT NOT NULL,
    TenViPham NVARCHAR(100) NOT NULL,
    MucDo NVARCHAR(20) NOT NULL,
    MoTa NVARCHAR(MAX),
    MucPhat DECIMAL(18,2) DEFAULT 0,
    NgayViPham DATETIME DEFAULT GETDATE(),
    TrangThai NVARCHAR(20) DEFAULT N'ChoDuyet',
    MaCanBoGhi INT NOT NULL,
    NgayGhi DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaSinhVien) REFERENCES SinhVien(MaSinhVien),
    FOREIGN KEY (MaCanBoGhi) REFERENCES CanBoKTX(MaCanBo)
);

-- =============================================
-- 8. THÔNG BÁO (nối với SinhVien & CanBoKTX)
-- =============================================

CREATE TABLE ThongBao (
    MaThongBao INT PRIMARY KEY IDENTITY(1,1),
    TieuDe NVARCHAR(255) NOT NULL,
    NoiDung NVARCHAR(MAX) NOT NULL,
    LoaiThongBao NVARCHAR(50) NOT NULL,
    LoaiNguoiNhan NVARCHAR(20) NOT NULL, -- TatCa, SinhVien, CanBo
    MaSinhVienNhan INT NULL,
    MaCanBoNhan INT NULL,
    DaDoc BIT DEFAULT 0,
    NgayDoc DATETIME NULL,
    MaCanBoGui INT NOT NULL,
    NgayGui DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaSinhVienNhan) REFERENCES SinhVien(MaSinhVien),
    FOREIGN KEY (MaCanBoNhan) REFERENCES CanBoKTX(MaCanBo),
    FOREIGN KEY (MaCanBoGui) REFERENCES CanBoKTX(MaCanBo)
);

-- =============================================
-- 9. BẢO TRÌ (nối với SinhVien & CanBoKTX)
-- =============================================

CREATE TABLE YeuCauBaoTri (
    MaYeuCau INT PRIMARY KEY IDENTITY(1,1),
    MaPhong INT NOT NULL,
    MaSinhVien INT NOT NULL,
    TieuDe NVARCHAR(255) NOT NULL,
    MoTa NVARCHAR(MAX) NOT NULL,
    LoaiYeuCau NVARCHAR(50) NOT NULL,
    TrangThai NVARCHAR(20) DEFAULT N'ChoDuyet',
    MaCanBoXuLy INT NULL,
    NgayXuLy DATETIME NULL,
    ChiPhi DECIMAL(18,2),
    NgayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaPhong) REFERENCES Phong(MaPhong),
    FOREIGN KEY (MaSinhVien) REFERENCES SinhVien(MaSinhVien),
    FOREIGN KEY (MaCanBoXuLy) REFERENCES CanBoKTX(MaCanBo)
);

-- =============================================
-- 10. BÁO CÁO THỐNG KÊ (nối với Admin)
-- =============================================

CREATE TABLE BaoCaoThongKe (
    MaBaoCao INT PRIMARY KEY IDENTITY(1,1),
    TenBaoCao NVARCHAR(255) NOT NULL,
    LoaiBaoCao NVARCHAR(50) NOT NULL, -- DoanhThu, SinhVien, Phong, ViPham, TongQuan
    MoTa NVARCHAR(MAX),
    TuNgay DATE NULL,
    DenNgay DATE NULL,
    NoiDung NVARCHAR(MAX), -- Lưu kết quả báo cáo dạng JSON
    FilePath NVARCHAR(255), -- Đường dẫn file Excel/PDF đã xuất
    MaAdminTao INT NOT NULL,
    NgayTao DATETIME DEFAULT GETDATE(),
    FOREIGN KEY (MaAdminTao) REFERENCES Admin(MaAdmin)
);

-- =============================================
-- DỮ LIỆU MẪU (Mật khẩu: plain text, không mã hóa)
-- =============================================

-- Tạo Admin (admin / 123456)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES
(N'admin', N'123456', N'Admin');

INSERT INTO NguoiDung (MaTaiKhoan, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, CCCD, DiaChi) VALUES
(1, N'Nguyễn Văn Admin', N'Nam', '1980-01-01', N'0123456789', N'admin@ktx.edu.vn', N'001234567890', N'Hà Nội');

INSERT INTO Admin (MaNguoiDung, MaNV, ChucVu, PhongBan, NgayVaoLam) VALUES
(1, N'NV001', N'Giám đốc', N'Ban Giám đốc', '2020-01-01');

-- Tạo Cán bộ (canbo01 / 123456)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES
(N'canbo01', N'123456', N'CanBo');

INSERT INTO NguoiDung (MaTaiKhoan, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, CCCD, DiaChi) VALUES
(2, N'Trần Thị Cán Bộ', N'Nu', '1985-05-15', N'0987654321', N'canbo01@ktx.edu.vn', N'001234567891', N'Hà Nội');

INSERT INTO CanBoKTX (MaNguoiDung, MaNV, ChucVu, PhongBan, NgayVaoLam) VALUES
(2, N'NV002', N'Nhân viên', N'Phòng Quản lý KTX', '2021-06-01');

-- Tạo Sinh viên (sinhvien01 / 123456)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES
(N'sinhvien01', N'123456', N'SinhVien');

INSERT INTO NguoiDung (MaTaiKhoan, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, CCCD, DiaChi) VALUES
(3, N'Lê Văn Sinh Viên', N'Nam', '2003-08-10', N'0903333333', N'sv001@student.edu.vn', N'079003003333', N'Hải Phòng');

INSERT INTO SinhVien (MaNguoiDung, MaSV, Khoa, Nganh, Lop, NamHoc, DiemTB) VALUES
(3, N'SV001', N'Công nghệ thông tin', N'Kỹ thuật phần mềm', N'K21CNTT1', 2021, 3.45);

-- Tạo tòa nhà
INSERT INTO ToaNha (MaToa, TenToaNha, LoaiToaNha, SoTang, MaCanBoQuanLy) VALUES
(N'A', N'Tòa nhà A', N'Nam', 5, 1),
(N'B', N'Tòa nhà B', N'Nu', 5, NULL);

-- Tạo phòng
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES
(1, N'A101', 1, N'Phong4Nguoi', 4, 500000),
(1, N'A102', 1, N'Phong6Nguoi', 6, 400000),
(1, N'A103', 1, N'Phong8Nguoi', 8, 350000);

-- Tạo giường
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES
(1, 1), (1, 2), (1, 3), (1, 4);

-- =============================================
-- TẠO INDEXES
-- =============================================

CREATE INDEX IX_TaiKhoan_TenDangNhap ON TaiKhoan(TenDangNhap);
CREATE INDEX IX_NguoiDung_Email ON NguoiDung(Email);
CREATE INDEX IX_Admin_MaNV ON Admin(MaNV);
CREATE INDEX IX_CanBoKTX_MaNV ON CanBoKTX(MaNV);
CREATE INDEX IX_SinhVien_MaSV ON SinhVien(MaSV);
CREATE INDEX IX_Phong_MaToaNha ON Phong(MaToaNha);
CREATE INDEX IX_Giuong_MaPhong ON Giuong(MaPhong);
CREATE INDEX IX_DangKyPhong_MaSinhVien ON DangKyPhong(MaSinhVien);
CREATE INDEX IX_HopDong_MaSinhVien ON HopDong(MaSinhVien);
CREATE INDEX IX_HoaDon_MaSinhVien ON HoaDon(MaSinhVien);
CREATE INDEX IX_ViPham_MaSinhVien ON ViPham(MaSinhVien);
CREATE INDEX IX_BaoCaoThongKe_MaAdminTao ON BaoCaoThongKe(MaAdminTao);
CREATE INDEX IX_BaoCaoThongKe_LoaiBaoCao ON BaoCaoThongKe(LoaiBaoCao);

GO

PRINT N'Tạo database thành công!';
PRINT N'Database: QuanLyKTX';
PRINT N'Tổng số bảng: 15';
PRINT N'';
PRINT N'Cấu trúc:';
PRINT N'- TaiKhoan, NguoiDung (bảng chung)';
PRINT N'- Admin, CanBoKTX, SinhVien (bảng riêng)';
PRINT N'- Kết nối: Chức năng nối trực tiếp với bảng riêng';
PRINT N'';
PRINT N'Admin: Tạo BaoCaoThongKe, Xem thống kê tất cả';
PRINT N'CanBoKTX: Quản lý ToaNha, DangKy, HopDong, HoaDon, ViPham, BaoTri';
PRINT N'SinhVien: DangKy, HopDong, HoaDon, ViPham, BaoTri';
GO
