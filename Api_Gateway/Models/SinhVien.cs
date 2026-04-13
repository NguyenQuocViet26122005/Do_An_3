using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("SinhVien")]
[Index("MaSv", Name = "IX_SinhVien_MaSV")]
[Index("MaSv", Name = "UQ__SinhVien__2725081B7CA0CDCF", IsUnique = true)]
[Index("MaNguoiDung", Name = "UQ__SinhVien__C539D763BF89044E", IsUnique = true)]
public partial class SinhVien
{
    [Key]
    public int MaSinhVien { get; set; }

    public int MaNguoiDung { get; set; }

    [Column("MaSV")]
    [StringLength(20)]
    public string MaSv { get; set; } = null!;

    [StringLength(100)]
    public string? Khoa { get; set; }

    [StringLength(100)]
    public string? Nganh { get; set; }

    [StringLength(50)]
    public string? Lop { get; set; }

    public int? NamHoc { get; set; }

    [Column("DiemTB", TypeName = "decimal(3, 2)")]
    public decimal? DiemTb { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [InverseProperty("MaSinhVienNavigation")]
    public virtual ICollection<DangKyPhong> DangKyPhongs { get; set; } = new List<DangKyPhong>();

    [InverseProperty("MaSinhVienNavigation")]
    public virtual ICollection<Giuong> Giuongs { get; set; } = new List<Giuong>();

    [InverseProperty("MaSinhVienNavigation")]
    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    [InverseProperty("MaSinhVienNavigation")]
    public virtual ICollection<HopDong> HopDongs { get; set; } = new List<HopDong>();

    [ForeignKey("MaNguoiDung")]
    [InverseProperty("SinhVien")]
    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    [InverseProperty("MaSinhVienNhanNavigation")]
    public virtual ICollection<ThongBao> ThongBaos { get; set; } = new List<ThongBao>();

    [InverseProperty("MaSinhVienNavigation")]
    public virtual ICollection<ViPham> ViPhams { get; set; } = new List<ViPham>();

    [InverseProperty("MaSinhVienNavigation")]
    public virtual ICollection<YeuCauBaoTri> YeuCauBaoTris { get; set; } = new List<YeuCauBaoTri>();
}
