using Api_Gateway.DAL;
using Api_Gateway.DTO.Auth;
using Api_Gateway.DTO.Common;
using Api_Gateway.Models;
using Api_Gateway.Services;
using Microsoft.EntityFrameworkCore;

namespace Api_Gateway.BLL
{
    public class AuthBLL
    {
        private readonly QuanLyKTXContext _context;
        private readonly JwtService _jwtService;
        private readonly PasswordService _passwordService;

        public AuthBLL(QuanLyKTXContext context, JwtService jwtService, PasswordService passwordService)
        {
            _context = context;
            _jwtService = jwtService;
            _passwordService = passwordService;
        }

        public async Task<ApiResponse<LoginResponseDTO>> Login(LoginRequestDTO request)
        {
            try
            {
                // Tìm tài khoản
                var taiKhoan = await _context.TaiKhoan
                    .Include(t => t.NguoiDung)
                    .FirstOrDefaultAsync(t => t.TenDangNhap == request.TenDangNhap);

                if (taiKhoan == null)
                {
                    return ApiResponse<LoginResponseDTO>.ErrorResponse("Tên đăng nhập không tồn tại");
                }

                // Kiểm tra mật khẩu
                if (!_passwordService.VerifyPassword(request.MatKhau, taiKhoan.MatKhau))
                {
                    return ApiResponse<LoginResponseDTO>.ErrorResponse("Mật khẩu không đúng");
                }

                // Kiểm tra trạng thái
                if (!taiKhoan.TrangThai)
                {
                    return ApiResponse<LoginResponseDTO>.ErrorResponse("Tài khoản đã bị khóa");
                }

                // Lấy thông tin actor
                int? maActor = null;
                if (taiKhoan.VaiTro == "Admin")
                {
                    var admin = await _context.Admin.FirstOrDefaultAsync(a => a.MaNguoiDung == taiKhoan.NguoiDung!.MaNguoiDung);
                    maActor = admin?.MaAdmin;
                }
                else if (taiKhoan.VaiTro == "CanBo")
                {
                    var canBo = await _context.CanBoKTX.FirstOrDefaultAsync(c => c.MaNguoiDung == taiKhoan.NguoiDung!.MaNguoiDung);
                    maActor = canBo?.MaCanBo;
                }
                else if (taiKhoan.VaiTro == "SinhVien")
                {
                    var sinhVien = await _context.SinhVien.FirstOrDefaultAsync(s => s.MaNguoiDung == taiKhoan.NguoiDung!.MaNguoiDung);
                    maActor = sinhVien?.MaSinhVien;
                }

                // Tạo token
                var token = _jwtService.GenerateToken(
                    taiKhoan.MaTaiKhoan,
                    taiKhoan.TenDangNhap,
                    taiKhoan.VaiTro,
                    taiKhoan.NguoiDung!.MaNguoiDung,
                    maActor
                );

                var response = new LoginResponseDTO
                {
                    Token = token,
                    VaiTro = taiKhoan.VaiTro,
                    MaTaiKhoan = taiKhoan.MaTaiKhoan,
                    MaNguoiDung = taiKhoan.NguoiDung.MaNguoiDung,
                    HoTen = taiKhoan.NguoiDung.HoTen,
                    Email = taiKhoan.NguoiDung.Email,
                    MaActor = maActor
                };

                return ApiResponse<LoginResponseDTO>.SuccessResponse(response, "Đăng nhập thành công");
            }
            catch (Exception ex)
            {
                return ApiResponse<LoginResponseDTO>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }

        public async Task<ApiResponse<string>> Register(RegisterRequestDTO request)
        {
            using var transaction = await _context.Database.BeginTransactionAsync();
            try
            {
                // Kiểm tra tên đăng nhập đã tồn tại
                if (await _context.TaiKhoan.AnyAsync(t => t.TenDangNhap == request.TenDangNhap))
                {
                    return ApiResponse<string>.ErrorResponse("Tên đăng nhập đã tồn tại");
                }

                // Kiểm tra email đã tồn tại
                if (await _context.NguoiDung.AnyAsync(n => n.Email == request.Email))
                {
                    return ApiResponse<string>.ErrorResponse("Email đã được sử dụng");
                }

                // Kiểm tra CCCD đã tồn tại
                if (await _context.NguoiDung.AnyAsync(n => n.CCCD == request.CCCD))
                {
                    return ApiResponse<string>.ErrorResponse("CCCD đã được sử dụng");
                }

                // Tạo tài khoản
                var taiKhoan = new TaiKhoan
                {
                    TenDangNhap = request.TenDangNhap,
                    MatKhau = _passwordService.HashPassword(request.MatKhau),
                    VaiTro = request.VaiTro,
                    TrangThai = true
                };
                _context.TaiKhoan.Add(taiKhoan);
                await _context.SaveChangesAsync();

                // Tạo người dùng
                var nguoiDung = new NguoiDung
                {
                    MaTaiKhoan = taiKhoan.MaTaiKhoan,
                    HoTen = request.HoTen,
                    GioiTinh = request.GioiTinh,
                    NgaySinh = request.NgaySinh,
                    SoDienThoai = request.SoDienThoai,
                    Email = request.Email,
                    CCCD = request.CCCD,
                    DiaChi = request.DiaChi
                };
                _context.NguoiDung.Add(nguoiDung);
                await _context.SaveChangesAsync();

                // Tạo bảng riêng theo vai trò
                if (request.VaiTro == "Admin")
                {
                    var admin = new Admin
                    {
                        MaNguoiDung = nguoiDung.MaNguoiDung,
                        MaNV = request.MaNV!,
                        ChucVu = request.ChucVu,
                        PhongBan = request.PhongBan,
                        NgayVaoLam = request.NgayVaoLam
                    };
                    _context.Admin.Add(admin);
                }
                else if (request.VaiTro == "CanBo")
                {
                    var canBo = new CanBoKTX
                    {
                        MaNguoiDung = nguoiDung.MaNguoiDung,
                        MaNV = request.MaNV!,
                        ChucVu = request.ChucVu,
                        PhongBan = request.PhongBan,
                        NgayVaoLam = request.NgayVaoLam
                    };
                    _context.CanBoKTX.Add(canBo);
                }
                else if (request.VaiTro == "SinhVien")
                {
                    var sinhVien = new SinhVien
                    {
                        MaNguoiDung = nguoiDung.MaNguoiDung,
                        MaSV = request.MaSV!,
                        Khoa = request.Khoa,
                        Nganh = request.Nganh,
                        Lop = request.Lop,
                        NamHoc = request.NamHoc,
                        DiemTB = request.DiemTB
                    };
                    _context.SinhVien.Add(sinhVien);
                }

                await _context.SaveChangesAsync();
                await transaction.CommitAsync();

                return ApiResponse<string>.SuccessResponse("Đăng ký thành công", "Đăng ký thành công");
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                return ApiResponse<string>.ErrorResponse($"Lỗi: {ex.Message}");
            }
        }
    }
}
