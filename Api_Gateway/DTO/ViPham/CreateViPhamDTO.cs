using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.ViPham
{
    public class CreateViPhamDTO
    {
        [Required(ErrorMessage = "Mã sinh viên không được để trống")]
        public int MaSinhVien { get; set; }

        [Required(ErrorMessage = "Tên vi phạm không được để trống")]
        [StringLength(200)]
        public string TenViPham { get; set; } = string.Empty;

        [StringLength(50)]
        public string? MucDo { get; set; }

        public string? MoTa { get; set; }

        [Required(ErrorMessage = "Mức phạt không được để trống")]
        public decimal MucPhat { get; set; }

        [Required(ErrorMessage = "Ngày vi phạm không được để trống")]
        public DateTime NgayViPham { get; set; }
    }
}
