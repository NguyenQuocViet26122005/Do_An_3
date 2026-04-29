namespace Api_Gateway.DTO.BaoTri
{
    public class YeuCauBaoTriDTO
    {
        public int MaYeuCau { get; set; }
        public int MaSinhVien { get; set; }
        public string? TenSinhVien { get; set; }
        public string? MaSV { get; set; }
        public int MaPhong { get; set; }
        public string? TenPhong { get; set; }
        public string TieuDe { get; set; } = string.Empty;
        public string? MoTa { get; set; }
        public string? LoaiYeuCau { get; set; }
        public string? TrangThai { get; set; }
        public int? MaCanBoXuLy { get; set; }
        public string? TenCanBoXuLy { get; set; }
        public DateTime? NgayXuLy { get; set; }
        public DateTime? NgayHoanThanh { get; set; }
        public decimal? ChiPhi { get; set; }
        public string? GhiChu { get; set; }
        public DateTime NgayTao { get; set; }
    }
}
