using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("ThongBao")]
    public class ThongBao
    {
        [Key]
        public int MaThongBao { get; set; }

        [Required]
        [StringLength(255)]
        public string TieuDe { get; set; } = string.Empty;

        [Required]
        public string NoiDung { get; set; } = string.Empty;

        [Required]
        [StringLength(50)]
        public string LoaiThongBao { get; set; } = string.Empty;

        [Required]
        [StringLength(20)]
        public string LoaiNguoiNhan { get; set; } = string.Empty; // TatCa, SinhVien, CanBo

        public int? MaSinhVienNhan { get; set; }

        public int? MaCanBoNhan { get; set; }

        public bool DaDoc { get; set; } = false;

        public DateTime? NgayDoc { get; set; }

        [Required]
        public int MaCanBoGui { get; set; }

        public DateTime NgayGui { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaSinhVienNhan")]
        public virtual SinhVien? SinhVienNhan { get; set; }

        [ForeignKey("MaCanBoNhan")]
        public virtual CanBoKTX? CanBoNhan { get; set; }

        [ForeignKey("MaCanBoGui")]
        public virtual CanBoKTX? CanBoGui { get; set; }
    }
}
