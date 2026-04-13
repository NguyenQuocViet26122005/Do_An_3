using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("ToaNha")]
[Index("MaToa", Name = "UQ__ToaNha__314934452DDD1C25", IsUnique = true)]
public partial class ToaNha
{
    [Key]
    public int MaToaNha { get; set; }

    [StringLength(10)]
    public string MaToa { get; set; } = null!;

    [StringLength(100)]
    public string TenToaNha { get; set; } = null!;

    [StringLength(20)]
    public string LoaiToaNha { get; set; } = null!;

    public int SoTang { get; set; }

    [StringLength(20)]
    public string? TrangThai { get; set; }

    public int? MaCanBoQuanLy { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [ForeignKey("MaCanBoQuanLy")]
    [InverseProperty("ToaNhas")]
    public virtual CanBoKtx? MaCanBoQuanLyNavigation { get; set; }

    [InverseProperty("MaToaNhaNavigation")]
    public virtual ICollection<Phong> Phongs { get; set; } = new List<Phong>();
}
