using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.ThongBao
{
    public class CreateThongBaoDTO
    {
        [Required(ErrorMessage = "Tiêu đề không được để trống")]
        [StringLength(200)]
        public string TieuDe { get; set; } = string.Empty;

        [Required(ErrorMessage = "Nội dung không được để trống")]
        public string NoiDung { get; set; } = string.Empty;

        [StringLength(50)]
        public string? LoaiThongBao { get; set; }

        public int? MaSinhVienNhan { get; set; }

        public int? MaCanBoNhan { get; set; }

        // Nếu cả 2 đều null thì gửi cho tất cả
    }
}
