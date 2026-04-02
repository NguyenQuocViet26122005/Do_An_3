using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class NguoiDung
{
    public int MaNguoiDung { get; set; }

    public int MaTaiKhoan { get; set; }

    public string HoTen { get; set; } = null!;

    public string GioiTinh { get; set; } = null!;

    public DateOnly NgaySinh { get; set; }

    public string SoDienThoai { get; set; } = null!;

    public string Email { get; set; } = null!;

    public string Cccd { get; set; } = null!;

    public string? DiaChi { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual Admin? Admin { get; set; }

    public virtual CanBoKtx? CanBoKtx { get; set; }

    public virtual TaiKhoan MaTaiKhoanNavigation { get; set; } = null!;

    public virtual SinhVien? SinhVien { get; set; }
}
