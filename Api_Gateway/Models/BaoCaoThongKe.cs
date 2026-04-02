using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("BaoCaoThongKe")]
    public class BaoCaoThongKe
    {
        [Key]
        public int MaBaoCao { get; set; }

        [Required]
        [StringLength(255)]
        public string TenBaoCao { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LoaiBaoCao { get; set; } = string.Empty; // DoanhThu, SinhVien, Phong, ViPham, TongQuan

        public string? MoTa { get; set; }

        public DateTime? TuNgay { get; set; }

        public DateTime? DenNgay { get; set; }

        public string? NoiDung { get; set; } // JSON

        [StringLength(255)]
        public string? FilePath { get; set; }

        [Required]
        public int MaAdminTao { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaAdminTao")]
        public virtual Admin? AdminTao { get; set; }
    }
}
