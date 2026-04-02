using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("DangKyPhong")]
    public class DangKyPhong
    {
        [Key]
        public int MaDangKy { get; set; }

        [Required]
        public int MaSinhVien { get; set; }

        [Required]
        public int MaPhong { get; set; }

        public int? MaGiuong { get; set; }

        [Required]
        [StringLength(20)]
        public string HocKy { get; set; } = string.Empty;

        public DateTime NgayDangKy { get; set; } = DateTime.Now;

        [StringLength(20)]
        public string TrangThai { get; set; } = "ChoDuyet";

        public int? MaCanBoDuyet { get; set; }

        public DateTime? NgayDuyet { get; set; }

        [StringLength(255)]
        public string? LyDoTuChoi { get; set; }

        // Navigation properties
        [ForeignKey("MaSinhVien")]
        public virtual SinhVien? SinhVien { get; set; }

        [ForeignKey("MaPhong")]
        public virtual Phong? Phong { get; set; }

        [ForeignKey("MaGiuong")]
        public virtual Giuong? Giuong { get; set; }

        [ForeignKey("MaCanBoDuyet")]
        public virtual CanBoKTX? CanBoDuyet { get; set; }
    }
}
