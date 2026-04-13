using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("TaiKhoan")]
[Index("TenDangNhap", Name = "IX_TaiKhoan_TenDangNhap")]
[Index("TenDangNhap", Name = "UQ__TaiKhoan__55F68FC023439B25", IsUnique = true)]
public partial class TaiKhoan
{
    [Key]
    public int MaTaiKhoan { get; set; }

    [StringLength(50)]
    public string TenDangNhap { get; set; } = null!;

    [StringLength(255)]
    public string MatKhau { get; set; } = null!;

    [StringLength(20)]
    public string VaiTro { get; set; } = null!;

    public bool? TrangThai { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [InverseProperty("MaTaiKhoanNavigation")]
    public virtual NguoiDung? NguoiDung { get; set; }
}
