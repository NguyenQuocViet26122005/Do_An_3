using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.BaoTri
{
    public class CreateYeuCauBaoTriDTO
    {
        [Required(ErrorMessage = "Mã phòng không được để trống")]
        public int MaPhong { get; set; }

        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        [StringLength(200)]
        public string TieuDe { get; set; } = string.Empty;

        public string? MoTa { get; set; }

        [StringLength(50)]
        public string? LoaiYeuCau { get; set; }
    }
}
