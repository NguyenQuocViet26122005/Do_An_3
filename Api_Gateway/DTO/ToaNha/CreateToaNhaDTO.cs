using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.ToaNha
{
    public class CreateToaNhaDTO
    {
        [Required(ErrorMessage = "Mã tòa không được để trống")]
        [StringLength(10)]
        public string MaToa { get; set; } = string.Empty;

        [Required(ErrorMessage = "Tên tòa nhà không được để trống")]
        [StringLength(100)]
        public string TenToaNha { get; set; } = string.Empty;

        [StringLength(50)]
        public string? LoaiToaNha { get; set; }

        public int? SoTang { get; set; }

        public int? MaCanBoQuanLy { get; set; }
    }
}
