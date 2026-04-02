using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("Admin")]
    public class Admin
    {
        [Key]
        public int MaAdmin { get; set; }

        [Required]
        public int MaNguoiDung { get; set; }

        [Required]
        [StringLength(20)]
        public string MaNV { get; set; } = string.Empty;

        [StringLength(100)]
        public string? ChucVu { get; set; }

        [StringLength(100)]
        public string? PhongBan { get; set; }

        public DateTime? NgayVaoLam { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaNguoiDung")]
        public virtual NguoiDung? NguoiDung { get; set; }

        public virtual ICollection<BaoCaoThongKe> BaoCaoThongKe { get; set; } = new List<BaoCaoThongKe>();
    }
}
