using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class ToaNha
{
    public int MaToaNha { get; set; }

    public string MaToa { get; set; } = null!;

    public string TenToaNha { get; set; } = null!;

    public string LoaiToaNha { get; set; } = null!;

    public int SoTang { get; set; }

    public string? TrangThai { get; set; }

    public int? MaCanBoQuanLy { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual CanBoKtx? MaCanBoQuanLyNavigation { get; set; }

    public virtual ICollection<Phong> Phongs { get; set; } = new List<Phong>();
}
