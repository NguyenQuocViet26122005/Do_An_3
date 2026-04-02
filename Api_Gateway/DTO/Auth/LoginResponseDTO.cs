namespace Api_Gateway.DTO.Auth
{
    public class LoginResponseDTO
    {
        public string Token { get; set; } = string.Empty;
        public string VaiTro { get; set; } = string.Empty;
        public int MaTaiKhoan { get; set; }
        public int MaNguoiDung { get; set; }
        public string HoTen { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int? MaActor { get; set; } // MaAdmin, MaCanBo, hoặc MaSinhVien
    }
}
