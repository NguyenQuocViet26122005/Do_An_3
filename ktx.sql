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
    LoaiToaNha NVARCHAR(20) NOT NULL,
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
    SoThang INT NOT NULL DEFAULT 6,
    NgayDangKy DATETIME DEFAULT GETDATE(),
    TrangThai NVARCHAR(20) DEFAULT N'ChuaXuLy',
    MaCanBoDuyet INT NULL,
    NgayDuyet DATETIME NULL,
    LyDoTuChoi NVARCHAR(255),
    FOREIGN KEY (MaSinhVien) REFERENCES SinhVien(MaSinhVien),
    FOREIGN KEY (MaPhong) REFERENCES Phong(MaPhong),
    FOREIGN KEY (MaGiuong) REFERENCES Giuong(MaGiuong),
    FOREIGN KEY (MaCanBoDuyet) REFERENCES CanBoKTX(MaCanBo)
);

IF COL_LENGTH('DangKyPhong', 'SoThang') IS NULL
BEGIN
    ALTER TABLE DangKyPhong ADD SoThang INT NOT NULL DEFAULT 6;
END;

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
    TrangThai NVARCHAR(20) DEFAULT N'ChuaXuLy',
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
    TrangThai NVARCHAR(20) DEFAULT N'ChuaXuLy',
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

-- Dữ liệu chuẩn: 1 Admin, 2 Cán bộ, 3 Sinh viên, 2 tòa nhà, nhiều phòng/giường
DECLARE @MaTaiKhoanAdmin INT, @MaNguoiDungAdmin INT, @MaAdmin INT;
DECLARE @MaTaiKhoanCB1 INT, @MaNguoiDungCB1 INT, @MaCanBo1 INT;
DECLARE @MaTaiKhoanCB2 INT, @MaNguoiDungCB2 INT, @MaCanBo2 INT;
DECLARE @MaTaiKhoanSV1 INT, @MaNguoiDungSV1 INT, @MaSinhVien1 INT;
DECLARE @MaTaiKhoanSV2 INT, @MaNguoiDungSV2 INT, @MaSinhVien2 INT;
DECLARE @MaTaiKhoanSV3 INT, @MaNguoiDungSV3 INT, @MaSinhVien3 INT;

-- Admin (admin / 123456)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (N'admin', N'123456', N'Admin');
SET @MaTaiKhoanAdmin = SCOPE_IDENTITY();
INSERT INTO NguoiDung (MaTaiKhoan, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, CCCD, DiaChi) VALUES
(@MaTaiKhoanAdmin, N'Nguyễn Văn Admin', N'Nam', '1980-01-01', N'0123456789', N'admin@ktx.edu.vn', N'001234567890', N'Hà Nội');
SET @MaNguoiDungAdmin = SCOPE_IDENTITY();
INSERT INTO Admin (MaNguoiDung, MaNV, ChucVu, PhongBan, NgayVaoLam) VALUES
(@MaNguoiDungAdmin, N'NV001', N'Giám đốc', N'Ban Giám đốc', '2020-01-01');
SET @MaAdmin = SCOPE_IDENTITY();

-- Cán bộ 1 (canbo01 / 123456)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (N'canbo01', N'123456', N'CanBo');
SET @MaTaiKhoanCB1 = SCOPE_IDENTITY();
INSERT INTO NguoiDung (MaTaiKhoan, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, CCCD, DiaChi) VALUES
(@MaTaiKhoanCB1, N'Trần Thị Cán Bộ', N'Nữ', '1985-05-15', N'0987654321', N'canbo01@ktx.edu.vn', N'001234567891', N'Hà Nội');
SET @MaNguoiDungCB1 = SCOPE_IDENTITY();
INSERT INTO CanBoKTX (MaNguoiDung, MaNV, ChucVu, PhongBan, NgayVaoLam) VALUES
(@MaNguoiDungCB1, N'NV002', N'Nhân viên', N'Phòng Quản lý KTX', '2021-06-01');
SET @MaCanBo1 = SCOPE_IDENTITY();

-- Cán bộ 2 (canbo02 / 123456)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (N'canbo02', N'123456', N'CanBo');
SET @MaTaiKhoanCB2 = SCOPE_IDENTITY();
INSERT INTO NguoiDung (MaTaiKhoan, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, CCCD, DiaChi) VALUES
(@MaTaiKhoanCB2, N'Lê Văn Quản Lý', N'Nam', '1983-11-20', N'0912345678', N'canbo02@ktx.edu.vn', N'001234567892', N'Hà Nội');
SET @MaNguoiDungCB2 = SCOPE_IDENTITY();
INSERT INTO CanBoKTX (MaNguoiDung, MaNV, ChucVu, PhongBan, NgayVaoLam) VALUES
(@MaNguoiDungCB2, N'NV003', N'Quản lý', N'Phòng Quản lý KTX', '2022-03-15');
SET @MaCanBo2 = SCOPE_IDENTITY();

-- Sinh viên 1 (sinhvien01 / 123456)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (N'sinhvien01', N'123456', N'SinhVien');
SET @MaTaiKhoanSV1 = SCOPE_IDENTITY();
INSERT INTO NguoiDung (MaTaiKhoan, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, CCCD, DiaChi) VALUES
(@MaTaiKhoanSV1, N'Lê Văn Sinh Viên', N'Nam', '2003-08-10', N'0903333333', N'sv001@student.edu.vn', N'079003003333', N'Hải Phòng');
SET @MaNguoiDungSV1 = SCOPE_IDENTITY();
INSERT INTO SinhVien (MaNguoiDung, MaSV, Khoa, Nganh, Lop, NamHoc, DiemTB) VALUES
(@MaNguoiDungSV1, N'SV001', N'Công nghệ thông tin', N'Kỹ thuật phần mềm', N'K21CNTT1', 2021, 3.45);
SET @MaSinhVien1 = SCOPE_IDENTITY();

-- Sinh viên 2 (sinhvien02 / 123456)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (N'sinhvien02', N'123456', N'SinhVien');
SET @MaTaiKhoanSV2 = SCOPE_IDENTITY();
INSERT INTO NguoiDung (MaTaiKhoan, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, CCCD, DiaChi) VALUES
(@MaTaiKhoanSV2, N'Phạm Thị Hằng', N'Nữ', '2002-05-22', N'0904444444', N'sv002@student.edu.vn', N'079004004444', N'Đà Nẵng');
SET @MaNguoiDungSV2 = SCOPE_IDENTITY();
INSERT INTO SinhVien (MaNguoiDung, MaSV, Khoa, Nganh, Lop, NamHoc, DiemTB) VALUES
(@MaNguoiDungSV2, N'SV002', N'Kinh tế', N'Quản trị kinh doanh', N'K21QTKD', 2021, 3.20);
SET @MaSinhVien2 = SCOPE_IDENTITY();

-- Sinh viên 3 (sinhvien03 / 123456)
INSERT INTO TaiKhoan (TenDangNhap, MatKhau, VaiTro) VALUES (N'sinhvien03', N'123456', N'SinhVien');
SET @MaTaiKhoanSV3 = SCOPE_IDENTITY();
INSERT INTO NguoiDung (MaTaiKhoan, HoTen, GioiTinh, NgaySinh, SoDienThoai, Email, CCCD, DiaChi) VALUES
(@MaTaiKhoanSV3, N'Hoàng Văn Nam', N'Nam', '2001-12-05', N'0905555555', N'sv003@student.edu.vn', N'079005005555', N'Huế');
SET @MaNguoiDungSV3 = SCOPE_IDENTITY();
INSERT INTO SinhVien (MaNguoiDung, MaSV, Khoa, Nganh, Lop, NamHoc, DiemTB) VALUES
(@MaNguoiDungSV3, N'SV003', N'Kỹ thuật', N'Cơ khí động lực', N'K21CKĐ', 2021, 2.80);
SET @MaSinhVien3 = SCOPE_IDENTITY();

-- Tòa nhà: đúng 2 tòa, mỗi tòa do một cán bộ quản lý
DECLARE @MaToaA INT, @MaToaB INT;
INSERT INTO ToaNha (MaToa, TenToaNha, LoaiToaNha, SoTang, MaCanBoQuanLy) VALUES
(N'A', N'Tòa nhà A', N'Nam', 5, @MaCanBo1);
SET @MaToaA = SCOPE_IDENTITY();
INSERT INTO ToaNha (MaToa, TenToaNha, LoaiToaNha, SoTang, MaCanBoQuanLy) VALUES
(N'B', N'Tòa nhà B', N'Nữ', 5, @MaCanBo2);
SET @MaToaB = SCOPE_IDENTITY();

-- Phòng và giường tòa A
DECLARE @MaPhongA101 INT, @MaPhongA102 INT, @MaPhongA201 INT, @MaPhongA202 INT, @MaPhongA301 INT, @MaPhongA302 INT;
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaA, N'A101', 1, N'Phong4Nguoi', 4, 500000); SET @MaPhongA101 = SCOPE_IDENTITY();
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaA, N'A102', 1, N'Phong4Nguoi', 4, 500000); SET @MaPhongA102 = SCOPE_IDENTITY();
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaA, N'A201', 2, N'Phong4Nguoi', 4, 500000); SET @MaPhongA201 = SCOPE_IDENTITY();
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaA, N'A202', 2, N'Phong6Nguoi', 6, 400000); SET @MaPhongA202 = SCOPE_IDENTITY();
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaA, N'A301', 3, N'Phong6Nguoi', 6, 400000); SET @MaPhongA301 = SCOPE_IDENTITY();
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaA, N'A302', 3, N'Phong8Nguoi', 8, 350000); SET @MaPhongA302 = SCOPE_IDENTITY();

INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongA101, 1), (@MaPhongA101, 2), (@MaPhongA101, 3), (@MaPhongA101, 4);
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongA102, 1), (@MaPhongA102, 2), (@MaPhongA102, 3), (@MaPhongA102, 4);
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongA201, 1), (@MaPhongA201, 2), (@MaPhongA201, 3), (@MaPhongA201, 4);
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongA202, 1), (@MaPhongA202, 2), (@MaPhongA202, 3), (@MaPhongA202, 4), (@MaPhongA202, 5), (@MaPhongA202, 6);
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongA301, 1), (@MaPhongA301, 2), (@MaPhongA301, 3), (@MaPhongA301, 4), (@MaPhongA301, 5), (@MaPhongA301, 6);
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongA302, 1), (@MaPhongA302, 2), (@MaPhongA302, 3), (@MaPhongA302, 4), (@MaPhongA302, 5), (@MaPhongA302, 6), (@MaPhongA302, 7), (@MaPhongA302, 8);

-- Phòng và giường tòa B
DECLARE @MaPhongB101 INT, @MaPhongB102 INT, @MaPhongB201 INT, @MaPhongB202 INT, @MaPhongB301 INT, @MaPhongB302 INT;
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaB, N'B101', 1, N'Phong4Nguoi', 4, 500000); SET @MaPhongB101 = SCOPE_IDENTITY();
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaB, N'B102', 1, N'Phong4Nguoi', 4, 500000); SET @MaPhongB102 = SCOPE_IDENTITY();
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaB, N'B201', 2, N'Phong6Nguoi', 6, 400000); SET @MaPhongB201 = SCOPE_IDENTITY();
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaB, N'B202', 2, N'Phong6Nguoi', 6, 400000); SET @MaPhongB202 = SCOPE_IDENTITY();
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaB, N'B301', 3, N'Phong8Nguoi', 8, 350000); SET @MaPhongB301 = SCOPE_IDENTITY();
INSERT INTO Phong (MaToaNha, SoPhong, Tang, LoaiPhong, SucChua, GiaPhong) VALUES (@MaToaB, N'B302', 3, N'Phong8Nguoi', 8, 350000); SET @MaPhongB302 = SCOPE_IDENTITY();

INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongB101, 1), (@MaPhongB101, 2), (@MaPhongB101, 3), (@MaPhongB101, 4);
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongB102, 1), (@MaPhongB102, 2), (@MaPhongB102, 3), (@MaPhongB102, 4);
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongB201, 1), (@MaPhongB201, 2), (@MaPhongB201, 3), (@MaPhongB201, 4), (@MaPhongB201, 5), (@MaPhongB201, 6);
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongB202, 1), (@MaPhongB202, 2), (@MaPhongB202, 3), (@MaPhongB202, 4), (@MaPhongB202, 5), (@MaPhongB202, 6);
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongB301, 1), (@MaPhongB301, 2), (@MaPhongB301, 3), (@MaPhongB301, 4), (@MaPhongB301, 5), (@MaPhongB301, 6), (@MaPhongB301, 7), (@MaPhongB301, 8);
INSERT INTO Giuong (MaPhong, SoGiuong) VALUES (@MaPhongB302, 1), (@MaPhongB302, 2), (@MaPhongB302, 3), (@MaPhongB302, 4), (@MaPhongB302, 5), (@MaPhongB302, 6), (@MaPhongB302, 7), (@MaPhongB302, 8);

-- Dữ liệu nghiệp vụ thật gắn với 3 sinh viên và 2 cán bộ
DECLARE @MaGiuongSV1 INT, @MaGiuongSV2 INT, @MaGiuongSV3 INT, @MaHopDong1 INT, @MaHopDong2 INT;
SELECT @MaGiuongSV1 = MaGiuong FROM Giuong WHERE MaPhong = @MaPhongA101 AND SoGiuong = 1;
SELECT @MaGiuongSV2 = MaGiuong FROM Giuong WHERE MaPhong = @MaPhongA102 AND SoGiuong = 1;
SELECT @MaGiuongSV3 = MaGiuong FROM Giuong WHERE MaPhong = @MaPhongA201 AND SoGiuong = 1;

UPDATE Giuong SET TrangThai = N'DangSuDung', MaSinhVien = @MaSinhVien1 WHERE MaGiuong = @MaGiuongSV1;
UPDATE Giuong SET TrangThai = N'DangSuDung', MaSinhVien = @MaSinhVien2 WHERE MaGiuong = @MaGiuongSV2;
UPDATE Giuong SET TrangThai = N'DangSuDung', MaSinhVien = @MaSinhVien3 WHERE MaGiuong = @MaGiuongSV3;
UPDATE Phong SET SoNguoiHienTai = 1 WHERE MaPhong IN (@MaPhongA101, @MaPhongA102, @MaPhongA201);

INSERT INTO DangKyPhong (MaSinhVien, MaPhong, MaGiuong, HocKy, SoThang, TrangThai, MaCanBoDuyet, NgayDuyet) VALUES
(@MaSinhVien1, @MaPhongA101, @MaGiuongSV1, N'Học kỳ 1 2025-2026', 6, N'DaDuyet', @MaCanBo1, GETDATE()),
(@MaSinhVien2, @MaPhongA102, @MaGiuongSV2, N'Học kỳ 1 2025-2026', 12, N'DaDuyet', @MaCanBo1, GETDATE()),
(@MaSinhVien3, @MaPhongA201, @MaGiuongSV3, N'Học kỳ 1 2025-2026', 6, N'ChoDuyet', NULL, NULL);

INSERT INTO HopDong (SoHopDong, MaSinhVien, MaPhong, MaGiuong, HocKy, NgayBatDau, NgayKetThuc, GiaThue, TrangThai, MaCanBoTao) VALUES
(N'HD2025001', @MaSinhVien1, @MaPhongA101, @MaGiuongSV1, N'Học kỳ 1 2025-2026', '2025-09-01', '2026-01-31', 500000, N'HieuLuc', @MaCanBo1);
SET @MaHopDong1 = SCOPE_IDENTITY();
INSERT INTO HopDong (SoHopDong, MaSinhVien, MaPhong, MaGiuong, HocKy, NgayBatDau, NgayKetThuc, GiaThue, TrangThai, MaCanBoTao) VALUES
(N'HD2025002', @MaSinhVien2, @MaPhongA102, @MaGiuongSV2, N'Học kỳ 1 2025-2026', '2025-09-01', '2026-01-31', 500000, N'HieuLuc', @MaCanBo1);
SET @MaHopDong2 = SCOPE_IDENTITY();

INSERT INTO HoaDon (SoHoaDon, MaHopDong, MaSinhVien, Thang, Nam, HanThanhToan, TienPhong, TienDien, TienNuoc, PhiDichVu, TongTien, ChiSoDienCu, ChiSoDienMoi, ChiSoNuocCu, ChiSoNuocMoi, TrangThai, MaCanBoTao) VALUES
(N'HDON20251001', @MaHopDong1, @MaSinhVien1, 10, 2025, '2025-10-05', 500000, 85000, 45000, 30000, 660000, 120, 145, 30, 39, N'ChuaThanhToan', @MaCanBo1),
(N'HDON20251002', @MaHopDong2, @MaSinhVien2, 10, 2025, '2025-10-05', 500000, 70000, 40000, 30000, 640000, 90, 112, 24, 32, N'DaThanhToan', @MaCanBo1);

INSERT INTO ViPham (MaSinhVien, TenViPham, MucDo, MoTa, MucPhat, TrangThai, MaCanBoGhi) VALUES
(@MaSinhVien2, N'Không tuân thủ giờ giấc', N'TrungBinh', N'Về ký túc xá quá giờ quy định', 200000, N'DaXuLy', @MaCanBo1),
(@MaSinhVien3, N'Có vật dụng cấm trong phòng', N'Nang', N'Phát hiện bếp điện trong phòng', 500000, N'ChoDuyet', @MaCanBo2);

INSERT INTO ThongBao (TieuDe, NoiDung, LoaiThongBao, LoaiNguoiNhan, MaCanBoGui) VALUES
(N'Thông báo đóng cửa KTX', N'Ký túc xá đóng cửa lúc 23h00 hằng ngày.', N'Chung', N'TatCa', @MaCanBo1);
INSERT INTO ThongBao (TieuDe, NoiDung, LoaiThongBao, LoaiNguoiNhan, MaSinhVienNhan, MaCanBoGui) VALUES
(N'Lịch bảo trì điện', N'Phòng A101 bảo trì điện từ 08h00 đến 12h00 ngày 15/10.', N'BaoTri', N'SinhVien', @MaSinhVien1, @MaCanBo2);

INSERT INTO YeuCauBaoTri (MaPhong, MaSinhVien, TieuDe, MoTa, LoaiYeuCau, TrangThai, MaCanBoXuLy, NgayXuLy, ChiPhi) VALUES
(@MaPhongA101, @MaSinhVien1, N'Đèn phòng hỏng', N'Đèn ngủ không sáng.', N'Dien', N'DaXuLy', @MaCanBo2, GETDATE(), 120000),
(@MaPhongA201, @MaSinhVien3, N'Quạt hỏng', N'Quạt trần không chạy.', N'Dien', N'ChoDuyet', NULL, NULL, NULL);

INSERT INTO BaoCaoThongKe (TenBaoCao, LoaiBaoCao, MoTa, TuNgay, DenNgay, NoiDung, MaAdminTao) VALUES
(N'Báo cáo tổng quan tháng 10/2025', N'TongQuan', N'Tổng hợp dữ liệu ký túc xá tháng 10/2025', '2025-10-01', '2025-10-31', N'{"tongSinhVien":3,"tongCanBo":2,"tongPhong":12,"tongGiuong":68,"tongHopDong":2}', @MaAdmin);

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
