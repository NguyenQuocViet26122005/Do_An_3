using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("ViPham")]
[Index("MaSinhVien", Name = "IX_ViPham_MaSinhVien")]
public partial class ViPham
{
    [Key]
    public int MaViPham { get; set; }

    public int MaSinhVien { get; set; }

    [StringLength(100)]
    public string TenViPham { get; set; } = null!;

    [StringLength(20)]
    public string MucDo { get; set; } = null!;

    public string? MoTa { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal? MucPhat { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayViPham { get; set; }

    [StringLength(20)]
    public string? TrangThai { get; set; }

    public int MaCanBoGhi { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayGhi { get; set; }

    [ForeignKey("MaCanBoGhi")]
    [InverseProperty("ViPhams")]
    public virtual CanBoKtx MaCanBoGhiNavigation { get; set; } = null!;

    [ForeignKey("MaSinhVien")]
    [InverseProperty("ViPhams")]
    public virtual SinhVien MaSinhVienNavigation { get; set; } = null!;
}
