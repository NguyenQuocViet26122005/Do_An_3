using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("DangKyPhong")]
[Index("MaSinhVien", Name = "IX_DangKyPhong_MaSinhVien")]
public partial class DangKyPhong
{
    [Key]
    public int MaDangKy { get; set; }

    public int MaSinhVien { get; set; }

    public int MaPhong { get; set; }

    public int? MaGiuong { get; set; }

    [StringLength(20)]
    public string HocKy { get; set; } = null!;

    [Column(TypeName = "datetime")]
    public DateTime? NgayDangKy { get; set; }

    [StringLength(20)]
    public string? TrangThai { get; set; }

    public int? MaCanBoDuyet { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayDuyet { get; set; }

    [StringLength(255)]
    public string? LyDoTuChoi { get; set; }

    [ForeignKey("MaCanBoDuyet")]
    [InverseProperty("DangKyPhongs")]
    public virtual CanBoKtx? MaCanBoDuyetNavigation { get; set; }

    [ForeignKey("MaGiuong")]
    [InverseProperty("DangKyPhongs")]
    public virtual Giuong? MaGiuongNavigation { get; set; }

    [ForeignKey("MaPhong")]
    [InverseProperty("DangKyPhongs")]
    public virtual Phong MaPhongNavigation { get; set; } = null!;

    [ForeignKey("MaSinhVien")]
    [InverseProperty("DangKyPhongs")]
    public virtual SinhVien MaSinhVienNavigation { get; set; } = null!;
}
