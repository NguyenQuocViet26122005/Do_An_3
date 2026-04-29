using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.Phong
{
    public class CreatePhongDTO
    {
        [Required(ErrorMessage = "Số phòng không được để trống")]
        [StringLength(10)]
        public string SoPhong { get; set; } = string.Empty;

        public int? Tang { get; set; }

        [StringLength(50)]
        public string? LoaiPhong { get; set; }

        [Required(ErrorMessage = "Sức chứa không được để trống")]
        public int SucChua { get; set; }

        [Required(ErrorMessage = "Giá phòng không được để trống")]
        public decimal GiaPhong { get; set; }

        [Required(ErrorMessage = "Mã tòa nhà không được để trống")]
        public int MaToaNha { get; set; }
    }
}
