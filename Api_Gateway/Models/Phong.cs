using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class Phong
{
    public int MaPhong { get; set; }

    public int MaToaNha { get; set; }

    public string SoPhong { get; set; } = null!;

    public int Tang { get; set; }

    public string LoaiPhong { get; set; } = null!;

    public int SucChua { get; set; }

    public int? SoNguoiHienTai { get; set; }

    public decimal GiaPhong { get; set; }

    public string? TrangThai { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ICollection<DangKyPhong> DangKyPhongs { get; set; } = new List<DangKyPhong>();

    public virtual ICollection<Giuong> Giuongs { get; set; } = new List<Giuong>();

    public virtual ICollection<HopDong> HopDongs { get; set; } = new List<HopDong>();

    public virtual ToaNha MaToaNhaNavigation { get; set; } = null!;

    public virtual ICollection<YeuCauBaoTri> YeuCauBaoTris { get; set; } = new List<YeuCauBaoTri>();
}
