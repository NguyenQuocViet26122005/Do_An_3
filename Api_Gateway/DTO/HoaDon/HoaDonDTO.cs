namespace Api_Gateway.DTO.HoaDon
{
    public class HoaDonDTO
    {
        public int MaHoaDon { get; set; }
        public string SoHoaDon { get; set; } = string.Empty;
        public int MaHopDong { get; set; }
        public string? SoHopDong { get; set; }
        public int MaSinhVien { get; set; }
        public string? TenSinhVien { get; set; }
        public string? MaSV { get; set; }
        public string? TenPhong { get; set; }
        public int Thang { get; set; }
        public int Nam { get; set; }
        public decimal TienPhong { get; set; }
        public decimal TienDien { get; set; }
        public decimal TienNuoc { get; set; }
        public decimal PhiDichVu { get; set; }
        public decimal PhiPhat { get; set; }
        public decimal TongTien { get; set; }
        public string? TrangThai { get; set; }
        public DateTime NgayPhatHanh { get; set; }
        public DateTime? NgayThanhToan { get; set; }
        public int MaCanBoTao { get; set; }
        public string? TenCanBoTao { get; set; }
    }
}
