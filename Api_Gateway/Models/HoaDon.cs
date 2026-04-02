using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class HoaDon
{
    public int MaHoaDon { get; set; }

    public string SoHoaDon { get; set; } = null!;

    public int MaHopDong { get; set; }

    public int MaSinhVien { get; set; }

    public int Thang { get; set; }

    public int Nam { get; set; }

    public DateOnly? NgayPhatHanh { get; set; }

    public DateOnly HanThanhToan { get; set; }

    public decimal? TienPhong { get; set; }

    public decimal? TienDien { get; set; }

    public decimal? TienNuoc { get; set; }

    public decimal? PhiDichVu { get; set; }

    public decimal? PhiPhat { get; set; }

    public decimal TongTien { get; set; }

    public decimal? ChiSoDienCu { get; set; }

    public decimal? ChiSoDienMoi { get; set; }

    public decimal? ChiSoNuocCu { get; set; }

    public decimal? ChiSoNuocMoi { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? NgayThanhToan { get; set; }

    public string? PhuongThucThanhToan { get; set; }

    public string? MaGiaoDich { get; set; }

    public int MaCanBoTao { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual CanBoKtx MaCanBoTaoNavigation { get; set; } = null!;

    public virtual HopDong MaHopDongNavigation { get; set; } = null!;

    public virtual SinhVien MaSinhVienNavigation { get; set; } = null!;
}
