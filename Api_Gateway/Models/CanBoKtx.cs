using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("CanBoKTX")]
[Index("MaNv", Name = "IX_CanBoKTX_MaNV")]
[Index("MaNv", Name = "UQ__CanBoKTX__2725D70BC4A178EF", IsUnique = true)]
[Index("MaNguoiDung", Name = "UQ__CanBoKTX__C539D763756E3FF1", IsUnique = true)]
public partial class CanBoKtx
{
    [Key]
    public int MaCanBo { get; set; }

    public int MaNguoiDung { get; set; }

    [Column("MaNV")]
    [StringLength(20)]
    public string MaNv { get; set; } = null!;

    [StringLength(100)]
    public string? ChucVu { get; set; }

    [StringLength(100)]
    public string? PhongBan { get; set; }

    public DateOnly? NgayVaoLam { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [InverseProperty("MaCanBoDuyetNavigation")]
    public virtual ICollection<DangKyPhong> DangKyPhongs { get; set; } = new List<DangKyPhong>();

    [InverseProperty("MaCanBoTaoNavigation")]
    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    [InverseProperty("MaCanBoTaoNavigation")]
    public virtual ICollection<HopDong> HopDongs { get; set; } = new List<HopDong>();

    [ForeignKey("MaNguoiDung")]
    [InverseProperty("CanBoKtx")]
    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    [InverseProperty("MaCanBoGuiNavigation")]
    public virtual ICollection<ThongBao> ThongBaoMaCanBoGuiNavigations { get; set; } = new List<ThongBao>();

    [InverseProperty("MaCanBoNhanNavigation")]
    public virtual ICollection<ThongBao> ThongBaoMaCanBoNhanNavigations { get; set; } = new List<ThongBao>();

    [InverseProperty("MaCanBoQuanLyNavigation")]
    public virtual ICollection<ToaNha> ToaNhas { get; set; } = new List<ToaNha>();

    [InverseProperty("MaCanBoGhiNavigation")]
    public virtual ICollection<ViPham> ViPhams { get; set; } = new List<ViPham>();

    [InverseProperty("MaCanBoXuLyNavigation")]
    public virtual ICollection<YeuCauBaoTri> YeuCauBaoTris { get; set; } = new List<YeuCauBaoTri>();
}
