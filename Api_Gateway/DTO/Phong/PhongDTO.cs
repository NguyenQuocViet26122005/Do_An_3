namespace Api_Gateway.DTO.Phong
{
    public class PhongDTO
    {
        public int MaPhong { get; set; }
        public string SoPhong { get; set; } = string.Empty;
        public int? Tang { get; set; }
        public string? LoaiPhong { get; set; }
        public int? SucChua { get; set; }
        public decimal? GiaPhong { get; set; }
        public string? TrangThai { get; set; }
        public int? SoNguoiHienTai { get; set; }
        public int MaToaNha { get; set; }
        public string? TenToaNha { get; set; }
        public int? SoGiuongTrong { get; set; }
    }
}
