using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("ThongBao")]
public partial class ThongBao
{
    [Key]
    public int MaThongBao { get; set; }

    [StringLength(255)]
    public string TieuDe { get; set; } = null!;

    public string NoiDung { get; set; } = null!;

    [StringLength(50)]
    public string LoaiThongBao { get; set; } = null!;

    [StringLength(20)]
    public string LoaiNguoiNhan { get; set; } = null!;

    public int? MaSinhVienNhan { get; set; }

    public int? MaCanBoNhan { get; set; }

    public bool? DaDoc { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayDoc { get; set; }

    public int MaCanBoGui { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayGui { get; set; }

    [ForeignKey("MaCanBoGui")]
    [InverseProperty("ThongBaoMaCanBoGuiNavigations")]
    public virtual CanBoKtx MaCanBoGuiNavigation { get; set; } = null!;

    [ForeignKey("MaCanBoNhan")]
    [InverseProperty("ThongBaoMaCanBoNhanNavigations")]
    public virtual CanBoKtx? MaCanBoNhanNavigation { get; set; }

    [ForeignKey("MaSinhVienNhan")]
    [InverseProperty("ThongBaos")]
    public virtual SinhVien? MaSinhVienNhanNavigation { get; set; }
}
