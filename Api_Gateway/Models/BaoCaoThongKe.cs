using System;
using System.Collections.Generic;

namespace Api_Gateway.Models;

public partial class BaoCaoThongKe
{
    public int MaBaoCao { get; set; }

    public string TenBaoCao { get; set; } = null!;

    public string LoaiBaoCao { get; set; } = null!;

    public string? MoTa { get; set; }

    public DateOnly? TuNgay { get; set; }

    public DateOnly? DenNgay { get; set; }

    public string? NoiDung { get; set; }

    public string? FilePath { get; set; }

    public int MaAdminTao { get; set; }

    public DateTime? NgayTao { get; set; }

    public virtual Admin MaAdminTaoNavigation { get; set; } = null!;
}
