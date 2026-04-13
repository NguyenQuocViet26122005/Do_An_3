using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("YeuCauBaoTri")]
public partial class YeuCauBaoTri
{
    [Key]
    public int MaYeuCau { get; set; }

    public int MaPhong { get; set; }

    public int MaSinhVien { get; set; }

    [StringLength(255)]
    public string TieuDe { get; set; } = null!;

    public string MoTa { get; set; } = null!;

    [StringLength(50)]
    public string LoaiYeuCau { get; set; } = null!;

    [StringLength(20)]
    public string? TrangThai { get; set; }

    public int? MaCanBoXuLy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayXuLy { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? ChiPhi { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [ForeignKey("MaCanBoXuLy")]
    [InverseProperty("YeuCauBaoTris")]
    public virtual CanBoKtx? MaCanBoXuLyNavigation { get; set; }

    [ForeignKey("MaPhong")]
    [InverseProperty("YeuCauBaoTris")]
    public virtual Phong MaPhongNavigation { get; set; } = null!;

    [ForeignKey("MaSinhVien")]
    [InverseProperty("YeuCauBaoTris")]
    public virtual SinhVien MaSinhVienNavigation { get; set; } = null!;
}
