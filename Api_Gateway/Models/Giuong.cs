using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("Giuong")]
    public class Giuong
    {
        [Key]
        public int MaGiuong { get; set; }

        [Required]
        public int MaPhong { get; set; }

        [Required]
        public int SoGiuong { get; set; }

        [StringLength(20)]
        public string TrangThai { get; set; } = "ConTrong";

        public int? MaSinhVien { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaPhong")]
        public virtual Phong? Phong { get; set; }

        [ForeignKey("MaSinhVien")]
        public virtual SinhVien? SinhVien { get; set; }

        public virtual ICollection<DangKyPhong> DangKyPhong { get; set; } = new List<DangKyPhong>();
        public virtual ICollection<HopDong> HopDong { get; set; } = new List<HopDong>();
    }
}
