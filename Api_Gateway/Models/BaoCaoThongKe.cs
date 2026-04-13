using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("BaoCaoThongKe")]
[Index("LoaiBaoCao", Name = "IX_BaoCaoThongKe_LoaiBaoCao")]
[Index("MaAdminTao", Name = "IX_BaoCaoThongKe_MaAdminTao")]
public partial class BaoCaoThongKe
{
    [Key]
    public int MaBaoCao { get; set; }

    [StringLength(255)]
    public string TenBaoCao { get; set; } = null!;

    [StringLength(50)]
    public string LoaiBaoCao { get; set; } = null!;

    public string? MoTa { get; set; }

    public DateOnly? TuNgay { get; set; }

    public DateOnly? DenNgay { get; set; }

    public string? NoiDung { get; set; }

    [StringLength(255)]
    public string? FilePath { get; set; }

    public int MaAdminTao { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [ForeignKey("MaAdminTao")]
    [InverseProperty("BaoCaoThongKes")]
    public virtual Admin MaAdminTaoNavigation { get; set; } = null!;
}
