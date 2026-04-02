using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("ViPham")]
    public class ViPham
    {
        [Key]
        public int MaViPham { get; set; }

        [Required]
        public int MaSinhVien { get; set; }

        [Required]
        [StringLength(100)]
        public string TenViPham { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string MucDo { get; set; } = string.Empty;

        public string? MoTa { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal MucPhat { get; set; } = 0;

        public DateTime NgayViPham { get; set; } = DateTime.Now;

        [StringLength(20)]
        public string TrangThai { get; set; } = "ChoDuyet";

        [Required]
        public int MaCanBoGhi { get; set; }

        public DateTime NgayGhi { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaSinhVien")]
        public virtual SinhVien? SinhVien { get; set; }

        [ForeignKey("MaCanBoGhi")]
        public virtual CanBoKTX? CanBoGhi { get; set; }
    }
}
