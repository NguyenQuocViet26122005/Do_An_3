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
        public int? MaPhong { get; set; }
        public string? TenPhong { get; set; }
        public string? TenToaNha { get; set; }
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
        
        // Thêm chỉ số điện nước để sinh viên thấy được
        public decimal? ChiSoDienCu { get; set; }
        public decimal? ChiSoDienMoi { get; set; }
        public decimal? ChiSoNuocCu { get; set; }
        public decimal? ChiSoNuocMoi { get; set; }
        public DateOnly? HanThanhToan { get; set; }
        public string? PhuongThucThanhToan { get; set; }
        public string? MaGiaoDich { get; set; }
    }
}
