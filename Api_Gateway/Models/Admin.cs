using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class Admin
{
    public int MaAdmin { get; set; }

    public int MaNguoiDung { get; set; }

    public string MaNv { get; set; } = null!;

    public string? ChucVu { get; set; }

    public string? PhongBan { get; set; }

    public DateOnly? NgayVaoLam { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual ICollection<BaoCaoThongKe> BaoCaoThongKes { get; set; } = new List<BaoCaoThongKe>();

    public virtual NguoiDung MaNguoiDungNavigation { get; set; } = null!;
}
