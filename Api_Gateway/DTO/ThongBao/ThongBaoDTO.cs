namespace Api_Gateway.DTO.ThongBao
{
    public class ThongBaoDTO
    {
        public int MaThongBao { get; set; }
        public string TieuDe { get; set; } = string.Empty;
        public string NoiDung { get; set; } = string.Empty;
        public string? LoaiThongBao { get; set; }
        public int MaCanBoGui { get; set; }
        public string? TenCanBoGui { get; set; }
        public int? MaSinhVienNhan { get; set; }
        public string? TenSinhVienNhan { get; set; }
        public int? MaCanBoNhan { get; set; }
        public string? TenCanBoNhan { get; set; }
        public DateTime NgayGui { get; set; }
        public bool DaDoc { get; set; }
    }
}
