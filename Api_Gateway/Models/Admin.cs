using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("Admin")]
[Index("MaNv", Name = "IX_Admin_MaNV")]
[Index("MaNv", Name = "UQ__Admin__2725D70BA6E824A8", IsUnique = true)]
[Index("MaNguoiDung", Name = "UQ__Admin__C539D763A624E431", IsUnique = true)]
public partial class Admin
{
    [Key]
    public int MaAdmin { get; set; }

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

    [InverseProperty("MaAdminTaoNavigation")]
    public virtual ICollection<BaoCaoThongKe> BaoCaoThongKes { get; set; } = new List<BaoCaoThongKe>();

    [ForeignKey("MaNguoiDung")]
    [InverseProperty("Admin")]
    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
