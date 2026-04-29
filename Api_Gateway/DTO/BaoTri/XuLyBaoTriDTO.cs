using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.BaoTri
{
    public class XuLyBaoTriDTO
    {
        [Required(ErrorMessage = "Trạng thái không được để trống")]
        public string TrangThai { get; set; } = string.Empty; // DangXuLy, DaHoanThanh, DaHuy

        public decimal? ChiPhi { get; set; }

        public string? GhiChu { get; set; }
    }
}
