using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.Auth
{
    public class RegisterRequestDTO
    {
        // Tài khoản
        [Required(ErrorMessage = "Tên đăng nhập không được để trống")]
        [StringLength(50)]
        public string TenDangNhap { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mật khẩu không được để trống")]
        [StringLength(255, MinimumLength = 6, ErrorMessage = "Mật khẩu phải có ít nhất 6 ký tự")]
        public string MatKhau { get; set; } = string.Empty;

        [Required(ErrorMessage = "Vai trò không được để trống")]
        public string VaiTro { get; set; } = string.Empty; // Admin, CanBo, SinhVien

        // Người dùng
        [Required(ErrorMessage = "Họ tên không được để trống")]
        [StringLength(100)]
        public string HoTen { get; set; } = string.Empty;

        [Required(ErrorMessage = "Giới tính không được để trống")]
        public string GioiTinh { get; set; } = string.Empty;

        [Required(ErrorMessage = "Ngày sinh không được để trống")]
        public DateTime NgaySinh { get; set; }

        [Required(ErrorMessage = "Số điện thoại không được để trống")]
        [Phone(ErrorMessage = "Số điện thoại không hợp lệ")]
        public string SoDienThoai { get; set; } = string.Empty;

        [Required(ErrorMessage = "Email không được để trống")]
        [EmailAddress(ErrorMessage = "Email không hợp lệ")]
        public string Email { get; set; } = string.Empty;

        [Required(ErrorMessage = "CCCD không được để trống")]
        [StringLength(20)]
        public string CCCD { get; set; } = string.Empty;

        public string? DiaChi { get; set; }

        // Thông tin riêng theo vai trò
        public string? MaNV { get; set; } // Cho Admin và CanBo
        public string? ChucVu { get; set; }
        public string? PhongBan { get; set; }
        public DateTime? NgayVaoLam { get; set; }

        public string? MaSV { get; set; } // Cho SinhVien
        public string? Khoa { get; set; }
        public string? Nganh { get; set; }
        public string? Lop { get; set; }
        public int? NamHoc { get; set; }
        public decimal? DiemTB { get; set; }
    }
}
