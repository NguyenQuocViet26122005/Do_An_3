namespace Api_Gateway.DTO.HopDong
{
    public class HopDongDTO
    {
        public int MaHopDong { get; set; }
        public string SoHopDong { get; set; } = string.Empty;
        public int MaSinhVien { get; set; }
        public string? TenSinhVien { get; set; }
        public string? MaSV { get; set; }
        public int MaPhong { get; set; }
        public string? TenPhong { get; set; }
        public string? TenToaNha { get; set; }
        public int MaGiuong { get; set; }
        public int? SoGiuong { get; set; }
        public DateOnly NgayBatDau { get; set; }
        public DateOnly NgayKetThuc { get; set; }
        public decimal GiaThue { get; set; }
        public string? TrangThai { get; set; }
        public int MaCanBoTao { get; set; }
        public string? TenCanBoTao { get; set; }
        public DateTime? NgayTao { get; set; }
    }
}
