using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.Models;

public partial class QuanLyKtxContext : DbContext
{
    public QuanLyKtxContext()
    {
    }

    public QuanLyKtxContext(DbContextOptions<QuanLyKtxContext> options)
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
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see https://go.microsoft.com/fwlink/?LinkId=723263.
        => optionsBuilder.UseSqlServer("Server=DESKTOP-D4ADKL6\\MAY1;Database=QuanLyKTX;Trusted_Connection=True;TrustServerCertificate=True;");

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Admin>(entity =>
        {
            entity.HasKey(e => e.MaAdmin).HasName("PK__Admin__49341E38B4969688");

            entity.ToTable("Admin");

            entity.HasIndex(e => e.MaNv, "IX_Admin_MaNV");

            entity.HasIndex(e => e.MaNv, "UQ__Admin__2725D70BA6E824A8").IsUnique();

            entity.HasIndex(e => e.MaNguoiDung, "UQ__Admin__C539D763A624E431").IsUnique();

            entity.Property(e => e.ChucVu).HasMaxLength(100);
            entity.Property(e => e.MaNv)
                .HasMaxLength(20)
                .HasColumnName("MaNV");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PhongBan).HasMaxLength(100);

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.Admin)
                .HasForeignKey<Admin>(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Admin__MaNguoiDu__45F365D3");
        });

        modelBuilder.Entity<BaoCaoThongKe>(entity =>
        {
            entity.HasKey(e => e.MaBaoCao).HasName("PK__BaoCaoTh__25A9188CE1EBEDDA");

            entity.ToTable("BaoCaoThongKe");

            entity.HasIndex(e => e.LoaiBaoCao, "IX_BaoCaoThongKe_LoaiBaoCao");

            entity.HasIndex(e => e.MaAdminTao, "IX_BaoCaoThongKe_MaAdminTao");

            entity.Property(e => e.FilePath).HasMaxLength(255);
            entity.Property(e => e.LoaiBaoCao).HasMaxLength(50);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TenBaoCao).HasMaxLength(255);

            entity.HasOne(d => d.MaAdminTaoNavigation).WithMany(p => p.BaoCaoThongKes)
                .HasForeignKey(d => d.MaAdminTao)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__BaoCaoTho__MaAdm__1AD3FDA4");
        });

        modelBuilder.Entity<CanBoKtx>(entity =>
        {
            entity.HasKey(e => e.MaCanBo).HasName("PK__CanBoKTX__4003E215BC96DC5F");

            entity.ToTable("CanBoKTX");

            entity.HasIndex(e => e.MaNv, "IX_CanBoKTX_MaNV");

            entity.HasIndex(e => e.MaNv, "UQ__CanBoKTX__2725D70BC4A178EF").IsUnique();

            entity.HasIndex(e => e.MaNguoiDung, "UQ__CanBoKTX__C539D763756E3FF1").IsUnique();

            entity.Property(e => e.ChucVu).HasMaxLength(100);
            entity.Property(e => e.MaNv)
                .HasMaxLength(20)
                .HasColumnName("MaNV");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.PhongBan).HasMaxLength(100);

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.CanBoKtx)
                .HasForeignKey<CanBoKtx>(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__CanBoKTX__MaNguo__4BAC3F29");
        });

        modelBuilder.Entity<DangKyPhong>(entity =>
        {
            entity.HasKey(e => e.MaDangKy).HasName("PK__DangKyPh__BA90F02D244CF7A1");

            entity.ToTable("DangKyPhong");

            entity.HasIndex(e => e.MaSinhVien, "IX_DangKyPhong_MaSinhVien");

            entity.Property(e => e.HocKy).HasMaxLength(20);
            entity.Property(e => e.LyDoTuChoi).HasMaxLength(255);
            entity.Property(e => e.NgayDangKy)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayDuyet).HasColumnType("datetime");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("ChoDuyet");

            entity.HasOne(d => d.MaCanBoDuyetNavigation).WithMany(p => p.DangKyPhongs)
                .HasForeignKey(d => d.MaCanBoDuyet)
                .HasConstraintName("FK__DangKyPho__MaCan__6C190EBB");

            entity.HasOne(d => d.MaGiuongNavigation).WithMany(p => p.DangKyPhongs)
                .HasForeignKey(d => d.MaGiuong)
                .HasConstraintName("FK__DangKyPho__MaGiu__6B24EA82");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.DangKyPhongs)
                .HasForeignKey(d => d.MaPhong)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DangKyPho__MaPho__6A30C649");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.DangKyPhongs)
                .HasForeignKey(d => d.MaSinhVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__DangKyPho__MaSin__693CA210");
        });

        modelBuilder.Entity<Giuong>(entity =>
        {
            entity.HasKey(e => e.MaGiuong).HasName("PK__Giuong__9C9FF4DC67DD2B2D");

            entity.ToTable("Giuong");

            entity.HasIndex(e => e.MaPhong, "IX_Giuong_MaPhong");

            entity.HasIndex(e => new { e.MaPhong, e.SoGiuong }, "UQ__Giuong__1FB89A3D9C95805F").IsUnique();

            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("ConTrong");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.Giuongs)
                .HasForeignKey(d => d.MaPhong)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Giuong__MaPhong__6383C8BA");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.Giuongs)
                .HasForeignKey(d => d.MaSinhVien)
                .HasConstraintName("FK__Giuong__MaSinhVi__6477ECF3");
        });

        modelBuilder.Entity<HoaDon>(entity =>
        {
            entity.HasKey(e => e.MaHoaDon).HasName("PK__HoaDon__835ED13B70622C8B");

            entity.ToTable("HoaDon");

            entity.HasIndex(e => e.MaSinhVien, "IX_HoaDon_MaSinhVien");

            entity.HasIndex(e => e.SoHoaDon, "UQ__HoaDon__012E9E53A4DEE455").IsUnique();

            entity.Property(e => e.ChiSoDienCu).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ChiSoDienMoi).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ChiSoNuocCu).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.ChiSoNuocMoi).HasColumnType("decimal(10, 2)");
            entity.Property(e => e.MaGiaoDich).HasMaxLength(100);
            entity.Property(e => e.NgayPhatHanh).HasDefaultValueSql("(getdate())");
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayThanhToan).HasColumnType("datetime");
            entity.Property(e => e.PhiDichVu)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PhiPhat)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.PhuongThucThanhToan).HasMaxLength(50);
            entity.Property(e => e.SoHoaDon).HasMaxLength(50);
            entity.Property(e => e.TienDien)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TienNuoc)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TienPhong)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TongTien).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("ChuaThanhToan");

            entity.HasOne(d => d.MaCanBoTaoNavigation).WithMany(p => p.HoaDons)
                .HasForeignKey(d => d.MaCanBoTao)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HoaDon__MaCanBoT__02084FDA");

            entity.HasOne(d => d.MaHopDongNavigation).WithMany(p => p.HoaDons)
                .HasForeignKey(d => d.MaHopDong)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HoaDon__MaHopDon__00200768");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.HoaDons)
                .HasForeignKey(d => d.MaSinhVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HoaDon__MaSinhVi__01142BA1");
        });

        modelBuilder.Entity<HopDong>(entity =>
        {
            entity.HasKey(e => e.MaHopDong).HasName("PK__HopDong__36DD4342810A365E");

            entity.ToTable("HopDong");

            entity.HasIndex(e => e.MaSinhVien, "IX_HopDong_MaSinhVien");

            entity.HasIndex(e => e.SoHopDong, "UQ__HopDong__71C5D5BB175120E7").IsUnique();

            entity.Property(e => e.GiaThue).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.HocKy).HasMaxLength(20);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SoHopDong).HasMaxLength(50);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("HieuLuc");

            entity.HasOne(d => d.MaCanBoTaoNavigation).WithMany(p => p.HopDongs)
                .HasForeignKey(d => d.MaCanBoTao)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDong__MaCanBo__74AE54BC");

            entity.HasOne(d => d.MaGiuongNavigation).WithMany(p => p.HopDongs)
                .HasForeignKey(d => d.MaGiuong)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDong__MaGiuon__73BA3083");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.HopDongs)
                .HasForeignKey(d => d.MaPhong)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDong__MaPhong__72C60C4A");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.HopDongs)
                .HasForeignKey(d => d.MaSinhVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__HopDong__MaSinhV__71D1E811");
        });

        modelBuilder.Entity<NguoiDung>(entity =>
        {
            entity.HasKey(e => e.MaNguoiDung).HasName("PK__NguoiDun__C539D762AF53178C");

            entity.ToTable("NguoiDung");

            entity.HasIndex(e => e.Email, "IX_NguoiDung_Email");

            entity.HasIndex(e => e.Cccd, "UQ__NguoiDun__A955A0AA53440EDB").IsUnique();

            entity.HasIndex(e => e.Email, "UQ__NguoiDun__A9D10534DEC07B0D").IsUnique();

            entity.HasIndex(e => e.MaTaiKhoan, "UQ__NguoiDun__AD7C6528855CCAD4").IsUnique();

            entity.Property(e => e.Cccd)
                .HasMaxLength(20)
                .HasColumnName("CCCD");
            entity.Property(e => e.DiaChi).HasMaxLength(255);
            entity.Property(e => e.Email).HasMaxLength(100);
            entity.Property(e => e.GioiTinh).HasMaxLength(10);
            entity.Property(e => e.HoTen).HasMaxLength(100);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SoDienThoai).HasMaxLength(20);

            entity.HasOne(d => d.MaTaiKhoanNavigation).WithOne(p => p.NguoiDung)
                .HasForeignKey<NguoiDung>(d => d.MaTaiKhoan)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__NguoiDung__MaTai__403A8C7D");
        });

        modelBuilder.Entity<Phong>(entity =>
        {
            entity.HasKey(e => e.MaPhong).HasName("PK__Phong__20BD5E5BCCA32168");

            entity.ToTable("Phong");

            entity.HasIndex(e => e.MaToaNha, "IX_Phong_MaToaNha");

            entity.HasIndex(e => new { e.MaToaNha, e.SoPhong }, "UQ__Phong__AAEAE7AAADBF83FC").IsUnique();

            entity.Property(e => e.GiaPhong).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.LoaiPhong).HasMaxLength(50);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.SoNguoiHienTai).HasDefaultValue(0);
            entity.Property(e => e.SoPhong).HasMaxLength(20);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("ConTrong");

            entity.HasOne(d => d.MaToaNhaNavigation).WithMany(p => p.Phongs)
                .HasForeignKey(d => d.MaToaNha)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__Phong__MaToaNha__5DCAEF64");
        });

        modelBuilder.Entity<SinhVien>(entity =>
        {
            entity.HasKey(e => e.MaSinhVien).HasName("PK__SinhVien__939AE7755D364360");

            entity.ToTable("SinhVien");

            entity.HasIndex(e => e.MaSv, "IX_SinhVien_MaSV");

            entity.HasIndex(e => e.MaSv, "UQ__SinhVien__2725081B7CA0CDCF").IsUnique();

            entity.HasIndex(e => e.MaNguoiDung, "UQ__SinhVien__C539D763BF89044E").IsUnique();

            entity.Property(e => e.DiemTb)
                .HasColumnType("decimal(3, 2)")
                .HasColumnName("DiemTB");
            entity.Property(e => e.Khoa).HasMaxLength(100);
            entity.Property(e => e.Lop).HasMaxLength(50);
            entity.Property(e => e.MaSv)
                .HasMaxLength(20)
                .HasColumnName("MaSV");
            entity.Property(e => e.Nganh).HasMaxLength(100);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");

            entity.HasOne(d => d.MaNguoiDungNavigation).WithOne(p => p.SinhVien)
                .HasForeignKey<SinhVien>(d => d.MaNguoiDung)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__SinhVien__MaNguo__5165187F");
        });

        modelBuilder.Entity<TaiKhoan>(entity =>
        {
            entity.HasKey(e => e.MaTaiKhoan).HasName("PK__TaiKhoan__AD7C65295FFBE357");

            entity.ToTable("TaiKhoan");

            entity.HasIndex(e => e.TenDangNhap, "IX_TaiKhoan_TenDangNhap");

            entity.HasIndex(e => e.TenDangNhap, "UQ__TaiKhoan__55F68FC023439B25").IsUnique();

            entity.Property(e => e.MatKhau).HasMaxLength(255);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TenDangNhap).HasMaxLength(50);
            entity.Property(e => e.TrangThai).HasDefaultValue(true);
            entity.Property(e => e.VaiTro).HasMaxLength(20);
        });

        modelBuilder.Entity<ThongBao>(entity =>
        {
            entity.HasKey(e => e.MaThongBao).HasName("PK__ThongBao__04DEB54E177D8538");

            entity.ToTable("ThongBao");

            entity.Property(e => e.DaDoc).HasDefaultValue(false);
            entity.Property(e => e.LoaiNguoiNhan).HasMaxLength(20);
            entity.Property(e => e.LoaiThongBao).HasMaxLength(50);
            entity.Property(e => e.NgayDoc).HasColumnType("datetime");
            entity.Property(e => e.NgayGui)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TieuDe).HasMaxLength(255);

            entity.HasOne(d => d.MaCanBoGuiNavigation).WithMany(p => p.ThongBaoMaCanBoGuiNavigations)
                .HasForeignKey(d => d.MaCanBoGui)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ThongBao__MaCanB__10566F31");

            entity.HasOne(d => d.MaCanBoNhanNavigation).WithMany(p => p.ThongBaoMaCanBoNhanNavigations)
                .HasForeignKey(d => d.MaCanBoNhan)
                .HasConstraintName("FK__ThongBao__MaCanB__0F624AF8");

            entity.HasOne(d => d.MaSinhVienNhanNavigation).WithMany(p => p.ThongBaos)
                .HasForeignKey(d => d.MaSinhVienNhan)
                .HasConstraintName("FK__ThongBao__MaSinh__0E6E26BF");
        });

        modelBuilder.Entity<ToaNha>(entity =>
        {
            entity.HasKey(e => e.MaToaNha).HasName("PK__ToaNha__BD2DD1619A64A82E");

            entity.ToTable("ToaNha");

            entity.HasIndex(e => e.MaToa, "UQ__ToaNha__314934452DDD1C25").IsUnique();

            entity.Property(e => e.LoaiToaNha).HasMaxLength(20);
            entity.Property(e => e.MaToa).HasMaxLength(10);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TenToaNha).HasMaxLength(100);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("HoatDong");

            entity.HasOne(d => d.MaCanBoQuanLyNavigation).WithMany(p => p.ToaNhas)
                .HasForeignKey(d => d.MaCanBoQuanLy)
                .HasConstraintName("FK__ToaNha__MaCanBoQ__571DF1D5");
        });

        modelBuilder.Entity<ViPham>(entity =>
        {
            entity.HasKey(e => e.MaViPham).HasName("PK__ViPham__F1921D89D7D6B842");

            entity.ToTable("ViPham");

            entity.HasIndex(e => e.MaSinhVien, "IX_ViPham_MaSinhVien");

            entity.Property(e => e.MucDo).HasMaxLength(20);
            entity.Property(e => e.MucPhat)
                .HasDefaultValue(0m)
                .HasColumnType("decimal(18, 2)");
            entity.Property(e => e.NgayGhi)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayViPham)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.TenViPham).HasMaxLength(100);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("ChoDuyet");

            entity.HasOne(d => d.MaCanBoGhiNavigation).WithMany(p => p.ViPhams)
                .HasForeignKey(d => d.MaCanBoGhi)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ViPham__MaCanBoG__09A971A2");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.ViPhams)
                .HasForeignKey(d => d.MaSinhVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__ViPham__MaSinhVi__08B54D69");
        });

        modelBuilder.Entity<YeuCauBaoTri>(entity =>
        {
            entity.HasKey(e => e.MaYeuCau).HasName("PK__YeuCauBa__CFA5DF4E197D47EB");

            entity.ToTable("YeuCauBaoTri");

            entity.Property(e => e.ChiPhi).HasColumnType("decimal(18, 2)");
            entity.Property(e => e.LoaiYeuCau).HasMaxLength(50);
            entity.Property(e => e.NgayTao)
                .HasDefaultValueSql("(getdate())")
                .HasColumnType("datetime");
            entity.Property(e => e.NgayXuLy).HasColumnType("datetime");
            entity.Property(e => e.TieuDe).HasMaxLength(255);
            entity.Property(e => e.TrangThai)
                .HasMaxLength(20)
                .HasDefaultValue("ChoDuyet");

            entity.HasOne(d => d.MaCanBoXuLyNavigation).WithMany(p => p.YeuCauBaoTris)
                .HasForeignKey(d => d.MaCanBoXuLy)
                .HasConstraintName("FK__YeuCauBao__MaCan__17036CC0");

            entity.HasOne(d => d.MaPhongNavigation).WithMany(p => p.YeuCauBaoTris)
                .HasForeignKey(d => d.MaPhong)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauBao__MaPho__151B244E");

            entity.HasOne(d => d.MaSinhVienNavigation).WithMany(p => p.YeuCauBaoTris)
                .HasForeignKey(d => d.MaSinhVien)
                .OnDelete(DeleteBehavior.ClientSetNull)
                .HasConstraintName("FK__YeuCauBao__MaSin__160F4887");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}
