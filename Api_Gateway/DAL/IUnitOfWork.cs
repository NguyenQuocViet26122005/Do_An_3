using Api_Gateway.Models;

namespace Api_Gateway.DAL
{
    public interface IUnitOfWork : IDisposable
    {
        IRepository<TaiKhoan> TaiKhoans { get; }
        IRepository<NguoiDung> NguoiDungs { get; }
        IRepository<Admin> Admins { get; }
        IRepository<CanBoKtx> CanBoKtxes { get; }
        IRepository<SinhVien> SinhViens { get; }
        IRepository<ToaNha> ToaNhas { get; }
        IRepository<Phong> Phongs { get; }
        IRepository<Giuong> Giuongs { get; }
        IRepository<DangKyPhong> DangKyPhongs { get; }
        IRepository<HopDong> HopDongs { get; }
        IRepository<HoaDon> HoaDons { get; }
        IRepository<ViPham> ViPhams { get; }
        IRepository<ThongBao> ThongBaos { get; }
        IRepository<YeuCauBaoTri> YeuCauBaoTris { get; }
        IRepository<BaoCaoThongKe> BaoCaoThongKes { get; }

        Task<int> SaveChangesAsync();
        Task BeginTransactionAsync();
        Task CommitAsync();
        Task RollbackAsync();
    }
}
