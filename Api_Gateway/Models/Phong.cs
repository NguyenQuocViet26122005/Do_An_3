using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("Phong")]
[Index("MaToaNha", Name = "IX_Phong_MaToaNha")]
[Index("MaToaNha", "SoPhong", Name = "UQ__Phong__AAEAE7AAADBF83FC", IsUnique = true)]
public partial class Phong
{
    [Key]
    public int MaPhong { get; set; }

    public int MaToaNha { get; set; }

    [StringLength(20)]
    public string SoPhong { get; set; } = null!;

    public int Tang { get; set; }

    [StringLength(50)]
    public string LoaiPhong { get; set; } = null!;

    public int SucChua { get; set; }

    public int? SoNguoiHienTai { get; set; }

    [Column(TypeName = "decimal(18, 2)")]
    public decimal GiaPhong { get; set; }

    [StringLength(20)]
    public string? TrangThai { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [InverseProperty("MaPhongNavigation")]
    public virtual ICollection<DangKyPhong> DangKyPhongs { get; set; } = new List<DangKyPhong>();

    [InverseProperty("MaPhongNavigation")]
    public virtual ICollection<Giuong> Giuongs { get; set; } = new List<Giuong>();

    [InverseProperty("MaPhongNavigation")]
    public virtual ICollection<HopDong> HopDongs { get; set; } = new List<HopDong>();

    [ForeignKey("MaToaNha")]
    [InverseProperty("Phongs")]
    public virtual ToaNha MaToaNhaNavigation { get; set; } = null!;

    [InverseProperty("MaPhongNavigation")]
    public virtual ICollection<YeuCauBaoTri> YeuCauBaoTris { get; set; } = new List<YeuCauBaoTri>();
}
