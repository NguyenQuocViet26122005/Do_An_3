using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class ViPham
{
    public int MaViPham { get; set; }

    public int MaSinhVien { get; set; }

    public string TenViPham { get; set; } = null!;

    public string MucDo { get; set; } = null!;

    public string? MoTa { get; set; }

    public decimal? MucPhat { get; set; }

    public DateTime? NgayViPham { get; set; }

    public string? TrangThai { get; set; }

    public int MaCanBoGhi { get; set; }

    public DateTime? NgayGhi { get; set; }

    public virtual CanBoKtx MaCanBoGhiNavigation { get; set; } = null!;

    public virtual SinhVien MaSinhVienNavigation { get; set; } = null!;
}
