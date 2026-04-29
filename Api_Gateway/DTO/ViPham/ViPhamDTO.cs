namespace Api_Gateway.DTO.ViPham
{
    public class ViPhamDTO
    {
        public int MaViPham { get; set; }
        public int MaSinhVien { get; set; }
        public string? TenSinhVien { get; set; }
        public string? MaSV { get; set; }
        public string? TenPhong { get; set; }
        public string TenViPham { get; set; } = string.Empty;
        public string? MucDo { get; set; }
        public string? MoTa { get; set; }
        public decimal MucPhat { get; set; }
        public DateOnly NgayViPham { get; set; }
        public string? TrangThai { get; set; }
        public int MaCanBoGhi { get; set; }
        public string? TenCanBoGhi { get; set; }
        public DateTime NgayGhi { get; set; }
    }
}
