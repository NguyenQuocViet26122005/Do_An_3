using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.ToaNha
{
    public class UpdateToaNhaDTO
    {
        [StringLength(10)]
        public string? MaToa { get; set; }

        [StringLength(100)]
        public string? TenToaNha { get; set; }

        [StringLength(50)]
        public string? LoaiToaNha { get; set; }

        public int? SoTang { get; set; }

        [StringLength(20)]
        public string? TrangThai { get; set; }

        public int? MaCanBoQuanLy { get; set; }
    }
}
