using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("HoaDon")]
[Index("MaSinhVien", Name = "IX_HoaDon_MaSinhVien")]
[Index("SoHoaDon", Name = "UQ__HoaDon__012E9E53A4DEE455", IsUnique = true)]
public partial class HoaDon
{
    [Key]
    public int MaHoaDon { get; set; }

    [StringLength(50)]
    public string SoHoaDon { get; set; } = null!;

    public int MaHopDong { get; set; }

    public int MaSinhVien { get; set; }

    public int Thang { get; set; }

    public int Nam { get; set; }

    public DateOnly? NgayPhatHanh { get; set; }

    public DateOnly HanThanhToan { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? TienPhong { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? TienDien { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? TienNuoc { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PhiDichVu { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? PhiPhat { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal TongTien { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? ChiSoDienCu { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? ChiSoDienMoi { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? ChiSoNuocCu { get; set; }

    [Column(TypeName = "decimal(10, 2)")]
    public decimal? ChiSoNuocMoi { get; set; }

    [StringLength(20)]
    public string? TrangThai { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayThanhToan { get; set; }

    [StringLength(50)]
    public string? PhuongThucThanhToan { get; set; }

    [StringLength(100)]
    public string? MaGiaoDich { get; set; }

    public int MaCanBoTao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [ForeignKey("MaCanBoTao")]
    [InverseProperty("HoaDons")]
    public virtual CanBoKtx MaCanBoTaoNavigation { get; set; } = null!;

    [ForeignKey("MaHopDong")]
    [InverseProperty("HoaDons")]
    public virtual HopDong MaHopDongNavigation { get; set; } = null!;

    [ForeignKey("MaSinhVien")]
    [InverseProperty("HoaDons")]
    public virtual SinhVien MaSinhVienNavigation { get; set; } = null!;
}
