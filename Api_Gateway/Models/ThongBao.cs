using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class ThongBao
{
    public int MaThongBao { get; set; }

    public string TieuDe { get; set; } = null!;

    public string NoiDung { get; set; } = null!;

    public string LoaiThongBao { get; set; } = null!;

    public string LoaiNguoiNhan { get; set; } = null!;

    public int? MaSinhVienNhan { get; set; }

    public int? MaCanBoNhan { get; set; }

    public bool? DaDoc { get; set; }

    public DateTime? NgayDoc { get; set; }

    public int MaCanBoGui { get; set; }

    public DateTime? NgayGui { get; set; }

    public virtual CanBoKtx MaCanBoGuiNavigation { get; set; } = null!;

    public virtual CanBoKtx? MaCanBoNhanNavigation { get; set; }

    public virtual SinhVien? MaSinhVienNhanNavigation { get; set; }
}
