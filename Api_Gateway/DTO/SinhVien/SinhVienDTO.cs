namespace Api_Gateway.DTO.SinhVien
{
    public class SinhVienDTO
    {
        public int MaSinhVien { get; set; }
        public int MaNguoiDung { get; set; }
        public string MaSv { get; set; } = string.Empty;
        public string HoTen { get; set; } = string.Empty;
        public string? GioiTinh { get; set; }
        public DateOnly? NgaySinh { get; set; }
        public string? SoDienThoai { get; set; }
        public string? Email { get; set; }
        public string? Cccd { get; set; }
        public string? DiaChi { get; set; }
        public string? Khoa { get; set; }
        public string? Nganh { get; set; }
        public string? Lop { get; set; }
        public int? NamHoc { get; set; }
        public decimal? DiemTb { get; set; }
        public string? TenPhong { get; set; }
        public int? SoGiuong { get; set; }
    }
}
