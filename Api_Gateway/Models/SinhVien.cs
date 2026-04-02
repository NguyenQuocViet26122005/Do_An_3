using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class SinhVien
{
    public int MaSinhVien { get; set; }

    public int MaNguoiDung { get; set; }

    public string MaSv { get; set; } = null!;

    public string? Khoa { get; set; }

    public string? Nganh { get; set; }

    public string? Lop { get; set; }

    public int? NamHoc { get; set; }

    public decimal? DiemTb { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ICollection<DangKyPhong> DangKyPhongs { get; set; } = new List<DangKyPhong>();

    public virtual ICollection<Giuong> Giuongs { get; set; } = new List<Giuong>();

    public virtual ICollection<HoaDon> HoaDons { get; set; } = new List<HoaDon>();

    public virtual ICollection<HopDong> HopDongs { get; set; } = new List<HopDong>();

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;

    public virtual ICollection<ThongBao> ThongBaos { get; set; } = new List<ThongBao>();

    public virtual ICollection<ViPham> ViPhams { get; set; } = new List<ViPham>();

    public virtual ICollection<YeuCauBaoTri> YeuCauBaoTris { get; set; } = new List<YeuCauBaoTri>();
}
