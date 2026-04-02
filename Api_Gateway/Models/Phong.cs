using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("Phong")]
    public class Phong
    {
        [Key]
        public int MaPhong { get; set; }

        [Required]
        public int MaToaNha { get; set; }

        [Required]
        [StringLength(20)]
        public string SoPhong { get; set; } = string.Empty;

        [Required]
        public int Tang { get; set; }

        [Required]
        [StringLength(50)]
        public string LoaiPhong { get; set; } = string.Empty;

        [Required]
        public int SucChua { get; set; }

        public int SoNguoiHienTai { get; set; } = 0;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaPhong { get; set; }

        [StringLength(20)]
        public string TrangThai { get; set; } = "ConTrong";

        public DateTime NgayTao { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaToaNha")]
        public virtual ToaNha? ToaNha { get; set; }

        public virtual ICollection<Giuong> Giuong { get; set; } = new List<Giuong>();
        public virtual ICollection<DangKyPhong> DangKyPhong { get; set; } = new List<DangKyPhong>();
        public virtual ICollection<HopDong> HopDong { get; set; } = new List<HopDong>();
        public virtual ICollection<YeuCauBaoTri> YeuCauBaoTri { get; set; } = new List<YeuCauBaoTri>();
    }
}
