using System.ComponentModel.DataAnnotations;

namespace Api_Gateway.DTO.Phong
{
    public class UpdatePhongDTO
    {
        [StringLength(10)]
        public string? SoPhong { get; set; }

        public int? Tang { get; set; }

        [StringLength(50)]
        public string? LoaiPhong { get; set; }

        public int? SucChua { get; set; }

        public decimal? GiaPhong { get; set; }

        [StringLength(20)]
        public string? TrangThai { get; set; }

        public int? MaToaNha { get; set; }
    }
}
