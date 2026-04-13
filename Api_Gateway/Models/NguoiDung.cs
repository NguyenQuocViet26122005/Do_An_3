using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

[Table("NguoiDung")]
[Index("Email", Name = "IX_NguoiDung_Email")]
[Index("Cccd", Name = "UQ__NguoiDun__A955A0AA53440EDB", IsUnique = true)]
[Index("Email", Name = "UQ__NguoiDun__A9D10534DEC07B0D", IsUnique = true)]
[Index("MaTaiKhoan", Name = "UQ__NguoiDun__AD7C6528855CCAD4", IsUnique = true)]
public partial class NguoiDung
{
    [Key]
    public int MaNguoiDung { get; set; }

    public int MaTaiKhoan { get; set; }

    [StringLength(100)]
    public string HoTen { get; set; } = null!;

    [StringLength(10)]
    public string GioiTinh { get; set; } = null!;

    public DateOnly NgaySinh { get; set; }

    [StringLength(20)]
    public string SoDienThoai { get; set; } = null!;

    [StringLength(100)]
    public string Email { get; set; } = null!;

    [Column("CCCD")]
    [StringLength(20)]
    public string Cccd { get; set; } = null!;

    [StringLength(255)]
    public string? DiaChi { get; set; }

    [Column(TypeName = "datetime")]
    public DateTime? NgayTao { get; set; }

    [InverseProperty("MaNguoiDungNavigation")]
    public virtual Admin? Admin { get; set; }

    [InverseProperty("MaNguoiDungNavigation")]
    public virtual CanBoKtx? CanBoKtx { get; set; }

    [ForeignKey("MaTaiKhoan")]
    [InverseProperty("NguoiDung")]
    public virtual TaiKhoan MaTaiKhoanNavigation { get; set; } = null!;

    [InverseProperty("MaNguoiDungNavigation")]
    public virtual SinhVien? SinhVien { get; set; }
}
