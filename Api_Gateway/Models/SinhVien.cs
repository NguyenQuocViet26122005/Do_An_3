using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("SinhVien")]
    public class SinhVien
    {
        [Key]
        public int MaSinhVien { get; set; }

        [Required]
        public int MaNguoiDung { get; set; }

        [Required]
        [StringLength(20)]
        public string MaSV { get; set; } = string.Empty;

        [StringLength(100)]
        public string? Khoa { get; set; }

        [StringLength(100)]
        public string? Nganh { get; set; }

        [StringLength(50)]
        public string? Lop { get; set; }

        public int? NamHoc { get; set; }

        [Column(TypeName = "decimal(3,2)")]
        public decimal? DiemTB { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaNguoiDung")]
        public virtual NguoiDung? NguoiDung { get; set; }

        public virtual ICollection<Giuong> Giuong { get; set; } = new List<Giuong>();
        public virtual ICollection<DangKyPhong> DangKyPhong { get; set; } = new List<DangKyPhong>();
        public virtual ICollection<HopDong> HopDong { get; set; } = new List<HopDong>();
        public virtual ICollection<HoaDon> HoaDon { get; set; } = new List<HoaDon>();
        public virtual ICollection<ViPham> ViPham { get; set; } = new List<ViPham>();
        public virtual ICollection<ThongBao> ThongBao { get; set; } = new List<ThongBao>();
        public virtual ICollection<YeuCauBaoTri> YeuCauBaoTri { get; set; } = new List<YeuCauBaoTri>();
    }
}
