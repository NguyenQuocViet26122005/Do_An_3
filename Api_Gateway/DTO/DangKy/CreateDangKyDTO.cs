using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.DangKy
{
    public class CreateDangKyDTO
    {
        [Required(ErrorMessage = "Mã phòng không được để trống")]
        public int MaPhong { get; set; }

        public int? MaGiuong { get; set; }

        [StringLength(50)]
        public string? HocKy { get; set; }
    }
}
