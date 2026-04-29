namespace Api_Gateway.DTO.ToaNha
{
    public class ToaNhaDTO
    {
        public int MaToaNha { get; set; }
        public string MaToa { get; set; } = string.Empty;
        public string TenToaNha { get; set; } = string.Empty;
        public string? LoaiToaNha { get; set; }
        public int? SoTang { get; set; }
        public string? TrangThai { get; set; }
        public int? MaCanBoQuanLy { get; set; }
        public string? TenCanBoQuanLy { get; set; }
        public int? TongSoPhong { get; set; }
        public int? SoPhongTrong { get; set; }
    }
}
