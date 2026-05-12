using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.HopDong
{
    public class CreateHopDongDTO
    {
        [Required(ErrorMessage = "Số hợp đồng không được để trống")]
        [StringLength(50)]
        public string SoHopDong { get; set; } = string.Empty;

        [Required(ErrorMessage = "Mã sinh viên không được để trống")]
        public int MaSinhVien { get; set; }

        [Required(ErrorMessage = "Mã phòng không được để trống")]
        public int MaPhong { get; set; }

        [Required(ErrorMessage = "Mã giường không được để trống")]
        public int MaGiuong { get; set; }

        [Required(ErrorMessage = "Học kỳ không được để trống")]
        [StringLength(20)]
        public string HocKy { get; set; } = string.Empty;

        [Required(ErrorMessage = "Ngày bắt đầu không được để trống")]
        public DateTime NgayBatDau { get; set; }

        [Required(ErrorMessage = "Ngày kết thúc không được để trống")]
        public DateTime NgayKetThuc { get; set; }

        [Required(ErrorMessage = "Giá thuê không được để trống")]
        public decimal GiaThue { get; set; }
    }
}
