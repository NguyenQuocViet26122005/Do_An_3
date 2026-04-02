using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class DangKyPhong
{
    public int MaDangKy { get; set; }

    public int MaSinhVien { get; set; }

    public int MaPhong { get; set; }

    public int? MaGiuong { get; set; }

    public string HocKy { get; set; } = null!;

    public DateTime? NgayDangKy { get; set; }

    public string? TrangThai { get; set; }

    public int? MaCanBoDuyet { get; set; }

    public DateTime? NgayDuyet { get; set; }

    public string? LyDoTuChoi { get; set; }

    public virtual CanBoKtx? MaCanBoDuyetNavigation { get; set; }

    public virtual Giuong? MaGiuongNavigation { get; set; }

    public virtual Phong MaPhongNavigation { get; set; } = null!;

    public virtual SinhVien MaSinhVienNavigation { get; set; } = null!;
}
