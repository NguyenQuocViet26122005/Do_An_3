using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.HopDong
{
    public class GiaHanHopDongDTO
    {
        [Required(ErrorMessage = "Thời hạn gia hạn không được để trống")]
        [Range(1, 120, ErrorMessage = "Thời hạn gia hạn phải từ 1 đến 120 tháng")]
        public int SoThangGiaHan { get; set; }
    }
}
