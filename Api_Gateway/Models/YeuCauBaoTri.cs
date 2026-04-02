using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class YeuCauBaoTri
{
    public int MaYeuCau { get; set; }

    public int MaPhong { get; set; }

    public int MaSinhVien { get; set; }

    public string TieuDe { get; set; } = null!;

    public string MoTa { get; set; } = null!;

    public string LoaiYeuCau { get; set; } = null!;

    public string? TrangThai { get; set; }

    public int? MaCanBoXuLy { get; set; }

    public DateTime? NgayXuLy { get; set; }

    public decimal? ChiPhi { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual CanBoKtx? MaCanBoXuLyNavigation { get; set; }

    public virtual Phong MaPhongNavigation { get; set; } = null!;

    public virtual SinhVien MaSinhVienNavigation { get; set; } = null!;
}
