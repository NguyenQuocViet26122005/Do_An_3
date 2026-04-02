using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("HopDong")]
    public class HopDong
    {
        [Key]
        public int MaHopDong { get; set; }

        [Required]
        [StringLength(50)]
        public string SoHopDong { get; set; } = string.Empty;

        [Required]
        public int MaSinhVien { get; set; }

        [Required]
        public int MaPhong { get; set; }

        [Required]
        public int MaGiuong { get; set; }

        [Required]
        [StringLength(20)]
        public string HocKy { get; set; } = string.Empty;

        [Required]
        public DateTime NgayBatDau { get; set; }

        [Required]
        public DateTime NgayKetThuc { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal GiaThue { get; set; }

        [StringLength(20)]
        public string TrangThai { get; set; } = "HieuLuc";

        [Required]
        public int MaCanBoTao { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaSinhVien")]
        public virtual SinhVien? SinhVien { get; set; }

        [ForeignKey("MaPhong")]
        public virtual Phong? Phong { get; set; }

        [ForeignKey("MaGiuong")]
        public virtual Giuong? Giuong { get; set; }

        [ForeignKey("MaCanBoTao")]
        public virtual CanBoKTX? CanBoTao { get; set; }

        public virtual ICollection<HoaDon> HoaDon { get; set; } = new List<HoaDon>();
    }
}
