using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("CanBoKTX")]
    public class CanBoKTX
    {
        [Key]
        public int MaCanBo { get; set; }

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

        public virtual ICollection<ToaNha> ToaNhaQuanLy { get; set; } = new List<ToaNha>();
        public virtual ICollection<DangKyPhong> DangKyDuyet { get; set; } = new List<DangKyPhong>();
        public virtual ICollection<HopDong> HopDongTao { get; set; } = new List<HopDong>();
        public virtual ICollection<HoaDon> HoaDonTao { get; set; } = new List<HoaDon>();
        public virtual ICollection<ViPham> ViPhamGhi { get; set; } = new List<ViPham>();
        public virtual ICollection<ThongBao> ThongBaoGui { get; set; } = new List<ThongBao>();
        public virtual ICollection<ThongBao> ThongBaoNhan { get; set; } = new List<ThongBao>();
        public virtual ICollection<YeuCauBaoTri> YeuCauXuLy { get; set; } = new List<YeuCauBaoTri>();
    }
}
