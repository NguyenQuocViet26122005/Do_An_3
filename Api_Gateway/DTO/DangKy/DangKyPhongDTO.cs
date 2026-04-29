namespace Api_Gateway.DTO.DangKy
{
    public class DangKyPhongDTO
    {
        public int MaDangKy { get; set; }
        public int MaSinhVien { get; set; }
        public string? TenSinhVien { get; set; }
        public string? MaSV { get; set; }
        public int MaPhong { get; set; }
        public string? TenPhong { get; set; }
        public string? TenToaNha { get; set; }
        public int? MaGiuong { get; set; }
        public int? SoGiuong { get; set; }
        public string? HocKy { get; set; }
        public DateTime? NgayDangKy { get; set; }
        public string? TrangThai { get; set; }
        public int? MaCanBoDuyet { get; set; }
        public string? TenCanBoDuyet { get; set; }
        public DateTime? NgayDuyet { get; set; }
        public string? LyDoTuChoi { get; set; }
    }
}
