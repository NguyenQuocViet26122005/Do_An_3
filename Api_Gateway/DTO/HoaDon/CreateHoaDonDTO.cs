using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.HoaDon
{
    public class CreateHoaDonDTO
    {
        [Required(ErrorMessage = "Số hóa đơn không được để trống")]
        [StringLength(50)]
        public string SoHoaDon { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mã hợp đồng không được để trống")]
        public int MaHopDong { get; set; }

        [Required(ErrorMessage = "Mã sinh viên không được để trống")]
        public int MaSinhVien { get; set; }

        [Required(ErrorMessage = "Tháng không được để trống")]
        [Range(1, 12)]
        public int Thang { get; set; }

        [Required(ErrorMessage = "Năm không được để trống")]
        public int Nam { get; set; }

        [Required(ErrorMessage = "Tiền phòng không được để trống")]
        public decimal TienPhong { get; set; }

        public decimal TienDien { get; set; } = 0;

        public decimal TienNuoc { get; set; } = 0;

        public decimal PhiDichVu { get; set; } = 0;

        public decimal PhiPhat { get; set; } = 0;
    }
}
