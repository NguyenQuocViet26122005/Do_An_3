using System;

namespace Api_Gateway.DTO.Auth
{
    public class UserDTO
    {
        public int MaTaiKhoan { get; set; }
        public string TenDangNhap { get; set; } = string.Empty;
        public string VaiTro { get; set; } = string.Empty;
        public bool TrangThai { get; set; }
        public DateTime? NgayTao { get; set; }

        // NguoiDung
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string GioiTinh { get; set; } = string.Empty;
        public DateOnly NgaySinh { get; set; }
        public string SoDienThoai { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public string CCCD { get; set; } = string.Empty;
        public string? DiaChi { get; set; }

        // Actor specific
        public int? MaActor { get; set; }
        public string? MaActorCode { get; set; }
        public string? ChucVu { get; set; }
        public string? PhongBan { get; set; }
        public DateOnly? NgayVaoLam { get; set; }

        // Student
        public string? Khoa { get; set; }
        public string? Nganh { get; set; }
        public string? Lop { get; set; }
        public int? NamHoc { get; set; }
        public decimal? DiemTB { get; set; }
    }
}
