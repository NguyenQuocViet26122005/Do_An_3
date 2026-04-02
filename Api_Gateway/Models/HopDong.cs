using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class HopDong
{
    public int MaHopDong { get; set; }

    public string SoHopDong { get; set; } = null!;

    public int MaSinhVien { get; set; }

    public int MaPhong { get; set; }

    public int MaGiuong { get; set; }

    public string HocKy { get; set; } = null!;

    public DateOnly NgayBatDau { get; set; }

    public DateOnly NgayKetThuc { get; set; }

    public decimal GiaThue { get; set; }

    public string? TrangThai { get; set; }

    public int MaCanBoTao { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual CanBoKtx MaCanBoTaoNavigation { get; set; } = null!;

    public virtual Giuong MaGiuongNavigation { get; set; } = null!;

    public virtual Phong MaPhongNavigation { get; set; } = null!;

    public virtual SinhVien MaSinhVienNavigation { get; set; } = null!;
}
