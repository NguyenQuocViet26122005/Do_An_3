using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("HopDong")]
[Index("MaSinhVien", Name = "IX_HopDong_MaSinhVien")]
[Index("SoHopDong", Name = "UQ__HopDong__71C5D5BB175120E7", IsUnique = true)]
public partial class HopDong
{
    [Key]
    public int MaHopDong { get; set; }

    [StringLength(50)]
    public string SoHopDong { get; set; } = null!;

    public int MaSinhVien { get; set; }

    public int MaPhong { get; set; }

    public int MaGiuong { get; set; }

    [StringLength(20)]
    public string HocKy { get; set; } = null!;

    public DateOnly NgayBatDau { get; set; }

    public DateOnly NgayKetThuc { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal GiaThue { get; set; }

    [StringLength(20)]
    public string? TrangThai { get; set; }

    public int MaCanBoTao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [InverseProperty("MaHopDongNavigation")]
    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    [ForeignKey("MaCanBoTao")]
    [InverseProperty("HopDongs")]
    public virtual CanBoKtx MaCanBoTaoNavigation { get; set; } = null!;

    [ForeignKey("MaGiuong")]
    [InverseProperty("HopDongs")]
    public virtual Giuong MaGiuongNavigation { get; set; } = null!;

    [ForeignKey("MaPhong")]
    [InverseProperty("HopDongs")]
    public virtual Phong MaPhongNavigation { get; set; } = null!;

    [ForeignKey("MaSinhVien")]
    [InverseProperty("HopDongs")]
    public virtual SinhVien MaSinhVienNavigation { get; set; } = null!;
}
