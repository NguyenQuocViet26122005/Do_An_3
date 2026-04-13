using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore.Storage;

namespace Api_Gateway.DAL
{
    public class UnitOfWork : IUnitOfWork
    {
        private readonly QuanLyKTXContext _context;
        private IDbContextTransaction? _transaction;

        private IRepository<TaiKhoan>? _taiKhoans;
        private IRepository<NguoiDung>? _nguoiDungs;
        private IRepository<Admin>? _admins;
        private IRepository<CanBoKtx>? _canBoKtxes;
        private IRepository<SinhVien>? _sinhViens;
        private IRepository<ToaNha>? _toaNhas;
        private IRepository<Phong>? _phongs;
        private IRepository<Giuong>? _giuongs;
        private IRepository<DangKyPhong>? _dangKyPhongs;
        private IRepository<HopDong>? _hopDongs;
        private IRepository<HoaDon>? _hoaDons;
        private IRepository<ViPham>? _viPhams;
        private IRepository<ThongBao>? _thongBaos;
        private IRepository<YeuCauBaoTri>? _yeuCauBaoTris;
        private IRepository<BaoCaoThongKe>? _baoCaoThongKes;

        public UnitOfWork(QuanLyKTXContext context)
        {
            _context = context;
        }

        public IRepository<TaiKhoan> TaiKhoans => _taiKhoans ??= new Repository<TaiKhoan>(_context);
        public IRepository<NguoiDung> NguoiDungs => _nguoiDungs ??= new Repository<NguoiDung>(_context);
        public IRepository<Admin> Admins => _admins ??= new Repository<Admin>(_context);
        public IRepository<CanBoKtx> CanBoKtxes => _canBoKtxes ??= new Repository<CanBoKtx>(_context);
        public IRepository<SinhVien> SinhViens => _sinhViens ??= new Repository<SinhVien>(_context);
        public IRepository<ToaNha> ToaNhas => _toaNhas ??= new Repository<ToaNha>(_context);
        public IRepository<Phong> Phongs => _phongs ??= new Repository<Phong>(_context);
        public IRepository<Giuong> Giuongs => _giuongs ??= new Repository<Giuong>(_context);
        public IRepository<DangKyPhong> DangKyPhongs => _dangKyPhongs ??= new Repository<DangKyPhong>(_context);
        public IRepository<HopDong> HopDongs => _hopDongs ??= new Repository<HopDong>(_context);
        public IRepository<HoaDon> HoaDons => _hoaDons ??= new Repository<HoaDon>(_context);
        public IRepository<ViPham> ViPhams => _viPhams ??= new Repository<ViPham>(_context);
        public IRepository<ThongBao> ThongBaos => _thongBaos ??= new Repository<ThongBao>(_context);
        public IRepository<YeuCauBaoTri> YeuCauBaoTris => _yeuCauBaoTris ??= new Repository<YeuCauBaoTri>(_context);
        public IRepository<BaoCaoThongKe> BaoCaoThongKes => _baoCaoThongKes ??= new Repository<BaoCaoThongKe>(_context);

        public async Task<int> SaveChangesAsync()
        {
            return await _context.SaveChangesAsync();
        }

        public async Task BeginTransactionAsync()
        {
            _transaction = await _context.Database.BeginTransactionAsync();
        }

        public async Task CommitAsync()
        {
            try
            {
                await _context.SaveChangesAsync();
                if (_transaction != null)
                {
                    await _transaction.CommitAsync();
                }
            }
            catch
            {
                await RollbackAsync();
                throw;
            }
            finally
            {
                if (_transaction != null)
                {
                    await _transaction.DisposeAsync();
                    _transaction = null;
                }
            }
        }

        public async Task RollbackAsync()
        {
            if (_transaction != null)
            {
                await _transaction.RollbackAsync();
                await _transaction.DisposeAsync();
                _transaction = null;
            }
        }

        public void Dispose()
        {
            _transaction?.Dispose();
            _context.Dispose();
        }
    }
}
