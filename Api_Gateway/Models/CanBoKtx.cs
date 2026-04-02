using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class CanBoKtx
{
    public int MaCanBo { get; set; }

    public int MaNguoiDung { get; set; }

    public string MaNv { get; set; } = null!;

    public string? ChucVu { get; set; }

    public string? PhongBan { get; set; }

    public DateOnly? NgayVaoLam { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ICollection<DangKyPhong> DangKyPhongs { get; set; } = new List<DangKyPhong>();

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual ICollection<HopDong> HopDongs { get; set; } = new List<HopDong>();

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual ICollection<ThongBao> ThongBaoMaCanBoGuiNavigations { get; set; } = new List<ThongBao>();

    public virtual ICollection<ThongBao> ThongBaoMaCanBoNhanNavigations { get; set; } = new List<ThongBao>();

    public virtual ICollection<ToaNha> ToaNhas { get; set; } = new List<ToaNha>();

    public virtual ICollection<ViPham> ViPhams { get; set; } = new List<ViPham>();

    public virtual ICollection<YeuCauBaoTri> YeuCauBaoTris { get; set; } = new List<YeuCauBaoTri>();
}
