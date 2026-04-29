using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.DangKy
{
    public class DuyetDangKyDTO
    {
        [Required(ErrorMessage = "Trạng thái không được để trống")]
        public string TrangThai { get; set; } = string.Empty; // DaDuyet hoặc TuChoi

        public string? LyDoTuChoi { get; set; }
    }
}
