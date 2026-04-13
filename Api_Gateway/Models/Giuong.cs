using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("Giuong")]
[Index("MaPhong", Name = "IX_Giuong_MaPhong")]
[Index("MaPhong", "SoGiuong", Name = "UQ__Giuong__1FB89A3D9C95805F", IsUnique = true)]
public partial class Giuong
{
    [Key]
    public int MaGiuong { get; set; }

    public int MaPhong { get; set; }

    public int SoGiuong { get; set; }

    [StringLength(20)]
    public string? TrangThai { get; set; }

    public int? MaSinhVien { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [InverseProperty("MaGiuongNavigation")]
    public virtual ICollection<DangKyPhong> DangKyPhongs { get; set; } = new List<DangKyPhong>();

    [InverseProperty("MaGiuongNavigation")]
    public virtual ICollection<HopDong> HopDongs { get; set; } = new List<HopDong>();

    [ForeignKey("MaPhong")]
    [InverseProperty("Giuongs")]
    public virtual Phong MaPhongNavigation { get; set; } = null!;

    [ForeignKey("MaSinhVien")]
    [InverseProperty("Giuongs")]
    public virtual SinhVien? MaSinhVienNavigation { get; set; }
}
