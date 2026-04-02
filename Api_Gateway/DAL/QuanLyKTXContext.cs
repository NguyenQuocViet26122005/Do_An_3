using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.DAL
{
    public class QuanLyKTXContext : DbContext
    {
        public QuanLyKTXContext(DbContextOptions<QuanLyKTXContext> options) : base(options)
        {
        }

        // DbSets
        public DbSet<TaiKhoan> TaiKhoan { get; set; }
        public DbSet<NguoiDung> NguoiDung { get; set; }
        public DbSet<Admin> Admin { get; set; }
        public DbSet<CanBoKTX> CanBoKTX { get; set; }
        public DbSet<SinhVien> SinhVien { get; set; }
        public DbSet<ToaNha> ToaNha { get; set; }
        public DbSet<Phong> Phong { get; set; }
        public DbSet<Giuong> Giuong { get; set; }
        public DbSet<DangKyPhong> DangKyPhong { get; set; }
        public DbSet<HopDong> HopDong { get; set; }
        public DbSet<HoaDon> HoaDon { get; set; }
        public DbSet<ViPham> ViPham { get; set; }
        public DbSet<ThongBao> ThongBao { get; set; }
        public DbSet<YeuCauBaoTri> YeuCauBaoTri { get; set; }
        public DbSet<BaoCaoThongKe> BaoCaoThongKe { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // TaiKhoan
            modelBuilder.Entity<TaiKhoan>()
                .HasIndex(t => t.TenDangNhap)
                .IsUnique();

            // NguoiDung
            modelBuilder.Entity<NguoiDung>()
                .HasIndex(n => n.Email)
                .IsUnique();

            modelBuilder.Entity<NguoiDung>()
                .HasIndex(n => n.CCCD)
                .IsUnique();

            modelBuilder.Entity<NguoiDung>()
                .HasIndex(n => n.MaTaiKhoan)
                .IsUnique();

            // Admin
            modelBuilder.Entity<Admin>()
                .HasIndex(a => a.MaNV)
                .IsUnique();

            modelBuilder.Entity<Admin>()
                .HasIndex(a => a.MaNguoiDung)
                .IsUnique();

            // CanBoKTX
            modelBuilder.Entity<CanBoKTX>()
                .HasIndex(c => c.MaNV)
                .IsUnique();

            modelBuilder.Entity<CanBoKTX>()
                .HasIndex(c => c.MaNguoiDung)
                .IsUnique();

            // SinhVien
            modelBuilder.Entity<SinhVien>()
                .HasIndex(s => s.MaSV)
                .IsUnique();

            modelBuilder.Entity<SinhVien>()
                .HasIndex(s => s.MaNguoiDung)
                .IsUnique();

            // ToaNha
            modelBuilder.Entity<ToaNha>()
                .HasIndex(t => t.MaToa)
                .IsUnique();

            // Phong
            modelBuilder.Entity<Phong>()
                .HasIndex(p => new { p.MaToaNha, p.SoPhong })
                .IsUnique();

            // Giuong
            modelBuilder.Entity<Giuong>()
                .HasIndex(g => new { g.MaPhong, g.SoGiuong })
                .IsUnique();

            // HopDong
            modelBuilder.Entity<HopDong>()
                .HasIndex(h => h.SoHopDong)
                .IsUnique();

            // HoaDon
            modelBuilder.Entity<HoaDon>()
                .HasIndex(h => h.SoHoaDon)
                .IsUnique();

            // Configure relationships with multiple foreign keys
            modelBuilder.Entity<ThongBao>()
                .HasOne(t => t.CanBoGui)
                .WithMany(c => c.ThongBaoGui)
                .HasForeignKey(t => t.MaCanBoGui)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ThongBao>()
                .HasOne(t => t.CanBoNhan)
                .WithMany(c => c.ThongBaoNhan)
                .HasForeignKey(t => t.MaCanBoNhan)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<ThongBao>()
                .HasOne(t => t.SinhVienNhan)
                .WithMany(s => s.ThongBao)
                .HasForeignKey(t => t.MaSinhVienNhan)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure DangKyPhong relationships
            modelBuilder.Entity<DangKyPhong>()
                .HasOne(d => d.CanBoDuyet)
                .WithMany(c => c.DangKyDuyet)
                .HasForeignKey(d => d.MaCanBoDuyet)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure HopDong relationships
            modelBuilder.Entity<HopDong>()
                .HasOne(h => h.CanBoTao)
                .WithMany(c => c.HopDongTao)
                .HasForeignKey(h => h.MaCanBoTao)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure HoaDon relationships
            modelBuilder.Entity<HoaDon>()
                .HasOne(h => h.CanBoTao)
                .WithMany(c => c.HoaDonTao)
                .HasForeignKey(h => h.MaCanBoTao)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure ViPham relationships
            modelBuilder.Entity<ViPham>()
                .HasOne(v => v.CanBoGhi)
                .WithMany(c => c.ViPhamGhi)
                .HasForeignKey(v => v.MaCanBoGhi)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure YeuCauBaoTri relationships
            modelBuilder.Entity<YeuCauBaoTri>()
                .HasOne(y => y.CanBoXuLy)
                .WithMany(c => c.YeuCauXuLy)
                .HasForeignKey(y => y.MaCanBoXuLy)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
