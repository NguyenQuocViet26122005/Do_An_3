using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Api_Gateway.Models
{
    [Table("HoaDon")]
    public class HoaDon
    {
        [Key]
        public int MaHoaDon { get; set; }

        [Required]
        [StringLength(50)]
        public string SoHoaDon { get; set; } = string.Empty;

        [Required]
        public int MaHopDong { get; set; }

        [Required]
        public int MaSinhVien { get; set; }

        [Required]
        public int Thang { get; set; }

        [Required]
        public int Nam { get; set; }

        public DateTime NgayPhatHanh { get; set; } = DateTime.Now;

        [Required]
        public DateTime HanThanhToan { get; set; }

        // Các khoản phí
        [Column(TypeName = "decimal(18,2)")]
        public decimal TienPhong { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TienDien { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal TienNuoc { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PhiDichVu { get; set; } = 0;

        [Column(TypeName = "decimal(18,2)")]
        public decimal PhiPhat { get; set; } = 0;

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal TongTien { get; set; }

        // Chỉ số điện nước
        [Column(TypeName = "decimal(10,2)")]
        public decimal? ChiSoDienCu { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? ChiSoDienMoi { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? ChiSoNuocCu { get; set; }

        [Column(TypeName = "decimal(10,2)")]
        public decimal? ChiSoNuocMoi { get; set; }

        // Thanh toán
        [StringLength(20)]
        public string TrangThai { get; set; } = "ChuaThanhToan";

        public DateTime? NgayThanhToan { get; set; }

        [StringLength(50)]
        public string? PhuongThucThanhToan { get; set; }

        [StringLength(100)]
        public string? MaGiaoDich { get; set; }

        [Required]
        public int MaCanBoTao { get; set; }

        public DateTime NgayTao { get; set; } = DateTime.Now;

        // Navigation properties
        [ForeignKey("MaHopDong")]
        public virtual HopDong? HopDong { get; set; }

        [ForeignKey("MaSinhVien")]
        public virtual SinhVien? SinhVien { get; set; }

        [ForeignKey("MaCanBoTao")]
        public virtual CanBoKTX? CanBoTao { get; set; }
    }
}
