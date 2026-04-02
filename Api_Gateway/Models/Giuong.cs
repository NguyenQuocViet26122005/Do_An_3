using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class Giuong
{
    public int MaGiuong { get; set; }

    public int MaPhong { get; set; }

    public int SoGiuong { get; set; }

    public string? TrangThai { get; set; }

    public int? MaSinhVien { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ICollection<DangKyPhong> DangKyPhongs { get; set; } = new List<DangKyPhong>();

    public virtual ICollection<HopDong> HopDongs { get; set; } = new List<HopDong>();

    public virtual Phong MaPhongNavigation { get; set; } = null!;

    public virtual SinhVien? MaSinhVienNavigation { get; set; }
}
