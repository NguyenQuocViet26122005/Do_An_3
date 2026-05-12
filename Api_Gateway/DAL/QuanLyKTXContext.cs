using System;
using System.Collections.Generic;
using Api_Gateway.Models;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.DAL;

public partial class QuanLyKTXContext : DbContext
{
    public QuanLyKTXContext()
    {
    }

    public QuanLyKTXContext(DbContextOptions<QuanLyKTXContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Admin> Admins { get; set; }

    public virtual DbSet<BaoCaoThongKe> BaoCaoThongKes { get; set; }

    public virtual DbSet<CanBoKtx> CanBoKtxes { get; set; }

    public virtual DbSet<DangKyPhong> DangKyPhongs { get; set; }

    public virtual DbSet<Giuong> Giuongs { get; set; }

    public virtual DbSet<HoaDon> HoaDons { get; set; }

    public virtual DbSet<HopDong> HopDongs { get; set; }

    public virtual DbSet<NguoiDung> NguoiDungs { get; set; }

    public virtual DbSet<Phong> Phongs { get; set; }

    public virtual DbSet<SinhVien> SinhViens { get; set; }

    public virtual DbSet<TaiKhoan> TaiKhoans { get; set; }

    public virtual DbSet<ThongBao> ThongBaos { get; set; }

    public virtual DbSet<ToaNha> ToaNhas { get; set; }

    public virtual DbSet<ViPham> ViPhams { get; set; }

    public virtual DbSet<YeuCauBaoTri> YeuCauBaoTris { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        // Configuration will be provided by DI in Program.cs
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.MaAdmin).HasName("PK__Admin__49341E38B4969688");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.Admin)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Admin__MaNguoiDu__45F365D3");
        });

        modelBuilder.Entity<BaoCaoThongKe>(entity =>
        {
            entity.HasKey(e => e.MaBaoCao).HasName("PK__BaoCaoTh__25A9188CE1EBEDDA");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaAdminTaoNavigation).WithMany(p => p.BaoCaoThongKes)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BaoCaoTho__MaAdm__1AD3FDA4");
        });

        modelBuilder.Entity<CanBoKtx>(entity =>
        {
            entity.HasKey(e => e.MaCanBo).HasName("PK__CanBoKTX__4003E215BC96DC5F");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.CanBoKtx)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CanBoKTX__MaNguo__4BAC3F29");
        });

        modelBuilder.Entity<DangKyPhong>(entity =>
        {
            entity.HasKey(e => e.MaDangKy).HasName("PK__DangKyPh__BA90F02D244CF7A1");

            entity.Property(e => e.NgayDangKy).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TrangThai).HasDefaultValue("ChuaXuLy");

            entity.HasOne(d => d.MaCanBoDuyetNavigation).WithMany(p => p.DangKyPhongs).HasConstraintName("FK__DangKyPho__MaCan__6C190EBB");

            entity.HasOne(d => d.MaGiuongNavigation).WithMany(p => p.DangKyPhongs).HasConstraintName("FK__DangKyPho__MaGiu__6B24EA82");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.DangKyPhongs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DangKyPho__MaPho__6A30C649");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.DangKyPhongs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DangKyPho__MaSin__693CA210");
        });

        modelBuilder.Entity<Giuong>(entity =>
        {
            entity.HasKey(e => e.MaGiuong).HasName("PK__Giuong__9C9FF4DC67DD2B2D");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TrangThai).HasDefaultValue("ConTrong");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.Giuongs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Giuong__MaPhong__6383C8BA");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.Giuongs).HasConstraintName("FK__Giuong__MaSinhVi__6477ECF3");
        });

        modelBuilder.Entity<HoaDon>(entity =>
        {
            entity.HasKey(e => e.MaHoaDon).HasName("PK__HoaDon__835ED13B70622C8B");

            entity.Property(e => e.NgayPhatHanh).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.PhiDichVu).HasDefaultValue(0m);
            entity.Property(e => e.PhiPhat).HasDefaultValue(0m);
            entity.Property(e => e.TienDien).HasDefaultValue(0m);
            entity.Property(e => e.TienNuoc).HasDefaultValue(0m);
            entity.Property(e => e.TienPhong).HasDefaultValue(0m);
            entity.Property(e => e.TrangThai).HasDefaultValue("ChuaThanhToan");

            entity.HasOne(d => d.MaCanBoTaoNavigation).WithMany(p => p.HoaDons)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HoaDon__MaCanBoT__02084FDA");

            entity.HasOne(d => d.MaHopDongNavigation).WithMany(p => p.HoaDons)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HoaDon__MaHopDon__00200768");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.HoaDons)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HoaDon__MaSinhVi__01142BA1");
        });

        modelBuilder.Entity<HopDong>(entity =>
        {
            entity.HasKey(e => e.MaHopDong).HasName("PK__HopDong__36DD4342810A365E");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TrangThai).HasDefaultValue("HieuLuc");

            entity.HasOne(d => d.MaCanBoTaoNavigation).WithMany(p => p.HopDongs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDong__MaCanBo__74AE54BC");

            entity.HasOne(d => d.MaGiuongNavigation).WithMany(p => p.HopDongs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDong__MaGiuon__73BA3083");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.HopDongs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDong__MaPhong__72C60C4A");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.HopDongs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDong__MaSinhV__71D1E811");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung).HasName("PK__NguoiDun__C539D762AF53178C");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaTaiKhoanNavigation).WithOne(p => p.NguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NguoiDung__MaTai__403A8C7D");
        });

        modelBuilder.Entity<Phong>(entity =>
        {
            entity.HasKey(e => e.MaPhong).HasName("PK__Phong__20BD5E5BCCA32168");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.SoNguoiHienTai).HasDefaultValue(0);
            entity.Property(e => e.TrangThai).HasDefaultValue("ConTrong");

            entity.HasOne(d => d.MaToaNhaNavigation).WithMany(p => p.Phongs)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Phong__MaToaNha__5DCAEF64");
        });

        modelBuilder.Entity<SinhVien>(entity =>
        {
            entity.HasKey(e => e.MaSinhVien).HasName("PK__SinhVien__939AE7755D364360");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.SinhVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SinhVien__MaNguo__5165187F");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.MaTaiKhoan).HasName("PK__TaiKhoan__AD7C65295FFBE357");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TrangThai).HasDefaultValue(true);
        });

        modelBuilder.Entity<ThongBao>(entity =>
        {
            entity.HasKey(e => e.MaThongBao).HasName("PK__ThongBao__04DEB54E177D8538");

            entity.Property(e => e.DaDoc).HasDefaultValue(false);
            entity.Property(e => e.NgayGui).HasDefaultValueSql("(getdate())");

            entity.HasOne(d => d.MaCanBoGuiNavigation).WithMany(p => p.ThongBaoMaCanBoGuiNavigations)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ThongBao__MaCanB__10566F31");

            entity.HasOne(d => d.MaCanBoNhanNavigation).WithMany(p => p.ThongBaoMaCanBoNhanNavigations).HasConstraintName("FK__ThongBao__MaCanB__0F624AF8");

            entity.HasOne(d => d.MaSinhVienNhanNavigation).WithMany(p => p.ThongBaos).HasConstraintName("FK__ThongBao__MaSinh__0E6E26BF");
        });

        modelBuilder.Entity<ToaNha>(entity =>
        {
            entity.HasKey(e => e.MaToaNha).HasName("PK__ToaNha__BD2DD1619A64A82E");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TrangThai).HasDefaultValue("HoatDong");

            entity.HasOne(d => d.MaCanBoQuanLyNavigation).WithMany(p => p.ToaNhas).HasConstraintName("FK__ToaNha__MaCanBoQ__571DF1D5");
        });

        modelBuilder.Entity<ViPham>(entity =>
        {
            entity.HasKey(e => e.MaViPham).HasName("PK__ViPham__F1921D89D7D6B842");

            entity.Property(e => e.MucPhat).HasDefaultValue(0m);
            entity.Property(e => e.NgayGhi).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.NgayViPham).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TrangThai).HasDefaultValue("ChuaXuLy");

            entity.HasOne(d => d.MaCanBoGhiNavigation).WithMany(p => p.ViPhams)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ViPham__MaCanBoG__09A971A2");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.ViPhams)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ViPham__MaSinhVi__08B54D69");
        });

        modelBuilder.Entity<YeuCauBaoTri>(entity =>
        {
            entity.HasKey(e => e.MaYeuCau).HasName("PK__YeuCauBa__CFA5DF4E197D47EB");

            entity.Property(e => e.NgayTao).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.TrangThai).HasDefaultValue("ChuaXuLy");

            entity.HasOne(d => d.MaCanBoXuLyNavigation).WithMany(p => p.YeuCauBaoTris).HasConstraintName("FK__YeuCauBao__MaCan__17036CC0");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.YeuCauBaoTris)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauBao__MaPho__151B244E");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.YeuCauBaoTris)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauBao__MaSin__160F4887");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
