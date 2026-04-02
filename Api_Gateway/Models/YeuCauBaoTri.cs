using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("YeuCauBaoTri")]
    public class YeuCauBaoTri
    {
        [Key]
        public int MaYeuCau { get; set; }

        [Required]
        public int MaPhong { get; set; }

        [Required]
        public int MaSinhVien { get; set; }

        [Required]
        [StringLength(255)]
        public string TieuDe { get; set; } = string.Empty;

        [Required]
        public string MoTa { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LoaiYeuCau { get; set; } = string.Empty;

        [StringLength(20)]
        public string TrangThai { get; set; } = "ChoDuyet";

        public int? MaCanBoXuLy { get; set; }

        public DateTime? NgayXuLy { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal? ChiPhi { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaPhong")]
        public virtual Phong? Phong { get; set; }

        [ForeignKey("MaSinhVien")]
        public virtual SinhVien? SinhVien { get; set; }

        [ForeignKey("MaCanBoXuLy")]
        public virtual CanBoKTX? CanBoXuLy { get; set; }
    }
}
